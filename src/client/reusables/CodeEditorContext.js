import React, { useState, createContext, useReducer } from 'react';

const CodeEditorContext = createContext();

export default CodeEditorContext;

const { Provider } = CodeEditorContext;
export const CodeEditorContextProvider = ({ value, children }) => {
  let [state, setState] = useState({
      value: value || ''
    }), [view, toggleView] = useReducer(function(curr) {
      return !curr;
    }, false);

  return <Provider value={{ state, setState, view, toggleView }}>{children}</Provider>;
};
