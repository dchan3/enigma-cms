import React, { useContext, createElement } from 'react';
import TheRouterContext, { TheRouteContextProvider }
  from '../contexts/TheRouterContext';
import matchThePath from '../../lib/utils/match_the_path';

export default function TheRoute(props) {
  let context = useContext(TheRouterContext), location = props.location
    || context.location, history = props.history || context.history,
    match = matchThePath(location.pathname.replace(context.basename, ''), {
      path: props.path,
      exact: props.exact
    });

  return <TheRouteContextProvider value={{ ...context, location, match }}>
    {createElement(props.component, {
      history,
      location,
      match
    })}
  </TheRouteContextProvider>;
}
