import type * as d from '@rindo/core/declarations';
import { mockConfig, mockLoadConfigInit } from '@rindo/core/testing';

import { validateConfig } from '../validate-config';

describe('validateDocs', () => {
  let userConfig: d.Config;

  beforeEach(() => {
    userConfig = mockConfig();
  });

  it('readme docs dir', () => {
    // the flags field is expected to have been set by the mock creation function for unvalidated configs, hence the
    // bang operator
    userConfig.flags!.docs = true;
    userConfig.outputTargets = [
      {
        type: 'docs-readme',
        dir: 'my-dir',
      } as d.OutputTargetDocsReadme,
    ];
    const { config } = validateConfig(userConfig, mockLoadConfigInit());
    const o = config.outputTargets.find((o) => o.type === 'docs-readme') as d.OutputTargetDocsReadme;
    expect(o.dir).toContain('my-dir');
  });

  it('default no docs, not remove docs output target', () => {
    userConfig.outputTargets = [{ type: 'docs-readme' }];
    const { config } = validateConfig(userConfig, mockLoadConfigInit());
    expect(config.outputTargets.some((o) => o.type === 'docs-readme')).toBe(true);
  });

  it('default no docs, no output target', () => {
    const { config } = validateConfig(userConfig, mockLoadConfigInit());
    expect(config.outputTargets.some((o) => o.type === 'docs-readme')).toBe(false);
  });
});
