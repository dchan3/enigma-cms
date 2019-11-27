let loget = function(obj, keyString) {
  if (keyString.indexOf('.') <= -1) return obj[keyString];
  var keys = keyString.split('.'), temp = Object.assign({}, obj);
  for (var k = 0; k < keys.length && temp !== undefined; k++) {
    temp = temp[keys[k]];
  }
  return temp ? temp : undefined;
}

export default (function() {
  let helpers = {};

  return {
    compile(template) {
      let c = this.compile.bind(this);

      return function(obj) {
        let retval = template.replace('\n', '');

        if (retval.indexOf('{{#each ') > -1) {
          retval = retval.replace(
            /\{\{#each ([a-zA-Z0-9_. ]+)\}\}(.+)\{\{\/each\}\}/mg,
            function(match, attr, body) {
              return loget(obj, attr).map(function(node) {
                return c(body)({ 'this': node });
              }).join('');
            });
        }

        return retval.replace(/=?\{{2,3}([a-zA-Z0-9_. ]+)\}{2,3}/mg,
          function(match, p1) {
            let retval = '';
            if (p1.indexOf(' ') > -1) {
              let spl = p1.split(' ');
              if (helpers[spl[0]]) {
                retval = helpers[spl[0]](...spl.slice(1).map(function(n) {
                  if (n.match(/^\d+$/)) return parseInt(n, 10);
                  if (loget(obj, n)) return loget(obj, n);
                  return n;
                }));
              }
            }
            else if (loget(obj, p1)) retval = loget(obj, p1);
            if (match[0] === '=') {
              retval = `"${retval}"`;
            }
            return retval;
          });
      };
    },
    registerHelper(name, fxn) {
      helpers[name] = fxn;
    }
  }
})();
