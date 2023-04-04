import { loadRollupDiagnostics } from '@utils';

import type * as d from '../../../declarations';
import type { BundleOptions } from '../../bundle/bundle-interface';
import { bundleOutput } from '../../bundle/bundle-output';
import { RINDO_INTERNAL_HYDRATE_ID } from '../../bundle/entry-alias-ids';
import { hydrateComponentTransform } from '../../transformers/component-hydrate/tranform-to-hydrate-component';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { updateRindoCoreImports } from '../../transformers/update-rindo-core-import';
import { getHydrateBuildConditionals } from './hydrate-build-conditionals';

export const bundleHydrateFactory = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  _build: d.BuildConditionals,
  appFactoryEntryCode: string
) => {
  try {
    const bundleOpts: BundleOptions = {
      id: 'hydrate',
      platform: 'hydrate',
      conditionals: getHydrateBuildConditionals(buildCtx.components),
      customTransformers: getHydrateCustomTransformer(config, compilerCtx),
      inlineDynamicImports: true,
      inputs: {
        '@app-factory-entry': '@app-factory-entry',
      },
      loader: {
        '@app-factory-entry': appFactoryEntryCode,
      },
    };

    const rollupBuild = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
    return rollupBuild;
  } catch (e: any) {
    if (!buildCtx.hasError) {
      // TODO: Implement a type guard that balances using our own copy of Rollup types (which are
      // breakable) and type safety (so that the error variable may be something other than `any`)
      loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    }
  }
  return undefined;
};

const getHydrateCustomTransformer = (config: d.ValidatedConfig, compilerCtx: d.CompilerCtx) => {
  const transformOpts: d.TransformOptions = {
    coreImportPath: RINDO_INTERNAL_HYDRATE_ID,
    componentExport: null,
    componentMetadata: null,
    currentDirectory: config.sys.getCurrentDirectory(),
    proxy: null,
    style: 'static',
    styleImportData: 'queryparams',
  };

  return [
    updateRindoCoreImports(transformOpts.coreImportPath),
    hydrateComponentTransform(compilerCtx, transformOpts),
    removeCollectionImports(compilerCtx),
  ];
};
