import { Component, h } from '@rindo/core';

@Component({
  tag: 'cmp-a',
  shadow: true,
})
export class ComponentA {
  render() {
    return (
      <div>
        <section>
          <span>I am in component A</span>
        </section>
        <cmp-b></cmp-b>
      </div>
    );
  }
}
