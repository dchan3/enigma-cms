import React, { createContext } from 'react';

const TheRouteContext = createContext();

export default TheRouteContext;

const { Provider } = TheRouteContext;
export const TheRouteContextProvider = ({ value, children }) => {
  return <Provider value={value}>{children}</Provider>;
};
