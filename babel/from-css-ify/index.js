let t = require('@babel/types'), fs = require('fs');

module.exports = function () {
  let styles = {}, fn = '', funcMaker = function(element, classNameValue) {
    return t.functionExpression(null,
      [t.identifier('props')],
      t.blockStatement([t.returnStatement(t.callExpression(
        t.identifier('createElement'),
        [t.stringLiteral(element),
          t.objectExpression([
            t.spreadElement(t.identifier('props')),
            t.objectProperty(
              t.stringLiteral('className'), classNameValue)
          ]), t.identifier('props.children')]))]));
  }

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
            path.replaceWith(funcMaker(element, t.stringLiteral(compName)));
          }
          else if (path.node.arguments[1].type === 'ArrowFunctionExpression') {
            let paramList = {}, pushToListIfTemplate = function(thaNode) {
              let attr = thaNode.quasis[0].value.raw,
                {
                  test: { name: param },
                  consequent: { value: ifTrue },
                  alternate: { value: ifFalse }
                } = thaNode.expressions[0];
              styles[`${element}.${compName}.${param}True`] =
                `${attr}${ifTrue};`;
              styles[`${element}.${compName}.${param}False`] =
                `${attr}${ifFalse};`;

              if (!paramList[compName]) paramList[compName] = [];
              paramList[compName].push({ attr, param });
            };
            paramList[compName] = [];

            if (path.node.arguments[1].body.type === 'BinaryExpression') {
              if (path.node.arguments[1].body.left.type === 'BinaryExpression') {
                if (path.node.arguments[1].body.left.left.type === 'StringLiteral') {
                  styles[`${element}.${compName}`] =
                    path.node.arguments[1].body.left.left.value;

                  if (path.node.arguments[1].body.left.right.type === 'TemplateLiteral') {
                    pushToListIfTemplate(path.node.arguments[1].body.left.right);
                  }
                }
              }
              else if (path.node.arguments[1].body.left.type === 'StringLiteral') {
                styles[`${element}.${compName}`] = path.node.arguments[1].body.left.value;
              }

              if (path.node.arguments[1].body.right.type === 'TemplateLiteral') {
                pushToListIfTemplate(path.node.arguments[1].body.right);
              }

              let daTemplate = paramList[compName].map(function({ param }) {
                  return t.conditionalExpression(
                    t.identifier(`props.${param}`),
                    t.stringLiteral(` ${param}True`),
                    t.stringLiteral(` ${param}False`)
                  );
                }), quazis = paramList[compName].map(function() {
                  return t.templateElement(
                    {
                      raw: '',
                      cooked: ''
                    }, true
                  )
                });

              path.replaceWith(funcMaker(element,
                t.templateLiteral([
                  t.templateElement(
                    {
                      raw: compName,
                      cooked: compName
                    }, false
                  ), ...quazis],
                daTemplate)));
            }
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
        if (typeof fn === 'string') fs.writeFileSync(fn, fileStr);
        else fn.forEach(function(f) {
          fs.writeFileSync(f, fileStr);
        });
      }
    }
  };
}
