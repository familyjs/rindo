import { Component, h } from '@rindo/core';
import styles from './styles.css';

@Component({
  tag: 'hello-vdom',
  styles,
})
export class HelloWorld {
  render() {
    return <h1>Hello VDom!</h1>;
  }
}
