import { createElement } from 'preact';
import styleObject from './style_object';

export default function fromCss(element, css, nonDomAttrs) {
  return (props) => {
    let { children, ...rest } = props, domAttrs  = {};
    for (let p in rest) {
      if (!nonDomAttrs) domAttrs[p] = rest[p];
      else if (!nonDomAttrs.includes(p)) domAttrs[p] = rest[p];
    }

    return createElement(element, {
      style: styleObject(typeof css === 'function' ? css(rest) : css),
      ...domAttrs
    }, children);
  };
}
