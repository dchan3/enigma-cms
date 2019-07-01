let crypto = require('crypto'),
  hashifyName =
    (name) => crypto.createHash('sha1').update(name).digest('base64')
      .replace(/^\d/g, '_').replace(/[+/=]/g, '_').substring(0, 6),
  cap = str => str.replace(/^[a-z]/, match => match.toUpperCase()),
  renameToHash = (path, key, capit) => {
    let thing = path.node[key];
    if (thing) {
      let { name } = thing, hashed = hashifyName(name);
      path.scope.rename(name, capit ? cap(hashed) : hashed);
    }
  };

module.exports = function () {
  return {
    visitor: {
      FunctionDeclaration(path) {
        renameToHash(path, 'id', true);
      },
      VariableDeclarator(path) {
        renameToHash(path, 'id', true);
      }
    },
  };
};
