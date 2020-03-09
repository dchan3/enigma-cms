import { useState, useEffect } from 'preact/hooks';
import useStaticContext from './useStaticContext';
import useTheRouterContext from './useTheRouterContext';
import { getRequest } from '../utils/api_request_async';
import { loget } from '../utils/lofuncs';

export default function useFrontContext({ dataParams, urlParams, apiUrl, cb,
  initial }) {
  let { match } = useTheRouterContext(),
    { dataObj } = useStaticContext(['dataObj']);

  if (dataObj && match) {
    let d = 0, { params } = match;
    if (params) {
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
  }
  else { dataObj = null; }

  let [state, setState] = useState({ dataObj });

  useEffect(function() {
    if (match) {
      if (apiUrl(match.params || {}).length) {
        getRequest(apiUrl(match.params || {}), function(dataObj) {
          if (cb) cb(dataObj, setState, match.aparams || {});
          else setState({ dataObj: Object.keys(dataObj).length ? dataObj :
            undefined });
        });
      }
    }
    else if (initial) setState(initial);
  }, match && match.params && Object.values(match.params) || []);

  return { state, setState, apiUrl: match && match.params && apiUrl(match.params) && null };
}
