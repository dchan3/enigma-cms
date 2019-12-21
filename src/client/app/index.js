import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';
import TheBrowserRouter from '../the_router/TheBrowserRouter';
import { StaticContextProvider } from '../contexts/StaticContext';
import { HeadContextProvider } from '../contexts/HeadContext';
import { default as requests } from '../utils/api_request_async';

requests.getRequest('users/get', (resp) => {
  var user = resp || null;
  hydrate(<HeadContextProvider>
    <TheBrowserRouter>
      <StaticContextProvider initialVals={{ ...window.__INITIAL_DATA__, user }}>
        <App />
      </StaticContextProvider>
    </TheBrowserRouter>
  </HeadContextProvider>,
  document.getElementById('root'));
});
