import type { BuildOptions as ESBuildOptions } from 'esbuild';
import fs from 'fs-extra';
import { join } from 'path';

import { copyRindoInternalDts } from '../bundles/internal';
import type { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { getInternalAppDataBundles } from './internal-app-data';
import { getInternalClientBundles } from './internal-platform-client';
import { getInternalPlatformHydrateBundles } from './internal-platform-hydrate';
import { getInternalTestingBundle } from './internal-platform-testing';
import { getBaseEsbuildOptions, runBuilds } from './util';

/**
 * Run the build for the `internal/` directory, copying and modifying files
 * as-needed while also creating and then building the various bundles that need
 * to be written to `internal/`.
 *
 * @param opts Build options for the current build
 * @returns a Promise wrapping the state of the build
 */
export async function buildInternal(opts: BuildOptions) {
  const inputInternalDir = join(opts.buildDir, 'internal');

  await fs.emptyDir(opts.output.internalDir);

  await copyRindoInternalDts(opts, opts.output.internalDir);

  await copyUtilsDtsFiles(opts);

  await copyRindoCoreEntry(opts);

  // copy @rindo/core/internal default entry, which defaults to client
  // but we're not exposing all of Rindo's internal code (only the types)
  await fs.copyFile(join(inputInternalDir, 'default.js'), join(opts.output.internalDir, 'index.js'));

  // write @rindo/core/internal/package.json
  writePkgJson(opts, opts.output.internalDir, {
    name: '@rindo/core/internal',
    description:
      'Rindo internals only to be imported by the Rindo Compiler. Breaking changes can and will happen at any time.',
    main: 'index.js',
    types: 'index.d.ts',
    sideEffects: false,
  });

  // this is used in several of our bundles, so we bundle it here in one spot
  const shadowCSSBundle: ESBuildOptions = {
    ...getBaseEsbuildOptions(),
    entryPoints: [join(opts.srcDir, 'utils', 'shadow-css.ts')],
    format: 'esm',
    outfile: join(opts.output.internalDir, 'client', 'shadow-css.js'),
    platform: 'node',
  };

  const clientPlatformBundles = await getInternalClientBundles(opts);
  const hydratePlatformBundles = await getInternalPlatformHydrateBundles(opts);
  const appDataBundles = await getInternalAppDataBundles(opts);
  const internalTestingBundle = await getInternalTestingBundle(opts);

  return runBuilds(
    [shadowCSSBundle, ...clientPlatformBundles, ...hydratePlatformBundles, internalTestingBundle, ...appDataBundles],
    opts,
  );
}

async function copyRindoCoreEntry(opts: BuildOptions) {
  // write @rindo/core entry
  const rindoCoreSrcDir = join(opts.srcDir, 'internal', 'rindo-core');
  const rindoCoreDstDir = join(opts.output.internalDir, 'rindo-core');
  await fs.ensureDir(rindoCoreDstDir);
  await fs.copy(rindoCoreSrcDir, rindoCoreDstDir);
}

/**
 * Copy `.d.ts` files built from `src/utils` to `internal/utils` so that types
 * exported from utility modules can be referenced by other typedefs (in
 * particular by our declarations).
 *
 * Some modules within `@utils` incorporate external types which aren't bundled
 * so we selectively copy only `.d.ts` files which are 1) standalone and 2) export
 * a type that other modules in the codebase (in, for instance, `src/compiler/`
 * or `src/cli/`) depend on.
 *
 * @param opts options for the rollup build
 */
const copyUtilsDtsFiles = async (opts: BuildOptions) => {
  const outputDirPath = join(opts.output.internalDir, 'utils');
  await fs.ensureDir(outputDirPath);

  // copy the `.d.ts` file corresponding to `src/utils/result.ts`
  const resultDtsFilePath = join(opts.buildDir, 'utils', 'result.d.ts');
  const resultDtsOutputFilePath = join(opts.output.internalDir, 'utils', 'result.d.ts');
  await fs.copyFile(resultDtsFilePath, resultDtsOutputFilePath);

  const utilsIndexDtsPath = join(opts.output.internalDir, 'utils', 'index.d.ts');
  // here we write a simple module that re-exports `./result` so that imports
  // elsewhere like `import { result } from '@utils'` will resolve correctly
  await fs.writeFile(utilsIndexDtsPath, `export * as result from "./result"`);
};
