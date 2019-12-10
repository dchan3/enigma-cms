import { useState, useEffect } from 'react';
import useStaticContext from './useStaticContext';
import useGeneralContext from './useGeneralContext';
import requests from '../utils/api_request_async';
import { loget } from '../utils/lofuncs';

export default function useFrontContext({ dataParams, urlParams, apiUrl, cb,
  initial }) {
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

  useEffect(function() {
    if (!state.dataObj) {
      if (apiUrl(params || {}).length) {
        requests.getRequest(apiUrl(params || {}), function(dataObj) {
          if (cb) cb(dataObj, setState, params || {});
          else setState({ dataObj: Object.keys(dataObj).length ? dataObj :
            undefined });
        });
      }
      else if (initial) setState(initial);
    }
  }, []);

  return { state, setState, apiUrl: apiUrl(params) };
}
