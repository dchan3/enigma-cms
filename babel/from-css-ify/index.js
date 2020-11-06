let t = require('@babel/types'), fs = require('fs'),
  { murmur } = require('../../addons/murmur/build/Release/murmur.node');

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
  }, hashifyName = (name) => generateAlphabeticName(murmur(name)),
  getCssFromTemplateIfTernary = function(node, str = '') {
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
      if (left.type === 'StringLiteral' && right.type === 'TemplateLiteral') {
        if (right.expressions[0].type === 'ConditionalExpression') {
          if (right.expressions[0].consequent === 'StringLiteral' &&
            right.expressions[0].alternate === 'Identifier') {
            return left.value;
          }
          else {
            return getCssFromTemplateIfTernary(right, left.value);
          }
        }
        else if (right.expressions[0].type === 'Identifier') {
          return left.value;
        }
      }
      else if (left.type === 'StringLiteral' &&
        right.type === 'BinaryExpression') {
        return getCssFromBinaryExp(right, str + left.value);
      }
      else if (left.type === 'BinaryExpression' &&
        right.type === 'StringLiteral') {
        return getCssFromBinaryExp(left, str + right.value);
      }
      else if (left.type === 'BinaryExpression' &&
        right.type === 'TemplateLiteral') {
        let c = getCssFromBinaryExp(left),
          d = getCssFromTemplateIfTernary(right);
        if (Object.keys(c).length === Object.keys(d).length) {
          let e = {}
          for (var k in c) {
            e[k] = c[k] + (c[k].endsWith(";") ? '' : ';') + d[k];
          }

          return e;
        }
      }
      else if (left.type === 'TemplateLiteral' &&
        right.type === 'TemplateLiteral') {
        let lft = getCssFromTemplateIfTernary(left),
          rgt = getCssFromTemplateIfTernary(right);

        return {
          "tt": str + lft.consequent + right.consequent,
          "tf": str + lft.consequent + right.alternate,
          "ft": str + lft.alternate + right.consequent,
          "ff": str + lft.alternate + right.alternate
        }
      }
    }

module.exports = function () {
  let styles = {}, fn = '';

  return {
    visitor: {
      CallExpression(path, { opts }) {
        var { node: { callee, arguments: args } } = path, diff = -1;

        if (fn === '') {
          if (opts && opts.toFile) fn = opts.toFile;
        }
        if (callee.name === 'fromCss') {
          let [{ element }, {
              type: styleType,
              value: styleValue,
              params: styleParams,
              body: styleBody,
              properties: styleProperties
            }] = args, css = '';
          if (styleType === 'StringLiteral') {
            css = styleValue;
          }
          else if (styleType === 'ArrowFunctionExpression') {
            if (styleParams[0].type === 'ObjectPattern') {
              let paramList = styleParams[0].properties.map(({
                value: { name } }) => name);
              if (styleBody.type === 'BinaryExpression' &&
                styleBody.operator == '+') {
                css = getCssFromBinaryExp(styleBody);
                if (styleBody.left.type === 'StringLiteral') {
                  diff = styleBody.left.value.length;
                }
              }
            }
          }
          else if (styleType === 'ObjectExpression') {
            css = {};
            for (var i = 0; i < styleProperties.length; i++) {
              css[styleProperties[i].key.value] =
                styleProperties[i].value.value;
            }
          }

          if (typeof css === 'string') {
            if (!css.endsWith(";")) css += ';';
            className = `fc-${hashifyName(`fc ${css}`)}`;
            styles[`.${className}`] = css;
          }
          else if (css) {
            if (Object.keys(css).includes('&')) {
              // First aggregate all selectors
              let mash = '';
              for (let k in css) {
                let ac = css[k].endsWith(";") ? css[k] : (css[k] + ';')
                mash += k.replace(/&/g, '.fc') + '{' + css[k] + '}';
              }
              className = `fc-${hashifyName(`fc ${mash}`)}`;
              for (let o in css) {
                styles[o.replace(/&/g, `.${className}`)] = css[o];
              }
            }
            else {
              for (let i in css) {
                let ac = css[i].endsWith(";") ? css[i] : (css[i] + ';');
                className = `fc-${hashifyName(`fc ${ac}`)}`;
                styles[`.${className}`] = ac;
              }
            }
          }

          if (diff > -1) {
            let newPath = path;
            newPath.node.arguments[2] = t.numericLiteral(diff);
            path.replaceWith(newPath.node);
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
