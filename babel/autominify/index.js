let t = require('@babel/types');

module.exports = function () {
  return {
    visitor: {
      StringLiteral(path) {
        if (path.node.value.indexOf('\n') >= 0) {
          path.replaceWith(t.stringLiteral(path.node.value.replace(/^\s+/gm, '')
            .replace(/\n/g, '').replace(/>\s+</g, '><')));
        }
      }
    }
  };
};
