import React, { createContext, useState, useEffect } from 'react';

const initialState = { title: '', description: '', image: '' };

const HeadContext = createContext(initialState);

export default HeadContext;

const { Provider } = HeadContext;
export const HeadContextProvider = (props) => {
  let [state, setState] = useState(props.value || initialState);

  useEffect(function() {
    document.title = state.title;
    if (document.querySelector('meta[property="og:title"]') === null) {
      let node = document.createElement('meta');
      node.setAttribute('property', 'og:title');
      document.querySelector('head').appendChild(node);
    }
    document.querySelector('meta[property="og:title"]').content = state.title;
  }, [state.title]);

  useEffect(function() {
    if (document.querySelector('meta[property="og:description"]') === null) {
      let node = document.createElement('meta');
      node.setAttribute('property', 'og:description');
      document.querySelector('head').appendChild(node);
    }
    document.querySelector('meta[property="og:description"]').content = state.description;
    if (document.querySelector('meta[property="og:image"]') === null) {
      let node = document.createElement('meta');
      node.setAttribute('property', 'og:image');
      document.querySelector('head').appendChild(node);
    }
    document.querySelector('meta[property="og:image"]').content = state.image;
  }, [state.description, state.image]);

  return <Provider value={{ state, setState }}>{props.children}</Provider>;
};
