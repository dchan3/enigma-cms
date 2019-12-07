let t = require('@babel/types'), fs = require('fs');

const loset = function(obj, keyString, val) {
  var keys = keyString.split('.');
  if (keys.length <= 1) {
    obj[keyString] = val;
  }
  else {
    loset(obj[keys[0]], keyString.substring(keyString.indexOf('.') + 1), val);
  }
}

module.exports = function () {
  let styles = {}, fn = '', reactName = '';

  return {
    visitor: {
      CallExpression(path, state) {
        if (fn === '') {
          if (state.opts && state.opts.toFile) fn = state.opts.toFile;
        }
        if (path.node.callee.name === 'fromCss') {
          var element = path.node.arguments[0].value,
            css = path.node.arguments[1].type === 'StringLiteral' ?
              path.node.arguments[1].value : '',
            compName = path.parent.id && path.parent.id.name || '';
          if (compName.length && element.length && css.length) {
            styles[`${element}.${compName}`] = css;
            path.replaceWith(t.functionExpression(null, [t.identifier('props')],
              t.blockStatement([t.returnStatement(t.callExpression(
                t.identifier(`${reactName.length ? reactName :
                  'React'}.createElement`),
                [t.stringLiteral(element),
                  t.objectExpression([
                    t.spreadElement(t.identifier('props')),
                    t.objectProperty(t.stringLiteral('className'),
                      t.stringLiteral(compName))
                  ]), t.identifier('props.children')]))])));
          }
        }
      }
    },
    post() {
      if (fn.length) {
        let fileStr = '';
        for (let selector in styles) {
          fileStr += `${selector}{${styles[selector]}}`;
        }
        fs.writeFileSync(fn, fileStr);
      }
    }
  };
}
