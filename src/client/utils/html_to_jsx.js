import { h } from 'preact';
import styleObject from './style_object';

let attrNameMap = new Proxy({
  'class': 'className',
  'for': 'htmlFor'
}, {
  get(target, property) {
    if (property in target) return target[property];
    else return property;
  }
});

function domTree(html) {
  let parser = new DOMParser(), doc = parser.parseFromString(html, 'text/html');
  return doc.body.children;
}

function domTreeToJsx(tree, rpl) {
  let jsxTree = [];
  for (let curr of tree) {
    if (curr.getAttributeNames) {
      let attributes =
        curr.getAttributeNames(), attrMap = { key: undefined, ref: undefined };
      if (attributes.length) {
        for (let name of attributes) {
          let value = curr.getAttribute(name);
          if (name === 'style') {
            attrMap[name] = styleObject(value);
          }
          else {
            attrMap[attrNameMap[name]] = value;
          }
        }
      }
      let theNodeName = rpl && rpl[curr.tagName.toLowerCase()] ||
        curr.tagName.toLowerCase();
      if (curr.childNodes && curr.childNodes.length) attrMap.children = domTreeToJsx(curr.childNodes, rpl);

      jsxTree.push(h(theNodeName, attrMap));
    }
    else jsxTree.push(curr.textContent);
  }
  return jsxTree.length === 1 ? jsxTree[0] : jsxTree;
}

export default function htmlToJsx(html, replacementMap) {
  let theTree = domTree(html);
  return domTreeToJsx(theTree, replacementMap);
}
