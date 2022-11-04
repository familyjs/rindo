import * as d from '../../declarations';
import { buildWarn } from '@utils';

export const validatePlugins = (config: d.Config, diagnostics: d.Diagnostic[]) => {
  const userPlugins = config.plugins;

  if (!config.rollupPlugins) {
    config.rollupPlugins = {};
  }
  if (!Array.isArray(userPlugins)) {
    config.plugins = [];
    return;
  }

  const rollupPlugins = userPlugins.filter(plugin => {
    return !!(plugin && typeof plugin === 'object' && !plugin.pluginType);
  });

  const hasResolveNode = rollupPlugins.some(p => p.name === 'node-resolve');
  const hasCommonjs = rollupPlugins.some(p => p.name === 'commonjs');

  if (hasCommonjs) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `Rindo already uses "@rollup/plugin-commonjs", please remove it from your "rindo.config.ts" plugins.
    You can configure the commonjs settings using the "commonjs" property in "rindo.config.ts`;
  }

  if (hasResolveNode) {
    const warn = buildWarn(diagnostics);
    warn.messageText = `Rindo already uses "@rollup/plugin-commonjs", please remove it from your "rindo.config.ts" plugins.
    You can configure the commonjs settings using the "commonjs" property in "rindo.config.ts`;
  }

  config.rollupPlugins.before = [...(config.rollupPlugins.before || []), ...rollupPlugins.filter(({ name }) => name !== 'node-resolve' && name !== 'commonjs')];

  config.plugins = userPlugins.filter(plugin => {
    return !!(plugin && typeof plugin === 'object' && plugin.pluginType);
  });
};
