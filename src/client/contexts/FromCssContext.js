import { h, createElement, createContext } from 'preact';
import { useRef, useState, useEffect, useContext } from 'preact/hooks';
import { default as murmur } from 'murmurhash-js/murmurhash3_gc';

/** @jsx h */

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

const FromCssContext = createContext();

const { Provider } = FromCssContext;

function styleFromPseudoObj(obj, props) {
  return function(className) {
    let string = '';

    for (let sel in obj) {
      string += `${sel.replace(/&/g, `.${className}`)}{${
        (typeof obj[sel] === 'function' ? obj[sel](props) : obj[sel])}}`;
    }

    return string;
  };
}

export default function fromCss(Element, style, useFirstNCharacters) {
  return function({ children, className: cName, ...rest }) {
    let { numComponents, ref, setNum } = useContext(FromCssContext);

    let actualStyle = typeof style === 'object' ?
      styleFromPseudoObj(style, rest) :
      (typeof style === 'function' ? style(rest) : style);

    let hashable = (typeof actualStyle === 'function' ?
      actualStyle('fc') : actualStyle);
    if (useFirstNCharacters) hashable = actualStyle.substring(0, useFirstNCharacters);

    let className = `fc-${hashifyName(`fc ${hashable}`)}`;

    useEffect(function() {
      setNum(numComponents + 1);
    }, []);

    if (ref.current.indexOf(className) < 0) {
      ref.current += typeof actualStyle === 'function' ?
        actualStyle(className) : `.${className}{${actualStyle}}`;
    }

    return <Element className={className + ((cName && cName.length) ? (` ${cName}`) : '')} {...rest}>{children}</Element>;
  };
}

function FromCssManager({ children, sheet }) {
  let ref = useRef(''), [numComponents, setNum] = useState(0);

  useEffect(() => {
    sheet.append(ref.current);
  }, [ref.current]);

  useEffect(() => {}, [numComponents]);

  return (
    <Provider value={{ ref, numComponents, setNum }}>
      {children}
    </Provider>
  );
}

class ThaSheet {
  constructor() {
    this.content = '';
  }

  toString() {
    return this.content;
  }

  append(str) {
    this.content += str;
  }
}

export const FromCssSheet = function() {
  let sheet = new ThaSheet();

  return {
    collectStyles(children) {
      return <FromCssManager sheet={sheet}>{children}</FromCssManager>;
    },
    spitSheet() {
      return sheet.toString();
    },
    append(str) {
      sheet.append(str);
    }
  }
};

export function FromCssContextProvider({ initial = '', children }) {
  let ref = useRef(initial), [numComponents, setNum] = useState(0);

  useEffect(() => {
    if (document.querySelector('style[data-fc]'))
      document.querySelector('style[data-fc]').innerText = ref.current;
  }, [ref.current]);

  useEffect(() => {}, [numComponents]);

  return <Provider value={{ ref, numComponents, setNum }}>
    {children}
  </Provider>;
}
