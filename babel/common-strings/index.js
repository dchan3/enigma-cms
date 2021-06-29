let t = require('@babel/types'), kwTable = require('./kw-table');

function getValue(str, options, cb) {
  let repl = (options.table && options.table[str]) || kwTable[str];
  if (repl) {
    cb(repl);
  }
};

module.exports =
  function () {
    return {
      visitor: {
        ObjectProperty(path, { opts }) {
          if (path.node.computed) { // when obj[computedValue]
            if (path.node.key.type === 'StringLiteral') { // obj["variable"]
              getValue(path.node.key.value, opts, repl => {
                path.replaceWith(t.objectProperty(t.identifier(repl), path.node.value, true));
              });
            }
          }
        },
        StringLiteral(path, { opts }) {
          if (path.node.value === 'history' && ['ImportDeclaration', 'CallExpression'].includes(path.parent.type)) {
            return;
          }

          getValue(path.node.value, opts, (repl) => {
            if (!['VariableDeclarator', 'JSXAttribute'].includes(path.parent.type)) {
              path.replaceWith(t.identifier(repl));
            }
          });
        },
        MemberExpression(path, { opts }) {
          if (path.node.computed) {
            if (path.node.property.type === 'StringLiteral' && path.node.property.value.length > 1) {
              getValue(path.node.property.value, opts, repl => {
                if (typeof repl === 'string') {
                  path.replaceWith(t.memberExpression(
                    path.node.object,
                    t.identifier(repl),
                    true
                  ));
                }
              });
            }
          }
          else {
            getValue(path.node.property.name, opts, (repl) => {
              if (typeof repl === 'string') {
                path.replaceWith(t.memberExpression(
                  path.node.object,
                  t.identifier(repl),
                  true
                ));
              }
            });
          }
        },
        Identifier(path) {
          if (path.node.name === 'undefined') {
            path.replaceWith(t.identifier(kwTable["UNDEFINED"]));
          }
        },
        NumericLiteral(path) {
          if (kwTable[path.node.value]) {
            path.replaceWith(t.identifier(kwTable[path.node.value]));
          }
        },
        BooleanLiteral(path) {
          path.replaceWith(t.identifier(kwTable[path.node.value ? "true" : "false"]));
        },
        NullLiteral(path) {
          path.replaceWith(t.identifier(kwTable["null"]));
        }
      }
    };
  };
