let t = require('@babel/types');

module.exports = function () {
  return {
    visitor: {
      CallExpression: function(path) {
        if (path.node.callee.property && path.node.callee.property.name === 'forEach') {
          if (path.node.arguments[0].type === 'ArrowFunctionExpression' ||
          path.node.arguments[0].type === 'FunctionExpression') {
            if (path.node.arguments[0].params.length === 1) {
              path.parentPath.replaceWith(t.forOfStatement(
                t.variableDeclaration('let', [t.variableDeclarator(path.node.arguments[0].params[0])]),
                path.node.callee.object,
                path.node.arguments[0].body
              ));
            }
            else if (path.node.arguments[0].params.length === 2) {
              path.parentPath.replaceWith(t.forInStatement(
                t.variableDeclaration('let', [t.variableDeclarator(t.identifier(path.node.arguments[0].params[1].name))]),
                path.node.callee.object,
                t.blockStatement([t.ifStatement(t.binaryExpression('!==', t.identifier(path.node.arguments[0].params[1].name), t.stringLiteral('length')),
                  t.blockStatement([t.variableDeclaration('let',
                    [t.variableDeclarator(path.node.arguments[0].params[0],
                    t.memberExpression(t.identifier(path.node.callee.object.name), t.identifier(path.node.arguments[0].params[1].name), true))]
                  ), ...path.node.arguments[0].body.body])
              )])));
            }
          }
          else if (path.node.arguments[0].type === 'Identifier' ||
            path.node.arguments[0].type === 'MemberExpression') {
            path.parentPath.replaceWith(t.forOfStatement(
              t.variableDeclaration('let', [t.variableDeclarator(t.identifier('item'))]),
              path.node.callee.object,
              t.expressionStatement(
                t.callExpression(path.node.arguments[0], [t.identifier('item')])
              )));
          }
        }
      }
    }
  }
};
