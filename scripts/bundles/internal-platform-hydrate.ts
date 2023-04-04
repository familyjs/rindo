import rollupCommonjs from '@rollup/plugin-commonjs';
import rollupResolve from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { join } from 'path';
import { RollupOptions } from 'rollup';

import { getBanner } from '../utils/banner';
import { bundleDts } from '../utils/bundle-dts';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { aliasPlugin } from './plugins/alias-plugin';
import { prettyMinifyPlugin } from './plugins/pretty-minify';
import { replacePlugin } from './plugins/replace-plugin';

export async function internalHydrate(opts: BuildOptions) {
  const inputHydrateDir = join(opts.buildDir, 'hydrate');
  const outputInternalHydrateDir = join(opts.output.internalDir, 'hydrate');

  await fs.emptyDir(outputInternalHydrateDir);

  // write @rindo/core/internal/hydrate/package.json
  writePkgJson(opts, outputInternalHydrateDir, {
    name: '@rindo/core/internal/hydrate',
    description:
      'Rindo internal hydrate platform to be imported by the Rindo Compiler. Breaking changes can and will happen at any time.',
    main: 'index.js',
  });

  await createHydrateRunnerDtsBundle(opts, inputHydrateDir, outputInternalHydrateDir);

  const hydratePlatformInput = join(inputHydrateDir, 'platform', 'index.js');
  const internalHydratePlatformBundle: RollupOptions = {
    input: hydratePlatformInput,
    output: {
      format: 'es',
      dir: outputInternalHydrateDir,
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
      banner: getBanner(opts, 'Rindo Hydrate Platform'),
      preferConst: true,
    },
    plugins: [
      {
        name: 'internalHydratePlugin',
        resolveId(importee) {
          if (importee === '@platform') {
            return hydratePlatformInput;
          }
        },
      },
      aliasPlugin(opts),
      replacePlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
      prettyMinifyPlugin(opts),
    ],
  };

  const internalHydrateRunnerBundle: RollupOptions = {
    input: join(inputHydrateDir, 'runner', 'index.js'),
    output: {
      format: 'es',
      file: join(outputInternalHydrateDir, 'runner.js'),
      banner: getBanner(opts, 'Rindo Hydrate Runner'),
      preferConst: true,
    },
    plugins: [
      aliasPlugin(opts),
      replacePlugin(opts),
      rollupResolve({
        preferBuiltins: true,
      }),
      rollupCommonjs(),
      prettyMinifyPlugin(opts),
    ],
  };

  return [internalHydratePlatformBundle, internalHydrateRunnerBundle];
}

async function createHydrateRunnerDtsBundle(opts: BuildOptions, inputHydrateDir: string, outputDir: string) {
  // bundle @rindo/core/internal/hydrate/runner.d.ts
  const dtsEntry = join(inputHydrateDir, 'runner', 'index.d.ts');
  const dtsContent = await bundleDts(opts, dtsEntry);

  const outputPath = join(outputDir, 'runner.d.ts');
  await fs.writeFile(outputPath, dtsContent);
}
