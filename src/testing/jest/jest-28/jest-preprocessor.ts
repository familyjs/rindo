import type { TransformedSource, TransformOptions } from '@jest/transform';
import { ts } from '@rindo/core/compiler';
import type { Diagnostic, TranspileOptions } from '@rindo/core/internal';
import { loadTypeScriptDiagnostic, normalizePath } from '@utils';

import { transpile } from '../../test-transpile';

/**
 * Constant used for cache busting when the contents of this file have changed. When modifying this file, it's advised
 * this value be monotonically incremented.
 */
const CACHE_BUSTER = 8;

/**
 * Fields containing the consuming library's `tsconfig.json#options` entry. The first is the original representation,
 * where the second is the stringified version. These fields are cached to prevent unnecessary I/O & repetitive
 * stringification of the read options. Note that this caching does not persist across multiple Jest workers (I.E.
 * every Jest worker will read the `tsconfig.json` file and stringify it's `options` entry.
 */
let _tsCompilerOptions: ts.CompilerOptions | null = null;
let _tsCompilerOptionsKey: string | null = null;

export const jestPreprocessor = {
  /**
   * Transforms a file to CommonJS to be used by Jest. The API for `process` is described in the
   * ["Writing custom transformers"](https://jestjs.io/docs/code-transformation#writing-custom-transformers)
   * documentation on the jest site. Unfortunately, the URL is not versioned at the time of this writing. For
   * reference, the v28 docs were referenced.
   *
   * @param sourceText the contents of the source file
   * @param sourcePath the path to the source file
   * @param options the transformation options to apply to each file
   * @returns the transformed file contents if the file should be transformed. returns the original source otherwise
   */
  process(sourceText: string, sourcePath: string, options: TransformOptions): TransformedSource {
    const transformOptions = options.config;

    if (shouldTransform(sourcePath, sourceText)) {
      const opts: TranspileOptions = {
        file: sourcePath,
        currentDirectory: transformOptions.rootDir,
      };

      const tsCompilerOptions: ts.CompilerOptions | null = getCompilerOptions(transformOptions.rootDir);
      if (tsCompilerOptions) {
        if (tsCompilerOptions.baseUrl) {
          opts.baseUrl = tsCompilerOptions.baseUrl;
        }
        if (tsCompilerOptions.paths) {
          opts.paths = tsCompilerOptions.paths;
        }
      }

      const results = transpile(sourceText, opts);

      const hasErrors = results.diagnostics.some((diagnostic) => diagnostic.level === 'error');

      if (results.diagnostics && hasErrors) {
        const msg = results.diagnostics.map(formatDiagnostic).join('\n\n');
        throw new Error(msg);
      }

      return { code: results.code };
    }

    return { code: sourceText };
  },

  /**
   * Generates a key used to cache the results of transforming a file. This helps avoid re-processing a file via the
   * `transform` function unnecessarily (when no changes have occurred). The API for `getCacheKey` is described in the
   * ["Writing custom transformers"](https://jestjs.io/docs/code-transformation#writing-custom-transformers)
   * documentation on the jest site. Unfortunately, the URL is not versioned at the time of this writing. For
   * reference, the v28 docs were referenced.
   *
   * @param sourceText the contents of the source file
   * @param sourcePath the path to the source file
   * @param options the transformation options to apply to each file
   * @returns the key to cache a file with
   */
  getCacheKey(sourceText: string, sourcePath: string, options: TransformOptions): string {
    const transformOptions = options.config;

    if (!_tsCompilerOptionsKey) {
      const opts = getCompilerOptions(transformOptions.rootDir);
      _tsCompilerOptionsKey = JSON.stringify(opts);
    }

    const key = [
      process.version,
      _tsCompilerOptionsKey,
      sourceText,
      sourcePath,
      options,
      !!options.instrument,
      CACHE_BUSTER,
    ];

    return key.join(':');
  },
};

function formatDiagnostic(diagnostic: Diagnostic) {
  let m = '';

  if (diagnostic.relFilePath) {
    m += diagnostic.relFilePath;
    if (typeof diagnostic.lineNumber === 'number') {
      m += ':' + diagnostic.lineNumber + 1;
      if (typeof diagnostic.columnNumber === 'number') {
        m += ':' + diagnostic.columnNumber;
      }
    }
    m += '\n';
  }

  m += diagnostic.messageText;

  return m;
}

/**
 * Read the TypeScript compiler configuration file from disk
 * @param rootDir the location to search for the config file
 * @returns the configuration, or `null` if the file cannot be found
 */
function getCompilerOptions(rootDir: string): ts.CompilerOptions | null {
  if (_tsCompilerOptions) {
    return _tsCompilerOptions;
  }

  if (typeof rootDir !== 'string') {
    return null;
  }

  rootDir = normalizePath(rootDir);

  const tsconfigFilePath = ts.findConfigFile(rootDir, ts.sys.fileExists);
  if (!tsconfigFilePath) {
    return null;
  }

  const tsconfigResults = ts.readConfigFile(tsconfigFilePath, ts.sys.readFile);

  if (tsconfigResults.error) {
    throw new Error(formatDiagnostic(loadTypeScriptDiagnostic(tsconfigResults.error)));
  }

  const parseResult = ts.parseJsonConfigFileContent(
    tsconfigResults.config,
    ts.sys,
    rootDir,
    undefined,
    tsconfigFilePath,
  );

  _tsCompilerOptions = parseResult.options;
  return _tsCompilerOptions;
}

/**
 * Determines if a file should be transformed prior to being consumed by Jest, based on the file name and its contents
 * @param filePath the path of the file
 * @param sourceText the contents of the file
 * @returns `true` if the file should be transformed, `false` otherwise
 */
export function shouldTransform(filePath: string, sourceText: string): boolean {
  const ext = (filePath.split('.').pop() ?? '').toLowerCase().split('?')[0];

  if (ext === 'ts' || ext === 'tsx' || ext === 'jsx') {
    // typescript extensions (to include .d.ts)
    return true;
  }
  if (ext === 'mjs') {
    // es module extensions
    return true;
  }
  if (ext === 'js') {
    // there may be false positives here
    // but worst case scenario a commonjs file is transpiled to commonjs
    if (sourceText.includes('import ') || sourceText.includes('import.') || sourceText.includes('import(')) {
      return true;
    }
    if (sourceText.includes('export ')) {
      return true;
    }
  }
  if (ext === 'css') {
    // convert a standard css file into an NodeJS ready file
    return true;
  }
  return false;
}
