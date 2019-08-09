import React from 'react';
import App from '../../../client/app/App';
import { frontEndRoutes, backEndRoutes } from './route_data';
import { SiteConfig, DocumentType } from '../../models';
import { matchPath, StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';
import { StaticContextProvider } from '../../../client/contexts/StaticContext';

var htmlTemplate =
  (styleTags, { language, gaTrackingId },
    { title, meta, link }, dom, data) => `<!DOCTYPE html>
<html lang="${language}">
  <head>
  ${gaTrackingId ?
    `<!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${
  gaTrackingId}">
    </script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${gaTrackingId}');
    </script>` : ''}
${[
    title.toString(),meta.toString(), link.toString(), styleTags,
  ].map(str => str.length ? (`    ${str}`) : '')
    .join('\n').replace(/\n{2,}/g, '\n').replace(/\n$/, '')}
    <script>
      window.__INITIAL_DATA__ = ${serialize(data, { unsafe: true })};
    </script>
    <script src='/app.bundle.js' defer></script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" href="/style.css" />
  </head>
  <body>
    <div id="root">${dom}</div>
  </body>
</html>
`, ssrRenderer = async ({ path, url: location }, res, next) => {
    let config = await SiteConfig.findOne({}),
      types = await DocumentType.find({}), routes = path.startsWith('/admin') ?
        backEndRoutes : frontEndRoutes, context = { config, types },
      { fetchInitialData, key } =
        routes.find(route => matchPath(path, route)) || {},
      promise = fetchInitialData ? fetchInitialData(path) : Promise.resolve();
    promise.then(data => {
      if (data) context[key || 'dataObj'] = data;
      let sheet = new ServerStyleSheet(), jsx = (
          <StaticRouter {...{ location }}>
            <StaticContextProvider initialVals={context}>
              <App />
            </StaticContextProvider>,
          </StaticRouter>), markup = renderToString(sheet.collectStyles(jsx)),
        helmet = Helmet.renderStatic(), styleTags = sheet.getStyleTags();
      sheet.seal();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' } );
      res.end(htmlTemplate(styleTags, config, helmet, markup, context));
    }).catch(next)
  };

export default ssrRenderer;
