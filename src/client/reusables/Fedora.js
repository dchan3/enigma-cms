import React, { useContext, useEffect } from 'react';
import HeadContext, { HeadContextProvider } from '../contexts/HeadContext';

function Fedora(props) {
  let { state, setState } = useContext(HeadContext);

  useEffect(function() {
    let newState = state;

    for (let k in newState) {
      if (state[k] !== props[k]) newState[k] = props[k];
    }

    setState(newState);
  }, []);

  return null;
}

export default (props) => <HeadContextProvider><Fedora {...props} /></HeadContextProvider>;
