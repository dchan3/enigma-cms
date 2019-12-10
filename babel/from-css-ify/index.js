let t = require('@babel/types'), fs = require('fs');

module.exports = function () {
  let styles = {}, fn = '';

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
                t.identifier('React.createElement'),
                [t.stringLiteral(element),
                  t.objectExpression([
                    t.spreadElement(t.identifier('props')),
                    t.objectProperty(t.stringLiteral('className'),
                      t.stringLiteral(compName))
                  ]), t.identifier('props.children')]))])));
          }
          else if (path.node.arguments[1].type === 'ArrowFunctionExpression') {
            let paramList = {};
            paramList[compName] = [];

            if (path.node.arguments[1].body.type === 'BinaryExpression') {
              if (path.node.arguments[1].body.left.type ===
                'BinaryExpression') {
                if (path.node.arguments[1].body.left.left.type ===
                  'StringLiteral') {
                  styles[`${element}.${compName}`] =
                    path.node.arguments[1].body.left.left.value;

                  if (path.node.arguments[1].body.left.right.type ===
                    'TemplateLiteral') {
                    let attr = path.node.arguments[1].body.left.right.quasis[0]
                        .value.raw,
                      {
                        test: { name: param },
                        consequent: { value: ifTrue },
                        alternate: { value: ifFalse }
                      } = path.node.arguments[1].body.left.right.expressions[0];
                    styles[`${element}.${compName}.${param}True`] =
                      `${attr}${ifTrue};`;
                    styles[`${element}.${compName}.${param}False`] =
                      `${attr}${ifFalse};`;

                    if (!paramList[compName]) paramList[compName] = [];
                    paramList[compName].push({ attr, param });
                  }
                }

                if (path.node.arguments[1].body.right.type
                  === 'TemplateLiteral') {
                  let attr =
                    path.node.arguments[1].body.right.quasis[0].value.raw,
                    {
                      test: { name: param },
                      consequent: { value: ifTrue },
                      alternate: { value: ifFalse }
                    } = path.node.arguments[1].body.right.expressions[0];
                  styles[`${element}.${compName}.${param}True`] =
                    `${attr}${ifTrue};`;
                  styles[`${element}.${compName}.${param}False`] =
                    `${attr}${ifFalse};`;

                  if (!paramList[compName]) paramList[compName] = [];
                  paramList[compName].push({ attr, param });
                }
              }
              else if (path.node.arguments[1].body.left.type
                === 'StringLiteral') {
                styles[`${element}.${compName}`] =
                  path.node.arguments[1].body.left.value;
                if (path.node.arguments[1].body.right.type
                  === 'TemplateLiteral') {
                  let attr =
                    path.node.arguments[1].body.right.quasis[0].value.raw,
                    {
                      test: { name: param },
                      consequent: { value: ifTrue },
                      alternate: { value: ifFalse }
                    } = path.node.arguments[1].body.right.expressions[0];
                  styles[`${element}.${compName}.${param}True`] =
                    `${attr}${ifTrue};`;
                  styles[`${element}.${compName}.${param}False`] =
                    `${attr}${ifFalse};`;

                  if (!paramList[compName]) paramList[compName] = [];
                  paramList[compName].push({ attr, param });
                }
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

              path.replaceWith(t.functionExpression(null,
                [t.identifier('props')],
                t.blockStatement([t.returnStatement(t.callExpression(
                  t.identifier('React.createElement'),
                  [t.stringLiteral(element),
                    t.objectExpression([
                      t.spreadElement(t.identifier('props')),
                      t.objectProperty(
                        t.stringLiteral('className'),
                        t.templateLiteral([
                          t.templateElement(
                            {
                              raw: compName,
                              cooked: compName
                            }, false
                          ), ...quazis],
                        daTemplate))]), t.identifier('props.children')]))])));
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
        fs.writeFileSync(fn, fileStr);
      }
    }
  };
}
