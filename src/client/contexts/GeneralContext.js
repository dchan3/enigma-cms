import React, { createContext, useState } from 'react';
import { oneOfType, object, array } from 'prop-types';

let initialState = ({ history, match }) => ({
  history, match
});
const GeneralContext = createContext(initialState);

export default GeneralContext;

const { Provider } = GeneralContext;
export const GeneralContextProvider = ({ children, initialVals }) => {
  let iState = Object.assign({}, initialState(initialVals)),
    [generalState, setGeneralState] = useState(iState);

  return <Provider value={{ generalState,
    setGeneralState }}>{children}</Provider>;
};

GeneralContextProvider.propTypes = {
  children: oneOfType([array, object]),
  initialVals: object
};
