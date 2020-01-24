let t = require('@babel/types');

module.exports = function () {
  let recBin = function(nodes) {
    if (nodes.length === 2) {
      let [left, right] = nodes;
      if (left.type === 'TemplateElement') {
        left = t.stringLiteral(left.value.cooked);
      }
      if (right.type === 'TemplateElement') {
        right = t.stringLiteral(right.value.cooked);
      }
      return t.binaryExpression('+', left, right);
    }
    else {
      let last = nodes.slice(-1)[0]
      return t.binaryExpression('+', recBin(nodes.slice(0, -1)),
        last.type === 'TemplateElement' ? t.stringLiteral(last.value.cooked) : last);
    }
  };

  return {
    visitor: {
      TemplateLiteral(path) {
        let { node: { expressions, quasis } } = path,
          arr = [...expressions, ...quasis];
        if (arr.slice(-1)[0].value.cooked === '') {
          arr = arr.slice(0,-1);
        }
        arr.sort(function(a,b) {
          if (a.start < b.start) return -1
          if (a.start > b.start) return 1;
          return 0;
        });

        path.replaceWith(recBin(arr));
      }
    }
  };
}
