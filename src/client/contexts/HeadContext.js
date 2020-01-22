import React, { createContext, useState, useEffect } from 'react';

const initialState = { title: '', description: '', image: '', keywords: '' };

const HeadContext = createContext(initialState);

export default HeadContext;

const { Provider } = HeadContext;
export const HeadContextProvider = ({ value, children }) => {
  let [{ title, description, image, keywords }, setState] = useState(value || initialState);

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
    setMeta('name', 'description', description);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:description', description);
  }, [description]);

  useEffect(function() {
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:image', image);
  }, [image]);

  useEffect(function() {
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'news_keywords', keywords);
  });

  return <Provider value={{ state: { title, image, description, keywords }, setState }}>{children}</Provider>;
};
