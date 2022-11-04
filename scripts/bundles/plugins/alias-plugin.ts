import { Plugin } from 'rollup';
import { BuildOptions } from '../../utils/options';
import { join } from 'path';

export function aliasPlugin(opts: BuildOptions): Plugin {
  const alias = new Map([
    ['@app-data', '@rindo/core/internal/app-data'],
    ['@app-globals', '@rindo/core/internal/app-globals'],
    ['@hydrate-factory', '@rindo/core/hydrate-factory'],
    ['@rindo/core/mock-doc', '@rindo/core/mock-doc'],
    ['@rindo/core/testing', '@rindo/core/testing'],
    ['@sys-api-node', './index.js'],
  ]);

  // ensure we use the same one
  const helperResolvers = new Set(['is-resolvable', 'path-is-absolute']);

  // ensure we use the same one
  const nodeResolvers = new Map([['source-map', join(opts.nodeModulesDir, 'source-map', 'source-map.js')]]);

  const empty = new Set([
    // we never use chalk, but many projects still pull it in
    'chalk',
  ]);

  return {
    name: 'aliasPlugin',
    resolveId(id) {
      const externalId = alias.get(id);
      if (externalId) {
        return {
          id: externalId,
          external: true,
        };
      }
      if (id === '@runtime') {
        return join(opts.buildDir, 'runtime', 'index.js');
      }
      if (id === '@utils') {
        return join(opts.buildDir, 'utils', 'index.js');
      }
      if (helperResolvers.has(id)) {
        return join(opts.bundleHelpersDir, `${id}.js`);
      }
      if (empty.has(id)) {
        return join(opts.bundleHelpersDir, 'empty.js');
      }
      if (nodeResolvers.has(id)) {
        return nodeResolvers.get(id);
      }
      return null;
    },
  };
}
