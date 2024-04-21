import { Component, Host, h } from '@rindo/core';

@Component({
  tag: 'custom-elements-no-delegates-focus',
  styleUrl: 'shared-delegates-focus.css',
  shadow: true,
})
export class CustomElementsNoDelegatesFocus {
  render() {
    return (
      <Host>
        <input />
      </Host>
    );
  }
}
