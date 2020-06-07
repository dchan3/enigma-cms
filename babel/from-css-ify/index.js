let t = require('@babel/types'), fs = require('fs'),
  murmur = require('murmurhash-js/murmurhash3_gc');

const first = '一', last = '龥',
  saizeu = last.charCodeAt(0) - first.charCodeAt(0),
  getAlphabeticChar = (code) =>
    String.fromCharCode(first.charCodeAt(0) + code),
  generateAlphabeticName = (code) => {
    let name = '', x;
    for (x = code; x > saizeu; x = Math.floor(x / saizeu)) {
      name = getAlphabeticChar(x % saizeu) + name;
    }
    name = getAlphabeticChar(x % saizeu) + name;
    return name;
  }, hashifyName = (name) => generateAlphabeticName(murmur(name));

module.exports = function () {
  let styles = {}, fn = '', getCssFromTemplateIfTernary = function(node, str = '') {
    let retval = { consequent: str, alternate: str };
    let attr = node.quasis[0].value.raw,
      {
        consequent: { value: ifTrue },
        alternate: { value: ifFalse }
      } = node.expressions[0];
    retval.consequent +=  `${attr}${ifTrue}`;
    retval.alternate += `${attr}${ifFalse}`;
    return retval;
  }, getCssFromBinaryExp = function({ left, right }, str = '') {
    if (left.type === 'StringLiteral' && right.type === 'TemplateLiteral' && right.expressions[0].type === 'ConditionalExpression') {
      return getCssFromTemplateIfTernary(right, left.value);
    }
    else if (left.type === 'StringLiteral' && right.type === 'BinaryExpression') {
      return getCssFromBinaryExp(right, str + left.value);
    }
    else if (left.type === 'BinaryExpression' && right.type === 'StringLiteral') {
      return getCssFromBinaryExp(left, str + right.value);
    }
    else if (left.type === 'BinaryExpression' && right.type === 'TemplateLiteral') {
      let c = getCssFromBinaryExp(left), d = getCssFromTemplateIfTernary(right);
      if (Object.keys(c).length === Object.keys(d).length) {
        let e = {}
        for (var k in c) {
          e[k] = c[k] + (c[k].endsWith(";") ? '' : ';') + d[k];
        }

        return e;
      }
    }
    else if (left.type === 'TemplateLiteral' && right.type === 'TemplateLiteral') {
      let lft = getCssFromTemplateIfTernary(left), rgt = getCssFromTemplateIfTernary(right);

      return {
        "tt": str + lft.consequent + right.consequent,
        "tf": str + lft.consequent + right.alternate,
        "ft": str + lft.alternate + right.consequent,
        "ff": str + lft.alternate + right.alternate
      }
    }
  }

  return {
    visitor: {
      CallExpression({ node: { callee, arguments }}, { opts }) {
        if (fn === '') {
          if (opts && opts.toFile) fn = opts.toFile;
        }
        if (callee.name === 'fromCss') {
          let [{ element }, {
              type: styleType,
              value: styleValue,
              params: styleParams,
              body: styleBody
            }] = arguments, css = '';
          if (styleType === 'StringLiteral') {
            css = styleValue;
          }
          else if (styleType === 'ArrowFunctionExpression') {
            if (styleParams[0].type === 'ObjectPattern') {
              let paramList = styleParams[0].properties.map(({ value: { name }}) => name);
              if (styleBody.type === 'BinaryExpression' && styleBody.operator == '+') {

                css = getCssFromBinaryExp(styleBody);
              }
            }
          }
          if (typeof css === 'string') {
            if (!css.endsWith(";")) css += ';';
            className = `fc-${hashifyName(`fc ${css}`)}`;
            styles[`.${className}`] = css;
          }
          else {
            for (let i in css) {
              let ac = css[i].endsWith(";") ? css[i] : (css[i] + ';')
              className = `fc-${hashifyName(`fc ${ac}`)}`;
              styles[`.${className}`] = ac;
            }
          }
        }
      }
    },
    post() {
      if (fn.length) {
        let fileStr = '';
        for (let selector in styles) {
          // eslint-disable-next-line prefer-template
          fileStr += selector + '{' + styles[selector] + '}';
        }
        if (typeof fn === 'string') fs.writeFileSync(fn, fileStr);
        else for (let f = 0; f < fn.length; f++) {
          fs.writeFileSync(fn[f], fileStr);
        }
      }
    }
  };
}
