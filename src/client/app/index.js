import { h, hydrate } from 'preact';
import App from './App';
import { TheBrowserRouter } from '../the_router';
import { StaticContextProvider } from '../contexts/StaticContext';
import { HeadContextProvider } from '../contexts/HeadContext';

let value = null;
if (window.__INITIAL_DATA__.dataObj) {
  value = window.__INITIAL_DATA__.dataObj.metadata;  
}

/** @jsx h **/
hydrate(<HeadContextProvider value={value}>
  <TheBrowserRouter>
    <StaticContextProvider initialVals={{ ...window.__INITIAL_DATA__ }}>
      <App />
    </StaticContextProvider>
  </TheBrowserRouter>
</HeadContextProvider>,
document.getElementById('root'));
