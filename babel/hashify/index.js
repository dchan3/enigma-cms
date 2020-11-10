const first = '一', last = '龥',
  saizeu = last.charCodeAt(0) - first.charCodeAt(0),
  { murmur } = require('../../build/Release/murmur.node'), getAlphabeticChar = (code) =>
    String.fromCharCode(first.charCodeAt(0) + code),
  generateAlphabeticName = (code) => {
  let name = '';
  let x;
  for (x = code; x > saizeu; x = Math.floor(x / saizeu)) {
    name = getAlphabeticChar(x % saizeu) + name;
  }

  name = getAlphabeticChar(x % saizeu) + name;
  return name;
}, hashifyName = (name) => generateAlphabeticName(murmur(name)),
  renameToHash = (path, key, minLength) => {
    let thing = path.node[key];
    if (thing) {
      let { name } = thing, hashed = hashifyName(name);
      if (name.length > minLength) {
        path.scope.rename(name, hashed);
      }
    }
  };

module.exports = function () {
  return {
    visitor: {
      FunctionDeclaration(path) {
        renameToHash(path, 'id', 1);
      },
      VariableDeclarator(path) {
        renameToHash(path, 'id', 1);
      }
    },
  };
};
