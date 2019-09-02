import { useState } from 'react';
import useStaticContext from './useStaticContext.js';
import useGeneralContext from './useGeneralContext.js';
import { loget } from '../utils/lofuncs';

export default function useFrontContext({ dataParams, urlParams, apiUrl }) {
  let { generalState } = useGeneralContext(),
    { match: { params } } = generalState,
    { dataObj } = useStaticContext(['dataObj']), initState = {
      dataObj
    };

  if (dataObj) {
    let d = 0;
    while (d < dataParams.length && initState.dataObj) {
      var dt = loget(dataObj, dataParams[d]), ut =
          loget(params, urlParams[d]);
      if ((dt ===  null || dt === undefined) ||
          (ut === null || ut === undefined) || 
          (dt !== null && dt !== undefined) && (ut !== null && ut !== undefined)
        && dt.toString() !== ut.toString()) {
        initState.dataObj = null;
      }
      else d++;
    }
  }
  else { initState.dataObj = null; }

  let [state, setState] = useState(initState);
  return { state, setState, apiUrl: apiUrl(params) };
}
