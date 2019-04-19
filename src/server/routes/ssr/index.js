import React from 'react';
import App from '../../../client/app/App';
import { frontEndRoutes, backEndRoutes } from '../../../client/routes';
import fetch from 'isomorphic-fetch';
import { StaticRouter, matchPath, Router, Route } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { default as urlUtils } from '../../../lib/utils';
import serialize from 'serialize-javascript';
import { createMemoryHistory } from 'history';

var history = createMemoryHistory(),
  htmlTemplate = (dom, data) => `<!DOCTYPE html>
   <html>
    <head>
    <title></title>
    <script>
      window.__INITIAL_DATA__ = ${serialize(data, { unsafe: true })};
    </script>
    <link rel="stylesheet" href="${urlUtils.info.path('/prism.css')}" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <div id="root">${dom}</div>
      <script src="${urlUtils.info.path('/app.bundle.js')}" defer></script>
     </body>
</html>`, ssrRenderer = async (req, res, next) => {
    var config = await fetch(urlUtils.info.path('/api/site_config/get'));
    var configData = await config.json();

    var types =
      await fetch(urlUtils.info.path('/api/documents/get_types'));
    var typesData = await types.json();

    var path = req.path, routes = path.startsWith('/admin') ?
      backEndRoutes : frontEndRoutes;

    const activeRoute =
      routes.find(route => matchPath(path, route)) || {};

    const promise = activeRoute.fetchInitialData
      ? activeRoute.fetchInitialData(path).then(d => d.json())
      : Promise.resolve();

    var context = {
      config: configData,
      types: typesData
    };

    promise.then((data) => {
      if (activeRoute.key && data) context[activeRoute.key] = data;
      const jsx = (
          <Router history={history}>
            <App staticContext={context} />
          </Router>), markup = renderToString(jsx);
      res.writeHead(200, { 'Content-Type': 'text/html' } );
      res.end(htmlTemplate(markup, context));
    }).catch(next)
  };

export default ssrRenderer;
