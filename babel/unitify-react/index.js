module.exports = function () {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === '_react2') {
          path.scope.rename(path.node.name, '_react');
        }
      }
    }
  }
}
