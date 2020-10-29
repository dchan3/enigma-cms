module.exports = function () {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === '_react2') {
          path.node.name = '_react';
        }
      }
    }
  }
}
