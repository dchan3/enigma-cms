import React, { createContext, useState, useEffect } from 'react';

const initialState = { title: '', description: '', image: '' };

const HeadContext = createContext(initialState);

export default HeadContext;

const { Provider } = HeadContext;
export const HeadContextProvider = ({ value, children }) => {
  let [{ title, description, image }, setState] = useState(value || initialState);

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
    document.title = title;
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);

  }, [title]);

  useEffect(function() {
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:description', description);
  }, [description]);

  useEffect(function() {
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:image', image);
  }, [image]);

  return <Provider value={{ state: { title, image, description }, setState }}>{children}</Provider>;
};
