import { Component, h } from '@rindo/core';

@Component({
  tag: 'cmp-text-blue',
  styleUrl: 'cmp-text-blue.css',
  scoped: true,
})
export class CmpTextBlue {
  render() {
    return <text-blue>blue text, green border</text-blue>;
  }
}
