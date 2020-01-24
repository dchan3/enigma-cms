import { h, createContext } from 'preact';
import { useState } from 'preact/hooks';

/** @jsx h **/

let initialState = staticContext => staticContext;
const StaticContext = createContext(initialState);

export default StaticContext;

const { Provider } = StaticContext;
export const StaticContextProvider = ({ children, initialVals }) => {
  let iState = Object.assign({}, initialState(initialVals)),
    [staticContext, setStaticContext] = useState(iState);

  return <Provider value={{
    staticContext, setStaticContext }}>{children}</Provider>;
};
