import { createElement } from 'react';
import styleObject from './style_object';

let esc =  {
  'amp': '&',
  'lt': '<',
  'gt': '>',
  'quot': '"',
  'nbsp': '\u00A0'
};

function escapeText(text) {
  return text.replace(/&([a-z]+);/g, function(match, p1) {
    return esc[p1];
  })
}

function collapseNode(stack) {
  let retval = null, tempAttr = {};
  if (stack[0].token === 'tagstart' &&
    stack[stack.length - 1].token === 'tagend') {
    retval = { node: 'tag' };
    for (let n = 1; n < stack.length - 1; n++) {
      let { name: nthName, token: nthToken } = stack[n];

      if (nthToken === 'tagname') {
        retval.name = nthName;
      }
      if (nthToken === 'tagattr') {
        tempAttr.name = ['class', 'for'].includes(nthName)
          ? { 'class': 'className', 'for': 'htmlFor' }[nthName]
          : nthName;
      }
      if (nthToken === 'tagval') {
        tempAttr.value = tempAttr.name === 'style' ?
          styleObject(nthName.substring(1, nthName.length - 1))
          : nthName;
        if (!retval.attributes) {
          retval.attributes = [];
        }
        retval.attributes.push(tempAttr);
        tempAttr = {};
      }
      if (nthToken === 'text') {
        if (!retval.children) {
          retval.children = [];
        }
        retval.children.push({ node: 'text', name: nthName });
      }
    }
  }
  return retval;
}

