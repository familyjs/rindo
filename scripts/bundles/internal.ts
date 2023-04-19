import fs from 'fs-extra';
import type { BuildOptions } from '../utils/options';
import { cleanDts } from '../utils/bundle-dts';
import { internalAppData } from './internal-app-data';
import { internalClient } from './internal-platform-client';
import { internalHydrate } from './internal-platform-hydrate';
import { internalTesting } from './internal-platform-testing';
import { join } from 'path';
import { writePkgJson } from '../utils/write-pkg-json';

export async function internal(opts: BuildOptions) {
  const inputInternalDir = join(opts.buildDir, 'internal');

  await fs.emptyDir(opts.output.internalDir);

  await copyRindoInternalDts(opts, opts.output.internalDir);

  await copyRindoCoreEntry(opts);

  // copy @rindo/core/internal default entry, which defaults to client
  // but we're not exposing all of Rindo's internal code (only the types)
  await fs.copyFile(join(inputInternalDir, 'default.js'), join(opts.output.internalDir, 'index.js'));

  // write @rindo/core/internal/package.json
  writePkgJson(opts, opts.output.internalDir, {
    name: '@rindo/core/internal',
    description: 'Rindo internals only to be imported by the Rindo Compiler. Breaking changes can and will happen at any time.',
    main: 'index.js',
    types: 'index.d.ts',
    sideEffects: false,
  });

  const clientPlatformBundle = await internalClient(opts);
  const hydratePlatformBundles = await internalHydrate(opts);
  const testingPlatform = await internalTesting(opts);

  return [...clientPlatformBundle, ...hydratePlatformBundles, ...testingPlatform, await internalAppData(opts)];
}

async function copyRindoInternalDts(opts: BuildOptions, outputInternalDir: string) {
  const declarationsInputDir = join(opts.buildDir, 'declarations');

  // copy to @rindo/core/internal

  // @rindo/core/internal/index.d.ts
  const indexDtsSrcPath = join(declarationsInputDir, 'index.d.ts');
  const indexDtsDestPath = join(outputInternalDir, 'index.d.ts');
  let indexDts = cleanDts(await fs.readFile(indexDtsSrcPath, 'utf8'));
  indexDts = prependExtModules(indexDts);
  await fs.writeFile(indexDtsDestPath, indexDts);

  // @rindo/core/internal/rindo-private.d.ts
  const privateDtsSrcPath = join(declarationsInputDir, 'rindo-private.d.ts');
  const privateDtsDestPath = join(outputInternalDir, 'rindo-private.d.ts');
  const privateDts = cleanDts(await fs.readFile(privateDtsSrcPath, 'utf8'));
  await fs.writeFile(privateDtsDestPath, privateDts);

  // @rindo/core/internal/rindo-public.compiler.d.ts
  const compilerDtsSrcPath = join(declarationsInputDir, 'rindo-public-compiler.d.ts');
  const compilerDtsDestPath = join(outputInternalDir, 'rindo-public-compiler.d.ts');
  const compilerDts = cleanDts(await fs.readFile(compilerDtsSrcPath, 'utf8'));
  await fs.writeFile(compilerDtsDestPath, compilerDts);

  // @rindo/core/internal/rindo-public-docs.d.ts
  const docsDtsSrcPath = join(declarationsInputDir, 'rindo-public-docs.d.ts');
  const docsDtsDestPath = join(outputInternalDir, 'rindo-public-docs.d.ts');
  const docsDts = cleanDts(await fs.readFile(docsDtsSrcPath, 'utf8'));
  await fs.writeFile(docsDtsDestPath, docsDts);

  // @rindo/core/internal/rindo-public-runtime.d.ts
  const runtimeDtsSrcPath = join(declarationsInputDir, 'rindo-public-runtime.d.ts');
  const runtimeDtsDestPath = join(outputInternalDir, 'rindo-public-runtime.d.ts');
  const runtimeDts = cleanDts(await fs.readFile(runtimeDtsSrcPath, 'utf8'));
  await fs.writeFile(runtimeDtsDestPath, runtimeDts);

  // @rindo/core/internal/rindo-ext-modules.d.ts (.svg/.css)
  const srcExtModuleOutput = join(opts.srcDir, 'declarations', 'rindo-ext-modules.d.ts');
  const dstExtModuleOutput = join(outputInternalDir, 'rindo-ext-modules.d.ts');
  await fs.copyFile(srcExtModuleOutput, dstExtModuleOutput);
}

function prependExtModules(content: string) {
  return `/// <reference path="./rindo-ext-modules.d.ts" />\n` + content;
}

async function copyRindoCoreEntry(opts: BuildOptions) {
  // write @rindo/core entry
  const rindoCoreSrcDir = join(opts.srcDir, 'internal', 'rindo-core');
  const rindoCoreDstDir = join(opts.output.internalDir, 'rindo-core');
  await fs.ensureDir(rindoCoreDstDir);
  await fs.copy(rindoCoreSrcDir, rindoCoreDstDir);
}
