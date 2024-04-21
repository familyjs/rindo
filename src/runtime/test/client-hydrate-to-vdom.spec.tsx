import { Component, h, Host } from '@rindo/core';
import { newSpecPage } from '@rindo/core/testing';

import type * as d from '../../declarations';
import { initializeClientHydrate } from '../client-hydrate';

describe('initializeClientHydrate', () => {
  it('functional', async () => {
    const Logo = () => (
      <svg>
        <title>Family Docs</title>
      </svg>
    );

    @Component({ tag: 'cmp-a' })
    class CmpA {
      render() {
        return (
          <header>
            <Logo />
          </header>
        );
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true,
    });

    const hostElm = document.createElement('cmp-a');
    hostElm.innerHTML = serverHydrated.root.innerHTML;

    const hostRef: d.HostRef = {
      $flags$: 0,
    };

    initializeClientHydrate(hostElm, 'cmp-a', '1', hostRef);

    const cmpAvnode = hostRef.$vnode$;
    expect(cmpAvnode.$tag$).toBe('cmp-a');

    expect(cmpAvnode.$children$).toHaveLength(1);
    expect(cmpAvnode.$children$[0].$tag$).toBe('header');

    expect(cmpAvnode.$children$[0].$children$).toHaveLength(1);
    expect(cmpAvnode.$children$[0].$children$[0].$tag$).toBe('svg');

    expect(cmpAvnode.$children$[0].$children$[0].$children$).toHaveLength(1);
    expect(cmpAvnode.$children$[0].$children$[0].$children$[0].$tag$).toBe('title');

    expect(cmpAvnode.$children$[0].$children$[0].$children$[0].$children$).toHaveLength(1);
    expect(cmpAvnode.$children$[0].$children$[0].$children$[0].$children$[0].$text$).toBe('Family Docs');
  });

  it('text child', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      render() {
        return <Host>88mph</Host>;
      }
    }

    const serverHydrated = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      hydrateServerSide: true,
    });

    const hostElm = document.createElement('cmp-a');
    hostElm.innerHTML = serverHydrated.root.innerHTML;

    const hostRef: d.HostRef = {
      $flags$: 0,
    };

    initializeClientHydrate(hostElm, 'cmp-a', '1', hostRef);

    const cmpAvnode = hostRef.$vnode$;
    expect(cmpAvnode.$tag$).toBe('cmp-a');

    expect(cmpAvnode.$children$).toHaveLength(1);
    expect(cmpAvnode.$children$[0].$text$.trim()).toBe('88mph');
  });
});
