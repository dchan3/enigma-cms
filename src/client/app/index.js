import { h, hydrate } from 'preact';
import App from './App';
import { TheBrowserRouter } from '../the_router';
import { StaticContextProvider } from '../contexts/StaticContext';
import { HeadContextProvider } from '../contexts/HeadContext';

/** @jsx h **/
hydrate(<HeadContextProvider>
    <TheBrowserRouter>
      <StaticContextProvider initialVals={{ ...window.__INITIAL_DATA__ }}>
        <App />
      </StaticContextProvider>
    </TheBrowserRouter>
  </HeadContextProvider>,
document.getElementById('root'));
