import React, { createContext, useState, useEffect } from 'react';

const initialState = { title: '', description: '', image: '' };

const HeadContext = createContext(initialState);

export default HeadContext;

const { Provider } = HeadContext;
export const HeadContextProvider = (props) => {
  let [state, setState] = useState(props.value || initialState);

  function setMeta(type, attr, content) {
    let fullSelector = `meta[${type}="${attr}"]`;
    if (document.querySelector(fullSelector) === null) {
      let node = document.createElement('meta');
      node.setAttribute(type, attr);
      document.querySelector('head').appendChild(node);
    }
    document.querySelector(fullSelector).content = content;
  }

  useEffect(function() {
    setMeta('name', 'twitter:card', 'summary');
  }, []);

  useEffect(function() {
    document.title = state.title;
    setMeta('property', 'og:title', state.title);
    setMeta('name', 'twitter:title', state.title);

  }, [state.title]);

  useEffect(function() {
    setMeta('property', 'og:description', state.description);
    setMeta('name', 'twitter:description', state.description);
  }, [state.description]);

  useEffect(function() {
    setMeta('property', 'og:image', state.image);
    setMeta('name', 'twitter:image', state.image);
  }, [state.image]);

  return <Provider value={{ state, setState }}>{props.children}</Provider>;
};
