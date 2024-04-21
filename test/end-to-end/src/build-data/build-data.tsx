import { Component, h, Build, Host } from '@rindo/core';

@Component({
  tag: 'build-data',
})
export class BuildData {
  render() {
    return (
      <Host>
        <p>isDev: {`${Build.isDev}`}</p>
        <p>isBrowser: {`${Build.isBrowser}`}</p>
        <p>isTesting: {`${Build.isTesting}`}</p>
      </Host>
    );
  }
}
