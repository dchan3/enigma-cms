import { h, createContext } from 'preact';
import { useState, useReducer } from 'preact/hooks';

/** @jsx h **/

const CodeEditorContext = createContext();

export default CodeEditorContext;

const { Provider } = CodeEditorContext;
export const CodeEditorContextProvider = ({ initialValue = '', children }) => {
  let [state, setState] = useState({
      value: initialValue
    }), [view, toggleView] = useReducer(function(curr) {
      return !curr;
    }, false);

  return <Provider value={{ state, setState, view, toggleView }}>{children}</Provider>;
};
