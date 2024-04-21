import { Component, h } from '@rindo/core';
import output from './output';

@Component({
  tag: 'lifecycle-nested-a',
  shadow: true,
})
export class Cmpa {
  async componentWillLoad() {
    output('componentWillLoad-a');
  }

  async componentDidLoad() {
    output('componentDidLoad-a');
  }

  render() {
    return <slot />;
  }
}
