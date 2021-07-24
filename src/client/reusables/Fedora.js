import { h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import HeadContext from '../contexts/HeadContext';

/** @jsx h **/

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

export default Fedora;
