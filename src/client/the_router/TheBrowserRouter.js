import React from 'react';
import { createBrowserHistory as createHistory } from 'history';
import TheRouter from './TheRouter';

export default function TheBrowserRouter(props) {
  let history = createHistory(props);

  return <TheRouter history={history}
    basename={props.basename}>{props.children || null}</TheRouter>;
}
