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
            if (tree[t].isChild
              && tree[t].depth === tree[tree.length - 1].depth) {
              let ps = { node: tree[t].node };
              for (var kiz in tree[t]) {
                if (['name', 'attributes', 'children'].includes(kiz)) {
                  ps[kiz] = tree[t][kiz];
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
    };
  for (let c = 0; c < html.length; c++) {
    let peekToken = tokenStack[tokenStack.length - 1] &&
      tokenStack[tokenStack.length - 1].token || null;
    tempStr += html[c];
    if (tempStr === '<') {
      if (peekToken === 'tagopenend' && html[c + 1] === '/') {
        tokenStack.push({ token: 'tagclosestart' });
        tokenStack.push({ token: 'tagclosebegin' });
        c++;
      }
      else tokenStack.push({ token: 'tagstart', d:
        tokenStack.filter(({ token }) => token === 'tagstart').length });
      tempStr = '';
    }

    if (tempStr.endsWith('<')) {
      let p = { node: 'text',
        name: escapeText(tempStr.substring(0, tempStr.length - 1)) };
      if (!!tokenStack.length && tokenStack[0].token === 'tagstart') {
        p.isChild = true;
        p.depth = tokenStack.filter(t => t.token === 'tagstart').length;
      }
      tree.push(p);
      if (html[c + 1] && html[c + 1] === '/') {
        c++;
        tokenStack.push({ token: 'tagclosestart' });
        tokenStack.push({ token: 'tagclosebegin' });
      }
      else if (tokenStack.length === 1) {
        tree.push({ node: 'text', name: escapeText(tokenStack.pop().name) });
        tokenStack.push({ token: 'tagstart', d:
          tokenStack.filter(t => t.token === 'tagstart').length });
      }
      else tokenStack.push({ token: 'tagstart', d:
        tokenStack.filter(t => t.token === 'tagstart').length });
      tempStr = '';
    }
    else if (tempStr.endsWith('"')) {
      if (tokenStack.length) {
        if (peekToken === 'tagattr'
          && tempStr.trim().length > 1 && tempStr.startsWith('"')) {
          tokenStack.push({ token: 'tagval', name: tempStr.trim() });
          tempStr = '';
        }
      }
    }
    else if (tempStr.endsWith(' ')) {
      if (tokenStack.length) {
        if (peekToken === 'tagopenend') {
          if (html[c + 1] && html[c + 1] === '<') {
            let p = { node: 'text', name: escapeText(tempStr) };
            if (!!tokenStack.length && tokenStack[0].token === 'tagstart') {
              p.isChild = true;
              p.depth = tokenStack.filter(t => t.token === 'tagstart').length;
            }
            tree.push(p);
            tempStr = '';
          }
        }
        else if (peekToken === 'tagstart') {
          tokenStack.push({ token: 'tagname', name: tempStr.trim() });
          if (html[c + 1] === '/' && html[c + 2] === '>') {
            c += 2;
            tokenStack.push({ token: 'tagsingle' });
            tokenStack.push({ token: 'tagend' });
            onTagEnd();
          }
          tempStr = '';
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagname') {
          tokenStack.push({ token: 'tagattr', name: tempStr.trim() });
          tempStr = '';
        }
        else if (html[c + 1] && html[c + 1] === '<'){
          let p = { node: 'text', name: escapeText(tempStr) };
          if (!!tokenStack.length && tokenStack[0].token === 'tagstart') {
            p.isChild = true;
            p.depth = tokenStack.filter(t => t.token === 'tagstart').length;
          }
          tree.push(p);
          tempStr = '';
        }
      }
      else if (html[c + 1] && html[c + 1] === '<'){
        let p = { node: 'text', name: escapeText(tempStr) };
        if (!!tokenStack.length && tokenStack[0].token === 'tagstart') {
          p.isChild = true;
          p.depth = tokenStack.filter(t => t.token === 'tagstart').length;
        }
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
        else if (peekToken === 'tagattr') {
          if (html[c + 1] && ['>', ' '].includes(html[c + 1])) {
            tokenStack.push({ token: 'tagval',
              name: tempStr === '/' ? true : tempStr });
            tokenStack.push({ token: 'tagsingle' });
            tokenStack.push({ token: 'tagend' });
            onTagEnd();
            c++;
            tempStr = '';
          }
        }
        else if (peekToken === 'tagval') {
          tokenStack.push({ token: 'tagsingle' });
          tokenStack.push({ token: 'tagend' });
          onTagEnd();
          c++;
          tempStr = '';
        }
      }
      else {
        tokenStack.push({ token: 'tagclosestart' });
        tokenStack.push({ token: 'tagclosebegin' });
        tempStr = '';
      }
    }
    else if (tempStr.endsWith('>')) {
      if (tokenStack.length) {
        if (peekToken === 'tagattr' &&
          tempStr.substring(0, tempStr.length - 1).trim().length) {
          tokenStack.push({ token: 'tagattr', name:
            tempStr.substring(0, tempStr.length - 1).trim() });
          tokenStack.push({ token: 'tagval', name: true });
          tempStr = '';
        }
        else if (['tagstart', 'tagval'].includes(peekToken)) {
          if (peekToken === 'tagstart') {
            tokenStack.push({ token: 'tagname',
              name: tempStr.substring(0, tempStr.length - 1).trim() });
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
        if (['tagname', 'tagval'].includes(peekToken) &&
          tempStr.substring(0, tempStr.length - 1).trim().length) {
          tokenStack.push({ token: 'tagattr',
            name: tempStr.substring(0, tempStr.length - 1).trim() });
          tempStr = '';
        }
      }
    }
    else if (tempStr.endsWith('\n')) {
      if (tempStr === '\n') tempStr = '';
      else if (tempStr.length > 1) {
        if (tokenStack.length) {
          if (peekToken === 'tagstart') {
            tokenStack.push({ token: 'tagname', name: tempStr.trim() });
            if (html[c + 1] === '/' && html[c + 2] === '>') {
              c += 2;
              tokenStack.push({ token: 'tagsingle' });
              tokenStack.push({ token: 'tagend' });
              onTagEnd();
            }
            tempStr = '';
          }
          else if (peekToken === 'tagname') {
            tokenStack.push({ token: 'tagattr', name: tempStr.trim() });
            tempStr = '';
          }
          else if (html[c + 1] && html[c + 1] === '<'){
            let p = { node: 'text',
              name: escapeText(tempStr.replace(/\n$/, ' ')) };
            if (!!tokenStack.length && tokenStack[0].token === 'tagstart') {
              p.isChild = true;
              p.depth = tokenStack.filter(t => t.token === 'tagstart').length;
            }
            tree.push(p);
            tempStr = '';
          }
        }
        else if (html[c + 1] && html[c + 1] === '<'){
          let p = { node: 'text',
            name: escapeText(tempStr.replace(/\n$/, ' ')) };
          if (!!tokenStack.length && tokenStack[0].token === 'tagstart') {
            p.isChild = true;
            p.depth = tokenStack.filter(t => t.token === 'tagstart').length;
          }
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
    jsxTree.push(nodeNode === 'tag' ?
      nodeName === 'br' ? createElement('br') : (kids ?
        createElement(rpl && rpl[nodeName] || nodeName, attrs,
          treeToJsx(kids, rpl)) :
        createElement(rpl && rpl[nodeName] || nodeName, attrs)
      ) : nodeName);
  }
  return jsxTree.length === 1 ? jsxTree[0] : jsxTree;
}

export default function htmlToJsx(html, replacementMap) {
  let theTree = createHtmlTree(html);
  return treeToJsx(theTree, replacementMap);
}
