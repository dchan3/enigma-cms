import React from 'react';
import App from '../../../client/app/App';
import { frontEndRoutes, backEndRoutes } from './route_data';
import SiteConfig from '../../models/SiteConfig';
import DocumentType from '../../models/DocumentType';
import { matchPath, StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';

var htmlTemplate = (stylesheet, helmetTags, dom, data) => `<!DOCTYPE html>
   <html>
    <head>
        ${helmetTags.title.toString()}
        ${helmetTags.meta.toString()}
        ${helmetTags.link.toString()}
        ${stylesheet}
    <script>
      window.__INITIAL_DATA__ = ${serialize(data, { unsafe: true })};
    </script>
    <link rel="stylesheet" href='/prism.css' />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <div id="root">${dom}</div>
      <script src='/app.bundle.js' defer></script>
     </body>
</html>`, ssrRenderer = async (req, res, next) => {
    let config = await SiteConfig.findOne({}),
      types = await DocumentType.find({}),
      path = req.path, routes = path.startsWith('/admin') ?
        backEndRoutes : frontEndRoutes, context = { config, types },
      activeRoute =
        routes.find(route => matchPath(path, route)) || {},
      promise = activeRoute.fetchInitialData
        ? activeRoute.fetchInitialData(path) : Promise.resolve();

    promise.then((data) => {
      let sheet = new ServerStyleSheet();
      if (activeRoute.key && data) context[activeRoute.key] = data;
      const jsx = (
          <StaticRouter location={req.url} context={context}>
            <App staticContext={context} />
          </StaticRouter>), markup = renderToString(sheet.collectStyles(jsx)),
        helmet = Helmet.renderStatic(), styleTags = sheet.getStyleTags();
      sheet.seal();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' } );
      res.end(htmlTemplate(styleTags, helmet, markup, context));
    }).catch(next)
  };

export default ssrRenderer;
