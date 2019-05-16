import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { get as axget } from 'axios';

axget('/api/users/get').then(response => response.data).then(user => {
  hydrate(
    <BrowserRouter>
      <App staticContext={{ ...window.__INITIAL_DATA__, user: user }} />
    </BrowserRouter>,
    document.getElementById('root'));
});
