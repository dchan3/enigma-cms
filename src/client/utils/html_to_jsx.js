import { createElement } from 'preact';
import styleObject from './style_object';

function domTree(html) {
  let parser = new DOMParser(), doc = parser.parseFromString(html, 'text/html');
  return doc.body.children;
}

function domTreeToJsx(tree, rpl) {
  let jsxTree = [];
  for (let l = 0; l < tree.length; l++) {
    let curr = tree[l];
    if (curr.getAttributeNames) {
      let attributes =
        curr.getAttributeNames(), attrMap = { key: undefined, ref: undefined };
      if (attributes.length) {
        for (let a = 0; a < attributes.length; a++) {
          let name = attributes[a], value = curr.getAttribute(name);
          if (name === 'style') {
            attrMap[name] = styleObject(value);
          }
          else attrMap[name] = value;
        }
      }
      let theNodeName = rpl && rpl[curr.tagName.toLowerCase()] ||
        curr.tagName.toLowerCase();
      if (curr.childNodes && curr.childNodes.length) attrMap.children = domTreeToJsx(curr.childNodes, rpl);

      jsxTree.push(createElement(theNodeName, attrMap));
    }
    else jsxTree.push(curr.textContent);
  }
  return jsxTree.length === 1 ? jsxTree[0] : jsxTree;
}

export default function htmlToJsx(html, replacementMap) {
  let theTree = domTree(html);
  return domTreeToJsx(theTree, replacementMap);
}
