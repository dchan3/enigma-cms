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
                t.identifier(path.node.arguments[0].params[0].name),
                t.identifier(path.node.callee.object.name),
                path.node.arguments[0].body
              ));
            }
            else if (path.node.arguments[0].params.length === 2) {
              path.parentPath.replaceWith(t.forInStatement(
                t.identifier(path.node.arguments[0].params[1].name),
                t.identifier(path.node.callee.object.name),
                t.blockStatement([t.ifStatement(t.binaryExpression('!==', t.identifier(path.node.arguments[0].params[1].name), t.stringLiteral('length')),
                  t.blockStatement([t.variableDeclaration('let',
                    [t.variableDeclarator(t.identifier(path.node.arguments[0].params[0].name),
                    t.memberExpression(t.identifier(path.node.callee.object.name), t.identifier(path.node.arguments[0].params[1].name), true))]
                  ), ...path.node.arguments[0].body.body])
              )])));
            }
          }
          else if (path.node.arguments[0].type === 'Identifier') {
            path.parentPath.replaceWith(t.forOfStatement(
              t.identifier('item'),
              t.identifier(path.node.callee.object.name),
              t.expressionStatement(
                t.callExpression(t.identifier(path.node.arguments[0].name), [t.identifier('item')])
              )));
          }
          else if (path.node.arguments[0].type === 'MemberExpression') {
            path.parentPath.replaceWith(t.forOfStatement(
              t.identifier('item'),
              t.identifier(path.node.callee.object.name),
              t.expressionStatement(
                t.callExpression(path.node.arguments[0], [t.identifier('item')])
              )));
          }
        }
      }
    }
  }
};
