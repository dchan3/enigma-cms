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
      if (stack[n].token === 'tagname') {
        retval.name = stack[n].name;
      }
      if (stack[n].token === 'tagattr') {
        tempAttr.name = ['class', 'for'].includes(stack[n].name)
          ? { 'class': 'className', 'for': 'htmlFor' }[stack[n].name]
          : stack[n].name;
      }
      if (stack[n].token === 'tagval') {
        tempAttr.value = tempAttr.name === 'style' ?
          styleObject(stack[n].name.substring(1, stack[n].name.length - 1))
          : stack[n].name;
        if (!retval.attributes) {
          retval.attributes = [];
        }
        retval.attributes.push(tempAttr);
        tempAttr = {};
      }
      if (stack[n].token === 'text') {
        if (!retval.children) {
          retval.children = [];
        }
        retval.children.push({ node: 'text', name: stack[n].name });
      }
    }
  }
  return retval;
}

export function createHtmlTree(html) {
  var tree = [], tokenStack = [], tempStr = '',
    onTagEnd = function() {
      if (tokenStack.length &&
        tokenStack.filter(t => t.token === 'tagstart').length) {
        let fil = tokenStack.map((t, i) => ({ index: i, token: t.token })),
          idx = fil.filter(t => t.token === 'tagstart').splice(-1)[0].index,
          isSingle = tokenStack.filter(t => t.token === 'tagsingle').length > 0;
        if (tree.length && tree[tree.length - 1].isChild) {
          let nd = collapseNode(tokenStack.slice(idx));
          if (!isSingle) {
            nd.children = [];
            for (let t = 0; t < tree.length; t++) {
              if (tree[t].isChild
                && tree[t].depth === tree[tree.length - 1].depth) {
                let ps = { node: tree[t].node };
                if (tree[t].name) ps.name = tree[t].name;
                if (tree[t].attributes) ps.attributes = tree[t].attributes;
                if (tree[t].children) ps.children = tree[t].children;
                nd.children.push(ps);
                tree[t] = null;
              }
            }
            tree = tree.filter(leaf => leaf !== null);
            tree.push(nd);
          }
          else {
            tree.push(collapseNode(tokenStack.slice(idx)));
          }
        }
        else {
          tree.push(collapseNode(tokenStack.slice(idx)));
        }
        if (idx > 0) {
          tree[tree.length - 1].isChild = true;
          tree[tree.length - 1].depth = tokenStack.filter(
            t => t.token === 'tagstart').length - 1;
        }
        tokenStack = idx === 0 ? [] : tokenStack.slice(0, idx);
      }
    };
  for (let c = 0; c < html.length; c++) {
    tempStr += html[c];
    if (tempStr === '<') {
      if (tokenStack[tokenStack.length - 1] &&
        tokenStack[tokenStack.length - 1].token === 'tagopenend') {
        if (html[c + 1] === '/') {
          tokenStack.push({ token: 'tagclosestart' });
          tokenStack.push({ token: 'tagclosebegin' });
          c++;
        }
        else tokenStack.push({ token: 'tagstart', d:
          tokenStack.filter(t => t.token === 'tagstart').length });
      }
      else tokenStack.push({ token: 'tagstart', d:
        tokenStack.filter(t => t.token === 'tagstart').length });
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
        if (tokenStack[tokenStack.length - 1].token === 'tagattr'
          && tempStr.trim().length > 1 && tempStr.startsWith('"')) {
          tokenStack.push({ token: 'tagval', name: tempStr.trim() });
          tempStr = '';
        }
      }
    }
    else if (tempStr.endsWith(' ')) {
      if (tokenStack.length) {
        if (tokenStack[tokenStack.length - 1].token === 'tagopenend') {
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
        else if (tokenStack[tokenStack.length - 1].token === 'tagstart') {
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
        if (tokenStack[tokenStack.length - 1].token === 'tagclosestart') {
          tokenStack.push({ token: 'tagclosebegin' });
          tempStr = '';
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagattr') {
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
        else if (tokenStack[tokenStack.length - 1].token === 'tagval') {
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
        if (tokenStack[tokenStack.length - 1].token === 'tagclosebegin') {
          tokenStack.push({ token: 'tagend' });
          tempStr = '';
          onTagEnd();
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagattr' &&
          tempStr.substring(0, tempStr.length - 1).trim().length) {
          tokenStack.push({ token: 'tagattr', name:
            tempStr.substring(0, tempStr.length - 1).trim() });
          tokenStack.push({ token: 'tagval', name: true });
          tempStr = '';
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagval') {
          tokenStack.push({ token: 'tagopenend' });
          tempStr = '';
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagstart') {
          tokenStack.push({ token: 'tagname',
            name: tempStr.substring(0, tempStr.length - 1).trim() });
          tokenStack.push({ token: 'tagopenend' });
          tempStr = '';
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagsingle') {
          tokenStack.push({ token: 'tagend' });
          tempStr = '';
          onTagEnd();
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagclosebegin') {
          tokenStack.push({ token: 'tagend' });
          tempStr = '';
          onTagEnd();
        }
      }
    }
    else if (tempStr.endsWith('=')) {
      if (tokenStack.length) {
        if (tokenStack[tokenStack.length - 1].token === 'tagname' ||
          tokenStack[tokenStack.length - 1].token === 'tagval' &&
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
          if (tokenStack[tokenStack.length - 1].token === 'tagstart') {
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
    let { attributes } = tree[l], attrs = attributes ? {} : null;
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
    jsxTree.push(tree[l].node === 'tag' ?
      tree[l].name === 'br' ? createElement('br') : (tree[l].children ?
        createElement(rpl && rpl[tree[l].name] || tree[l].name, attrs,
          treeToJsx(tree[l].children, rpl)) :
        createElement(rpl && rpl[tree[l].name] || tree[l].name, attrs)
      ) : tree[l].name);
  }
  return jsxTree.length === 1 ? jsxTree[0] : jsxTree;
}

export default function htmlToJsx(html, replacementMap) {
  let theTree = createHtmlTree(html);
  return treeToJsx(theTree, replacementMap);
}
