import { useState, useEffect } from 'preact/hooks';
import useStaticContext from './useStaticContext';
import useTheRouterContext from './useTheRouterContext';
import { getRequest } from '../utils/api_request_async';
import { loget } from '../../lib/utils/lofuncs';

export default function useFrontContext({ dataParams, urlParams, apiUrl, cb,
  initial }) {
  let { match } = useTheRouterContext(),
    { dataObj } = useStaticContext();

  if (dataObj && match) {
    let d = 0, { params } = match;
    if (params && Object.keys(params).length) {
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
    else dataObj = null;
  }
  else dataObj = null;

  let [state, setState] = useState({ dataObj });

  useEffect(function() {
    if (match && match.params && !dataObj) {
      let reqUrl = apiUrl(match.params || {});

      if (reqUrl.length) {
        getRequest(reqUrl, function(d) {
          if (cb) cb(d, setState, match.params || {});
          else setState({ dataObj: Object.keys(d).length ? d :
            undefined });
        });
      }
    }
    else if (initial) setState(initial);
  }, match && match.params && Object.values(match.params) || []);

  return { state, setState,
    apiUrl: match && match.params && apiUrl(match.params) && null };
}
