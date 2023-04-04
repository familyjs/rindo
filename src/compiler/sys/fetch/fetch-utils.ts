import { isFunction, normalizePath } from '@utils';

import type * as d from '../../../declarations';
import { isCommonDirModuleFile, isTsFile, isTsxFile } from '../resolve/resolve-utils';

/**
 * A fetch wrapper which dispatches to `sys.fetch` if present, and otherwise
 * uses `global.fetch`.
 *
 * @param sys a compiler system object
 * @param input a `RequestInfo` object
 * @param init an optional `RequestInit` object
 * @returns a Promise wrapping a response
 */
export const httpFetch = (sys: d.CompilerSystem, input: RequestInfo, init?: RequestInit): Promise<Response> => {
  if (sys && isFunction(sys.fetch)) {
    return sys.fetch(input, init);
  }
  return fetch(input, init);
};

export const packageVersions = new Map<string, string>();
export const known404Urls = new Set<string>();

/**
 * Get the URL for a Rindo module given the path to the compiler
 *
 * @param compilerExe the path to the compiler executable
 * @param path the path to the module or file in question
 * @returns a URL for the file of interest
 */
export const getRindoModuleUrl = (compilerExe: string, path: string): string => {
  path = normalizePath(path);
  let parts = path.split('/');
  const nmIndex = parts.lastIndexOf('node_modules');
  if (nmIndex > -1 && nmIndex < parts.length - 1) {
    parts = parts.slice(nmIndex + 1);
    if (parts[0].startsWith('@')) {
      parts = parts.slice(2);
    } else {
      parts = parts.slice(1);
    }
    path = parts.join('/');
  }
  const rindoRootUrl = new URL('../', compilerExe).href;
  return new URL('./' + path, rindoRootUrl).href;
};

export const getCommonDirUrl = (
  sys: d.CompilerSystem,
  pkgVersions: Map<string, string>,
  dirPath: string,
  fileName: string
) => getNodeModuleFetchUrl(sys, pkgVersions, dirPath) + '/' + fileName;

export const getNodeModuleFetchUrl = (sys: d.CompilerSystem, pkgVersions: Map<string, string>, filePath: string) => {
  // /node_modules/lodash/package.json
  filePath = normalizePath(filePath);

  // ["node_modules", "lodash", "package.json"]
  let pathParts = filePath.split('/').filter((p) => p.length);

  const nmIndex = pathParts.lastIndexOf('node_modules');
  if (nmIndex > -1 && nmIndex < pathParts.length - 1) {
    pathParts = pathParts.slice(nmIndex + 1);
  }

  let moduleId = pathParts.shift();

  if (moduleId.startsWith('@')) {
    moduleId += '/' + pathParts.shift();
  }

  const path = pathParts.join('/');
  if (moduleId === '@rindo/core') {
    const compilerExe = sys.getCompilerExecutingPath();
    return getRindoModuleUrl(compilerExe, path);
  }

  return sys.getRemoteModuleUrl({
    moduleId,
    version: pkgVersions.get(moduleId),
    path,
  });
};

export const skipFilePathFetch = (filePath: string) => {
  if (isTsFile(filePath) || isTsxFile(filePath)) {
    // don't bother trying to resolve  node_module packages w/ typescript files
    // they should already be .js files
    return true;
  }

  const pathParts = filePath.split('/');
  const secondToLast = pathParts[pathParts.length - 2];
  const lastPart = pathParts[pathParts.length - 1];
  if (secondToLast === 'node_modules' && isCommonDirModuleFile(lastPart)) {
    // /node_modules/index.js
    // /node_modules/lodash.js
    // we just already know this is bogus, so don't bother
    return true;
  }

  return false;
};

export const skipUrlFetch = (url: string) =>
  // files we just already know not to try to resolve request
  knownUrlSkips.some((knownSkip) => url.endsWith(knownSkip));

const knownUrlSkips = [
  '/@rindo/core/internal.js',
  '/@rindo/core/internal.json',
  '/@rindo/core/internal.mjs',
  '/@rindo/core/internal/rindo-core.js/index.json',
  '/@rindo/core/internal/rindo-core.js.json',
  '/@rindo/core/internal/rindo-core.js/package.json',
  '/@rindo/core.js',
  '/@rindo/core.json',
  '/@rindo/core.mjs',
  '/@rindo/core.css',
  '/@rindo/core/index.js',
  '/@rindo/core/index.json',
  '/@rindo/core/index.mjs',
  '/@rindo/core/index.css',
  '/@rindo/package.json',
];
