import { transpileSync } from '@rindo/core/compiler';
import type { TranspileOptions, TranspileResults } from '@rindo/core/internal';
import { isString } from '@utils';

export function transpile(input: string, opts: TranspileOptions = {}): TranspileResults {
  opts = {
    ...opts,
    componentExport: null,
    componentMetadata: 'compilerstatic',
    coreImportPath: isString(opts.coreImportPath) ? opts.coreImportPath : '@rindo/core/internal/testing',
    currentDirectory: opts.currentDirectory || process.cwd(),
    module: 'cjs', // always use commonjs since we're in a node environment
    proxy: null,
    sourceMap: 'inline',
    style: null,
    styleImportData: 'queryparams',
    target: 'es2015', // default to es2015
    transformAliasedImportPaths: parseRindoTranspilePaths(process.env.__RINDO_TRANSPILE_PATHS__),
  };

  try {
    const v = process.versions.node.split('.');
    if (parseInt(v[0], 10) >= 10) {
      // let's go with ES2017 for node 10 and above
      opts.target = 'es2017';
    }
  } catch (e) {}

  return transpileSync(input, opts);
}

/**
 * Turn a value which we assert can be 'true' or 'false' to a boolean.
 *
 * @param rindoTranspilePaths a value to 'parse'
 * @returns a boolean
 */
function parseRindoTranspilePaths(rindoTranspilePaths: string | undefined): boolean {
  return rindoTranspilePaths === 'true' ? true : false;
}
