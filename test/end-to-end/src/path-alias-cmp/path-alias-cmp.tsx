import { Component, h } from '@rindo/core';
import { sayHi } from '@path-alias';

@Component({
  tag: 'path-alias-cmp',
})
export class PathAliasCmp {
  render() {
    return <h1>{sayHi()}</h1>;
  }
}
