let crypto = require('crypto');

module.exports = function () {
  return {
    visitor: {
      FunctionDeclaration(path) {
        if (path.node.id) {
          let newName = crypto.createHash('sha1')
            .update(path.node.id.name).digest('base64')
            .replace(/^\d/g, '_')
            .replace(/[+/=]/g, '_')
            .substring(0, 6);
          path.scope.rename(path.node.id.name, newName);
        }
      },
      VariableDeclarator(path) {
        if (path.node.id) {
          let newName = crypto.createHash('sha1').update(path.node.id.name)
            .digest('base64').replace(/^\d/g, '_')
            .replace(/[+/=]/g, '_')
            .substring(0, 6);
          path.scope.rename(path.node.id.name, newName.replace(/^[a-z]/,
            match => match.toUpperCase()));
        }
      },
      ImportSpecifier(path) {
        if (path.node.local) {
          let newName = crypto.createHash('sha1')
            .update(path.node.local.name).digest('base64')
            .replace(/^\d/g, '_')
            .replace(/[+/=]/g, '_')
            .substring(0, 6);
          path.scope.rename(path.node.local.name, newName.replace(/^[a-z]/,
            match => match.toUpperCase()));
        }
      }
    },
  };
};