export function createHtmlTree(html) {
  var tree = [], tokenStack = [], tempStr = '',
    isTokenTag = (str) => (({ token }) => token === `tag${str}`),
    isTokenStart = isTokenTag('start'), onTagEnd = function() {
      if (tokenStack.length && tokenStack.filter(isTokenStart).length) {
        let fil = tokenStack.map(({ token }, i) => ({ index: i, token })),
          idx = fil.filter(isTokenStart).splice(-1)[0].index,
          isSingle = tokenStack.filter(isTokenTag('single')).length > 0,
          collapsed = collapseNode(tokenStack.slice(idx));
        if (tree.length && tree[tree.length - 1].isChild && !isSingle) {
          collapsed.children = [];
          for (let t = 0; t < tree.length; t++) {
            let noad = tree[t];
            if (noad.isChild && noad.depth === tree[tree.length - 1].depth) {
              let ps = { node: noad.node };
              for (var kiz in noad) {
                if (['name', 'attributes', 'children'].includes(kiz)) {
                  ps[kiz] = noad[kiz];
                }
              }
              collapsed.children.push(ps);
              tree[t] = null;
            }
          }
          tree = tree.filter(leaf => leaf !== null);
        }
        tree.push(collapsed);
        if (idx > 0) {
          tree[tree.length - 1].isChild = true;
          tree[tree.length - 1].depth = tokenStack.filter(
            isTokenTag('start')).length - 1;
        }
        tokenStack = idx === 0 ? [] : tokenStack.slice(0, idx);
      }
    }, markTagClose = function() {
      tokenStack.push({ token: 'tagclosestart' });
      tokenStack.push({ token: 'tagclosebegin' });
    }, markSingleTag = function() {
      tokenStack.push({ token: 'tagsingle' });
      tokenStack.push({ token: 'tagend' });
    }, getDepth = function() {
      return tokenStack.filter(isTokenStart).length;
    }, makeTextNode = function(name) {
      let p = { node: 'text', name };
      if (!!tokenStack.length && tokenStack[0].token === 'tagstart') {
        p.isChild = true;
        p.depth = getDepth();
      }
      return p;
    }
  for (let c = 0; c < html.length; c++) {
    let peekToken = tokenStack[tokenStack.length - 1] &&
      tokenStack[tokenStack.length - 1].token || null, tagStartOrName =
      function(peekToken, name) {
        if (peekToken === 'tagstart') {
          tokenStack.push({ token: 'tagname', name });
          if (html[c + 1] === '/' && html[c + 2] === '>') {
            c += 2;
            markSingleTag();
            onTagEnd();
          }
          tempStr = '';
        }
        else if (peekToken === 'tagname') {
          tokenStack.push({ token: 'tagattr', name });
          tempStr = '';
        }
      }
    tempStr += html[c];
    if (tempStr === '<') {
      if (peekToken === 'tagopenend' && html[c + 1] === '/') {
        markTagClose();
        c++;
      }
      else tokenStack.push({ token: 'tagstart', d: getDepth() });
      tempStr = '';
    }

    if (tempStr.endsWith('<')) {
      let p = makeTextNode(escapeText(tempStr.substring(0, tempStr.length - 1)));
      tree.push(p);
      if (html[c + 1] && html[c + 1] === '/') {
        markTagClose();
        c++;
      }
      else {
        if (tokenStack.length === 1) {
          tree.push({ node: 'text', name: escapeText(tokenStack.pop().name) });
        }
        tokenStack.push({ token: 'tagstart', d: getDepth() });
      }
      tempStr = '';
    }
    else if (tempStr.endsWith('"')) {
      if (tokenStack.length) {
        let thaName = tempStr.trim();
        if (peekToken === 'tagattr' && thaName.length > 1 && tempStr.startsWith('"')) {
          tokenStack.push({ token: 'tagval', name: thaName });
          tempStr = '';
        }
      }
    }
    else if (tempStr.endsWith(' ')) {
      if (tokenStack.length && ['tagstart', 'tagname'].includes(peekToken)) {
        let trimmed = tempStr.trim();
        tagStartOrName(peekToken, trimmed);
      }
      else if (html[c + 1] && html[c + 1] === '<'){
        let p = makeTextNode(escapeText(tempStr));
        tree.push(p);
        tempStr = '';
      }
    }
    else if (tempStr.endsWith('/')) {
      if (tokenStack.length) {
        if (peekToken === 'tagclosestart') {
          tokenStack.push({ token: 'tagclosebegin' });
          tempStr = '';
        }
        else if ((peekToken === 'tagattr' &&
          html[c + 1] && ['>', ' '].includes(html[c + 1])) ||
          peekToken === 'tagval') {
          if (peekToken === 'tagattr') tokenStack.push({ token: 'tagval',
            name: tempStr === '/' ? true : tempStr });
          markSingleTag();
          onTagEnd();
          c++;
          tempStr = '';
        }
      }
      else {
        markTagClose();
        tempStr = '';
      }
    }
    else if (tempStr.endsWith('>')) {
      if (tokenStack.length) {
        let trimmed = tempStr.substring(0, tempStr.length - 1).trim();
        if (peekToken === 'tagattr' && trimmed.length) {
          tokenStack.push({ token: 'tagattr', name: trimmed });
          tokenStack.push({ token: 'tagval', name: true });
          tempStr = '';
        }
        else if (['tagstart', 'tagval'].includes(peekToken)) {
          if (peekToken === 'tagstart') {
            tokenStack.push({ token: 'tagname', name: trimmed });
          }
          tokenStack.push({ token: 'tagopenend' });
          tempStr = '';
        }
        else if (['tagsingle', 'tagclosebegin' ].includes(peekToken)) {
          tokenStack.push({ token: 'tagend' });
          tempStr = '';
          onTagEnd();
        }
      }
    }
    else if (tempStr.endsWith('=')) {
      if (tokenStack.length) {
        let trimmed = tempStr.substring(0, tempStr.length - 1).trim();
        if (['tagname', 'tagval'].includes(peekToken) && trimmed.length) {
          tokenStack.push({ token: 'tagattr', name: trimmed });
          tempStr = '';
        }
      }
    }
    else if (tempStr.endsWith('\n')) {
      if (tempStr === '\n') tempStr = '';
      else if (tempStr.length > 1) {
        let trimmed = tempStr.trim();
        if (tokenStack.length && ['tagstart', 'tagname'].includes(peekToken)) {
          tagStartOrName(peekToken, trimmed);
        }
        else if (html[c + 1] && html[c + 1] === '<'){
          let p = makeTextNode(escapeText(tempStr.replace(/\n$/, ' ')));
          tree.push(p);
          tempStr = '';
        }
      }
    }
  }
  return tree;
}

function treeToJsx(tree, rpl) {
  let jsxTree = [];
  for (let l = 0; l < tree.length; l++) {
    let { attributes, name: nodeName, children: kids, node: nodeNode } =
      tree[l], attrs = attributes ? {} : null;
    if (attrs) {
      for (let a = 0; a < attributes.length; a++) {
        if (attributes[a] && attributes[a].name && attributes[a].value) {
          let { name, value } = attributes[a];
          attrs[name] = typeof value === 'string' ?
            value.substring(1, value.length - 1) :
            typeof value === 'object' ? value : true;
        }
      }
    }
    let theNodeName = rpl && rpl[nodeName] || nodeName,
      elementParams = [theNodeName, attrs];
    if (kids) elementParams.push(treeToJsx(kids, rpl));
    jsxTree.push(nodeNode === 'tag' ?
      createElement(...(nodeName === 'br' ? ['br'] : elementParams)) : nodeName);
  }
  return jsxTree.length === 1 ? jsxTree[0] : jsxTree;
}

export default function htmlToJsx(html, replacementMap) {
  let theTree = createHtmlTree(html);
  return treeToJsx(theTree, replacementMap);
}
