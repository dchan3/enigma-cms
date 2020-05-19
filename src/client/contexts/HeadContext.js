import { h, createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';

/** @jsx h **/

const initialState = { title: '', description: '', image: '', keywords: '' };

const HeadContext = createContext(initialState);

export default HeadContext;

const { Provider } = HeadContext;
export const HeadContextProvider = ({ value, children }) => {
  let [{ title, image, description, keywords }, setState] = useState(value || initialState);

  function setMeta(type, attr, content) {
    let fullSelector = `meta[${type}="${attr}"]`;
    if (document.querySelector(fullSelector) === null) {
      let node = document.createElement('meta');
      node.setAttribute(type, attr);
      document.querySelector('head').appendChild(node);
    }
    document.querySelector(fullSelector).content = content;
  }

  function bulkUpdate(str, val) {
    setMeta('property', `og:${str}`, val);
    setMeta('name', `twitter:${str}`, val);
  }

  useEffect(function() {
    setMeta('name', 'twitter:card', 'summary');
  }, []);

  useEffect(function() {
    document.title = title;
    bulkUpdate('title', title);
  }, [title]);

  useEffect(function() {
    setMeta('name', 'description', description);
    bulkUpdate('description', description);
  }, [description]);

  useEffect(function() {
    bulkUpdate('image', image);
  }, [image]);

  useEffect(function() {
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'news_keywords', keywords);
  }, [keywords]);

  return <Provider value={{ state: {
    title, image, description, keywords
  }, setState }}>{children}</Provider>;
};
