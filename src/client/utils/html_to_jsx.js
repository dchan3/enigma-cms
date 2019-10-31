import { createElement } from 'react';

function camel(str) {
  return str.split('-').map((word, i) => i > 0 ?
    (word[0].toUpperCase() + word.substring(1)) : word).join('');
}

function styleObject(css) {
  let retval = {}, statements = css.split(';').map(stmt => stmt.trim());
  for (let s = 0; s < statements.length; s++) {
    let [attr, val] = statements[s].split(':').map(stmt => stmt.trim());
    if (attr.length) retval[camel(attr)] = val;
  }
  return retval;
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
        tempAttr.name = stack[n].name === 'class' ? 'className' : stack[n].name;
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
  var tree = [], tokenStack = [], tempStr = '';
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
        else tokenStack.push({ token: 'tagstart' });
      }
      else tokenStack.push({ token: 'tagstart' });
      tempStr = '';
    }

    if (tempStr.endsWith('<')) {
      let p = { node: 'text',
        name: tempStr.substring(0, tempStr.length - 1).trim() };
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
        tree.push({ node: 'text', name: tokenStack.pop().name });
        tokenStack.push({ token: 'tagstart' });
      }
      else tokenStack.push({ token: 'tagstart' });
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
        if (tokenStack[tokenStack.length - 1].token === 'tagstart') {
          tokenStack.push({ token: 'tagname', name: tempStr.trim() });
          tempStr = '';
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagname') {
          tokenStack.push({ token: 'tagattr', name: tempStr.trim() });
          tempStr = '';
        }
      }
      else if (html[c + 1] && html[c + 1] === '<'){
        tree.push({ node: 'text', name: tempStr.trim() });
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
            tempStr = '';
          }
        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagval') {
          tokenStack.push({ token: 'tagsingle' });
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
        if (tokenStack[tokenStack.length - 1].token === 'tagattr' &&
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
          let idx = tokenStack.map((t, i) => ({ index: i, token: t.token }))
            .filter(t => t.token === 'tagstart').splice(-1)[0].index;
          if (tree.length && tree[tree.length - 1].isChild) {
            let nd = collapseNode(tokenStack.slice(idx));
            nd.children = tree.filter(leaf => {
              return leaf.isChild && leaf.depth === tree[tree.length - 1].depth;
            }).map(
              ({ node, name, attributes, children }) => {
                let retval = { node };
                if (name) retval.name = name;
                if (attributes) retval.attributes = attributes;
                if (children) retval.children = children;
                return retval;
              });
            tree = tree.filter(leaf => {
              if (leaf.isChild) {
                return tree.length === 1 ?
                  leaf.depth !== tree[0].depth :
                  leaf.depth < tree[tree.length - 1].depth;
              }
              else return true;
            });
            tree.push(nd);
          }
          else tree.push(collapseNode(tokenStack.slice(idx)));
          if (idx > 0) {
            tree[tree.length - 1].isChild = true;
            tree[tree.length - 1].depth = tokenStack.filter(
              t => t.token === 'tagstart').length - 1;
          }
          tokenStack = idx === 0 ? [] : tokenStack.slice(0, idx);

        }
        else if (tokenStack[tokenStack.length - 1].token === 'tagclosebegin') {
          tokenStack.push({ token: 'tagend' });
          tempStr = '';
          let idx = tokenStack.map((t, i) => ({ index: i, token: t.token }))
            .filter(t => t.token === 'tagstart').splice(-1)[0].index;
          if (tree.length && tree[tree.length - 1].isChild) {
            let nd = collapseNode(tokenStack.slice(idx));
            nd.children = tree.filter(leaf => {
              return leaf.isChild && leaf.depth === tree[tree.length - 1].depth;
            }).map(
              ({ node, name, attributes, children }) => {
                let retval = { node };
                if (name) retval.name = name;
                if (attributes) retval.attributes = attributes;
                if (children) retval.children = children;
                return retval;
              });
            tree = tree.filter(leaf => {
              if (leaf.isChild) {
                return tree.length === 1 ?
                  leaf.depth !== tree[0].depth :
                  leaf.depth < tree[tree.length - 1].depth;
              }
              else return true;
            });
            tree.push(nd);
          }
          else tree.push(collapseNode(tokenStack.slice(idx)));
          if (idx > 0) {
            tree[tree.length - 1].isChild = true;
            tree[tree.length - 1].depth = tokenStack.filter(
              t => t.token === 'tagstart').length - 1;
          }
          tokenStack = idx === 0 ? [] : tokenStack.slice(0, idx);
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
  }
  return tree;
}

function treeToJsx(tree, rpl) {
  let jsxTree = [];
  for (let l = 0; l < tree.length; l++) {
    let attrs = tree[l].attributes ? {} : null;
    if (attrs) {
      for (let a = 0; a < tree[l].attributes.length; a++) {
        if (tree[l].attributes[a] && tree[l].attributes[a].name &&
          tree[l].attributes[a].value)
          attrs[tree[l].attributes[a].name]
            = typeof tree[l].attributes[a].value === 'string' ?
              tree[l].attributes[a].value.substring(1,
                tree[l].attributes[a].value.length - 1) :
              typeof tree[l].attributes[a].value === 'object' ?
                tree[l].attributes[a].value : true;
      }
    }
    jsxTree.push(tree[l].node === 'tag' ?
      (tree[l].children ?
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
