let t = require('@babel/types'), kwTable = require('./kw-table');

module.exports =
  function () {
    return {
      visitor: {
        StringLiteral(path) {
          if (path.node.value === 'history' && ['ImportDeclaration', 'CallExpression'].includes(path.parent.type)) {
            return;
          }

          if (kwTable[path.node.value] && 'VariableDeclarator' !== path.parent.type) {
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
