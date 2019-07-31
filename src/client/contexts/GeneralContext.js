import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

let initialState = ({ history, match, staticContext }) => ({
  history, match, staticContext
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
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  initialVals: PropTypes.object
};
