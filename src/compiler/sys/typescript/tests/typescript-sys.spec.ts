import { mockValidatedConfig } from '@rindo/core/testing';

import { createSystem } from '../../../../compiler/sys/rindo-sys';
import type * as d from '../../../../declarations';
import { getTypescriptPathFromUrl } from '../typescript-sys';

describe('getTypescriptPathFromUrl', () => {
  const config: d.ValidatedConfig = mockValidatedConfig({
    rootDir: '/some/path/',
    sys: createSystem(),
  });

  it('not typescript, return url', () => {
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/@rindo/core@2.0.0/compiler/rindo.js';
    const url = 'https://cdn.jsdelivr.net/npm/something/index.js';
    const r = getTypescriptPathFromUrl(config, tsExecutingUrl, url);
    expect(r).toBe('https://cdn.jsdelivr.net/npm/something/index.js');
  });

  it('ts path from url, version', () => {
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/@rindo/core@2.0.0/compiler/rindo.js';
    const url = 'https://cdn.jsdelivr.net/npm/@rindo/core@2.0.0/compiler/lib.es2015.proxy.d.ts';
    const r = getTypescriptPathFromUrl(config, tsExecutingUrl, url);
    expect(r).toBe('/some/path/node_modules/@rindo/core/compiler/lib.es2015.proxy.d.ts');
  });

  it('ts path from url, no version', () => {
    const tsExecutingUrl = 'https://cdn.jsdelivr.net/npm/@rindo/core/compiler/rindo.js';
    const url = 'https://cdn.jsdelivr.net/npm/@rindo/core/compiler/lib.es2015.proxy.d.ts';
    const r = getTypescriptPathFromUrl(config, tsExecutingUrl, url);
    expect(r).toBe('/some/path/node_modules/@rindo/core/compiler/lib.es2015.proxy.d.ts');
  });
});
