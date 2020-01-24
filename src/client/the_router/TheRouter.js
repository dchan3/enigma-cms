import { h } from 'preact'; /** @jsx h **/
import { useState, useEffect } from 'preact/hooks';
import { TheRouteContextProvider } from '../contexts/TheRouterContext';

export default function TheRouter({
  children, history, staticContext, basename
}) {
  let [location, setLocation] = useState(history.location);

  useEffect(function () {
    if (!staticContext) {
      history.listen(loc => setLocation(loc));
    }
  }, []);

  return <TheRouteContextProvider value={{
    history,
    location,
    setLocation,
    basename,
    match: {
      path: '/',
      url: '/',
      params: {},
      isExact: location.pathname === '/'
    },
    staticContext
  }}>{children || null}</TheRouteContextProvider>;
}
