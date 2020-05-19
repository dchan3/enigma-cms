import { h, createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { createBrowserHistory as createHistory } from 'history';

/** @jsx h **/

const TheRouterContext = createContext();

export default TheRouterContext;

const { Provider } = TheRouterContext;
export const TheRouterContextProvider = ({ value, children }) => {
  let [location, setLocation] = useState(value.location || null);

  let [history, setHistory] = useState(value.history ||
    createHistory({ basename: value.basename, forceRefresh: false }));

  useEffect(function() {
    history.listen(loc => setLocation(loc));
  }, []);

  return <Provider value={{ ...value, history, setHistory,
    location, setLocation, basename: value.basename }}>{children}</Provider>;
};
