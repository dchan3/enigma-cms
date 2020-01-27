import { h } from 'preact'; /** @jsx h **/
import { TheRouterContextProvider } from '../contexts/TheRouterContext';

export default function TheRouter({
  children, staticContext, basename, history = null
}) {
  return <TheRouterContextProvider value={{
    history,
    location: history.location,
    basename,
    match: {
      path: '/',
      url: '/',
      params: {},
      isExact: false
    },
    staticContext
  }}>{children || null}</TheRouterContextProvider>;
}
