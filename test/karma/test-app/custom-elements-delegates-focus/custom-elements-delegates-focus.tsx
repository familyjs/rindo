import { Component, Host, h } from '@rindo/core';

@Component({
  tag: 'custom-elements-delegates-focus',
  styleUrl: 'shared-delegates-focus.css',
  shadow: {
    delegatesFocus: true,
  },
})
export class CustomElementsDelegatesFocus {
  render() {
    return (
      <Host>
        <input />
      </Host>
    );
  }
}