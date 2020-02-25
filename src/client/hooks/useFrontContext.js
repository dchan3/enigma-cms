import { useState, useEffect } from 'preact/hooks';
import useStaticContext from './useStaticContext';
import useTheRouterContext from './useTheRouterContext';
import { getRequest } from '../utils/api_request_async';
import { loget } from '../utils/lofuncs';

export default function useFrontContext({ dataParams, urlParams, apiUrl, cb,
  initial }) {
  let { match: { params } } = useTheRouterContext(),
    { dataObj } = useStaticContext(['dataObj']);

  if (dataObj) {
    let d = 0;
    while (d < dataParams.length && dataObj) {
      var dt = loget(dataObj, dataParams[d]), ut =
          loget(params, urlParams[d]);
      if ((dt ===  null || dt === undefined) ||
          (ut === null || ut === undefined) || (dt && ut)
        && dt.toString() !== ut.toString()) {
        dataObj = null;
      }
      else d++;
    }
  }
  else { dataObj = null; }

  let [state, setState] = useState({ dataObj });

  useEffect(function() {
    if (apiUrl(params || {}).length) {
      getRequest(apiUrl(params || {}), function(dataObj) {
        if (cb) cb(dataObj, setState, params || {});
        else setState({ dataObj: Object.keys(dataObj).length ? dataObj :
          undefined });
      });
    }
    else if (initial) setState(initial);
  }, Object.values(params));

  return { state, setState, apiUrl: apiUrl(params) };
}
