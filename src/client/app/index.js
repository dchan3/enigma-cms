import { h, hydrate } from 'preact';
import App from './App';
import { TheBrowserRouter } from '../the_router';
import { StaticContextProvider } from '../contexts/StaticContext';
import { HeadContextProvider } from '../contexts/HeadContext';
import { FromCssContextProvider } from '../contexts/FromCssContext';

/** @jsx h **/
hydrate(<FromCssContextProvider>
  <HeadContextProvider>
    <TheBrowserRouter>
      <StaticContextProvider initialVals={{ ...window.__INITIAL_DATA__ }}>
        <App />
      </StaticContextProvider>
    </TheBrowserRouter>
  </HeadContextProvider>
</FromCssContextProvider>,
document.getElementById('root'));
