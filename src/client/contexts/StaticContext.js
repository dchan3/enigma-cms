import { h, createContext } from 'preact';
import { useState } from 'preact/hooks';

/** @jsx h **/

const StaticContext = createContext();

export default StaticContext;

const { Provider } = StaticContext;
export const StaticContextProvider = ({ children, initialVals }) => {
  let [staticContext, setStaticContext] = useState(initialVals);

  return <Provider value={{
    staticContext, setStaticContext }}>{children}</Provider>;
};
