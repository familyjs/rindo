import { Component, h } from '@rindo/core';

@Component({
  tag: 'cmp-scoped-a',
  styleUrl: 'cmp-scoped-a.css',
  scoped: true,
})
export class CmpScopedA {
  render() {
    return (
      <div>
        <p>cmp-scoped-a</p>
        <p class="scoped-class">scoped-class</p>
      </div>
    );
  }
}
