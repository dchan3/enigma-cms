import { h, hydrate } from 'preact';
import Dashboard from './Dashboard';
import TheBrowserRouter from '../the_router/TheBrowserRouter';
import { StaticContextProvider } from '../contexts/StaticContext';
import { HeadContextProvider } from '../contexts/HeadContext';
import { FromCssContextProvider } from '../contexts/FromCssContext';
import { getRequest } from '../utils/api_request_async';

/** @jsx h **/

getRequest('users/get', (resp) => {
  var user = resp || null;
  hydrate(<HeadContextProvider>
    <TheBrowserRouter>
      <StaticContextProvider initialVals={{ ...window.__INITIAL_DATA__, user }}>
        <Dashboard />
      </StaticContextProvider>
    </TheBrowserRouter>
  </HeadContextProvider>,
  document.getElementById('root'));
});
