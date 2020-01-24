import { useContext } from 'preact/hooks';
import StaticContext from '../contexts/StaticContext.js';

export default function useStaticContext(keys) {
  let { staticContext } = useContext(StaticContext), retval = {};
  for (let k = 0; k < keys.length; k++) {
    retval[keys[k]] = staticContext[keys[k]] || undefined;
  }
  return retval;
}
