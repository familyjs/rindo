import fs from 'fs-extra';
import { join } from 'path';
import { BuildOptions } from '../utils/options';
import { writePkgJson } from '../utils/write-pkg-json';
import { RollupOptions } from 'rollup';

export async function internalAppData(opts: BuildOptions) {
  const inputAppDataDir = join(opts.buildDir, 'app-data');
  const outputInternalAppDataDir = join(opts.output.internalDir, 'app-data');

  await fs.emptyDir(outputInternalAppDataDir);

  // copy @rindo/core/internal/app-data/index.d.ts
  await fs.copyFile(join(inputAppDataDir, 'index.d.ts'), join(outputInternalAppDataDir, 'index.d.ts'));

  // write @rindo/core/internal/app-data/package.json
  writePkgJson(opts, outputInternalAppDataDir, {
    name: '@rindo/core/internal/app-data',
    description: 'Used for default app data and build conditionals within builds.',
    main: 'index.cjs.js',
    module: 'index.js',
    types: 'index.d.ts',
  });

  const internalAppDataBundle: RollupOptions = {
    input: {
      index: join(inputAppDataDir, 'index.js'),
    },
    output: [
      {
        format: 'esm',
        dir: outputInternalAppDataDir,
        entryFileNames: '[name].js',
      },
      {
        format: 'cjs',
        dir: outputInternalAppDataDir,
        entryFileNames: '[name].cjs.js',
        esModule: false,
      },
    ] as any,
  };

  return internalAppDataBundle;
}
