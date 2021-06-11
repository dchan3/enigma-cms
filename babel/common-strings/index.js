let t = require('@babel/types'), kwTable = require('./kw-table');

module.exports =
  function () {
    return {
      visitor: {
        ObjectProperty(path, { opts }) {
          if (path.node.computed) { // when obj[computedValue]
            if (path.node.key.type === 'Identifier') { // when obj[variable]
              if (opts.table && opts.table[path.node.key.name]) {
                path.replaceWith(t.objectProperty(t.identifier(opts.table[path.node.key.name]), path.node.value, true));
              }
              if (kwTable[path.node.key.name] && typeof kwTable[path.node.key.name] === 'string') {
                path.replaceWith(t.objectProperty(t.identifier(kwTable[path.node.key.name]), path.node.value, true));
              }
            } else if (path.node.key.type === 'StringLiteral') { // obj["variable"]
              if (opts.table && opts.table[path.node.key.value]) {
                path.replaceWith(t.objectProperty(t.identifier(opts.table[path.node.key.value]), path.node.value, true));
              }
              if (kwTable[path.node.key.value] && typeof kwTable[path.node.key.value] === 'string') {
                path.replaceWith(t.objectProperty(t.identifier(kwTable[path.node.key.value]), path.node.value, true));
              }
            }
          }
        },
        StringLiteral(path, { opts }) {
          if (path.node.value === 'history' && ['ImportDeclaration', 'CallExpression'].includes(path.parent.type)) {
            return;
          }
          if (opts.table && opts.table[path.node.value] && !['ObjectProperty', 'VariableDeclarator', 'JSXAttribute'].includes(path.parent.type)) {
            path.replaceWith(t.identifier(opts.table[path.node.value]));
          }
          if (kwTable[path.node.value] && !['ObjectProperty', 'VariableDeclarator', 'JSXAttribute'].includes(path.parent.type)) {
            path.replaceWith(t.identifier(kwTable[path.node.value]));
          }
        },
        MemberExpression(path, { opts }) {
          if (path.node.computed) {
            if (path.node.property.type === 'Identifier' && path.node.property.name.length > 1) {
              if (opts && opts.table && opts.table[path.node.property.name] && typeof opts.table[path.node.property.name] === 'string') {
                path.replaceWith(t.memberExpression(
                  path.node.object,
                  t.identifier(opts.table[path.node.property.name]),
                  true
                ));
              }
              if (kwTable[path.node.property.name] && typeof kwTable[path.node.property.name] === 'string') {
                path.replaceWith(t.memberExpression(
                  path.node.object,
                  t.identifier(kwTable[path.node.property.name]),
                  true
                ));
              }
            }
            else if (path.node.property.type === 'StringLiteral' && path.node.property.value.length > 1) {
              if (opts && opts.table && opts.table[path.node.property.value] && typeof opts.table[path.node.property.value] === 'string') {
                path.replaceWith(t.memberExpression(
                  path.node.object,
                  t.identifier(opts.table[path.node.property.value]),
                  true
                ));
              }
              if (kwTable[path.node.property.value] && typeof kwTable[path.node.property.value] === 'string') {
                path.replaceWith(t.memberExpression(
                  path.node.object,
                  t.identifier(kwTable[path.node.property.value]),
                  true
                ));
              }
            }
          }
        },
        Identifier(path) {
          if (path.node.name === 'undefined') {
            path.node.name = kwTable["UNDEFINED"];
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
