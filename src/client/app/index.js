import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { get as axget } from 'axios';
import { StaticContextProvider } from '../contexts/StaticContext';

axget('/api/users/get').then(({ data }) => data).then(user => {
  hydrate(
    <BrowserRouter>
      <StaticContextProvider initialVals={{ ...window.__INITIAL_DATA__, user }}>
        <App />
      </StaticContextProvider>
    </BrowserRouter>,
    document.getElementById('root'));
});
