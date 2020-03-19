let t = require('@babel/types'), kwTable = require('./kw-table');

module.exports =
  function () {
    return {
      visitor: {
        ObjectProperty(path) {
          if (!path.node.computed) {
            if (path.node.key.type === 'Identifier') {
              if (kwTable[path.node.key.name] && typeof kwTable[path.node.key.name] === 'string') {
                path.replaceWith(t.objectProperty(t.identifier(kwTable[path.node.key.name]), path.node.value, true));
              }
            } else if (path.node.key.type === 'StringLiteral') {
              if (kwTable[path.node.key.value] && typeof kwTable[path.node.key.value] === 'string') {
                path.replaceWith(t.objectProperty(t.identifier(kwTable[path.node.key.value]), path.node.value, true));
              }
            }
          }
        },
        StringLiteral(path) {
          if (path.node.value === 'history' && ['ImportDeclaration', 'CallExpression'].includes(path.parent.type)) {
            return;
          }

          if (kwTable[path.node.value] && !['ObjectProperty', 'VariableDeclarator'].includes(path.parent.type)) {
            path.replaceWith(t.identifier(kwTable[path.node.value]));
          }
        },
        MemberExpression(path) {
          if (path.node.property.type === 'Identifier' && path.node.property.name.length > 1) {
            if (kwTable[path.node.property.name] && typeof kwTable[path.node.property.name] === 'string') {
              path.replaceWith(t.memberExpression(
                path.node.object,
                t.identifier(kwTable[path.node.property.name]),
                true
              ));
            }
          }
        },
        NumericLiteral(path) {
          if (kwTable[path.node.value]) {
            path.replaceWith(t.identifier(kwTable[path.node.value]));
          }
        }
      }
    };
  };
