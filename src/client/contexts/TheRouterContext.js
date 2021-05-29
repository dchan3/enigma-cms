import { h, createContext } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { createBrowserHistory as createHistory, parsePath } from 'history';

/** @jsx h **/

const TheRouterContext = createContext();

export default TheRouterContext;

const { Provider } = TheRouterContext;
export const TheRouterContextProvider = ({ value, children }) => {
  let [location, setLocation] = useState(
    value.location && (typeof value.location !== 'string' ? value.location : parsePath(value.location)) || null);

  let [history, setHistory] = useState(value.history ||
    createHistory({ basename: value.basename }));

  useEffect(function() {
    history.listen(({ location }) => { 
      setLocation(location);
    });
  }, []);

  useEffect(function() {
    setLocation(history.location);
  }, [history.location.pathname]);

  return <Provider value={{ ...value, history, setHistory,
    location, setLocation, basename: value.basename }}>{children}</Provider>;
};
