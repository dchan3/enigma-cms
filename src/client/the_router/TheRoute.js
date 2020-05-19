import { h, createElement } from 'preact'; /** @jsx h **/
import { TheRouterContextProvider } from '../contexts/TheRouterContext';
import matchThePath from '../../lib/utils/match_the_path';
import useTheRouterContext from '../hooks/useTheRouterContext';

export default function TheRoute(props) {
  let context = useTheRouterContext(), location = props.location
    || context.location, history = props.history || context.history,
    match = matchThePath(location.pathname.replace(context.basename, ''), {
      path: props.path,
      exact: props.exact
    });

  return <TheRouterContextProvider value={{ ...context, location, match }}>
    {createElement(props.component, {
      history,
      location,
      match
    })}
  </TheRouterContextProvider>;
}
