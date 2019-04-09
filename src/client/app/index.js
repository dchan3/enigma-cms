import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

hydrate(
  <BrowserRouter>
    <App staticContext={window.__INITIAL_DATA__} />
  </BrowserRouter>,
  document.getElementById('root'));
