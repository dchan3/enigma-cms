import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { StaticContextProvider } from '../contexts/StaticContext';
import { default as requests } from '../utils/api_request_async';

requests.getRequest('users/get', (resp) => {
  var user = resp || null;
  hydrate(
    <BrowserRouter>
      <StaticContextProvider initialVals={{ ...window.__INITIAL_DATA__, user }}>
        <App />
      </StaticContextProvider>
    </BrowserRouter>,
    document.getElementById('root'));
});
