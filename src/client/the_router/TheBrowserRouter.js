import { h } from 'preact'; /** @jsx h **/
import { createBrowserHistory as createHistory } from 'history';
import TheRouter from './TheRouter';

export default function TheBrowserRouter(props) {
  let history = createHistory({ basename: props.basename, forceRefresh: false });

  return <TheRouter history={history}
    basename={props.basename}>{props.children || null}</TheRouter>;
}
