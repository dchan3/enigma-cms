import React from 'react';
import App from '../../../client/app/App';
import { frontEndRoutes, backEndRoutes, loggedOutRoutes } from
  '../../../lib/routes/route_data';
import { default as fetchers } from './fetch_data';
import { SiteConfig, DocumentType } from '../../models';
import matchThePath from  '../../../lib/utils/match_the_path';
import TheStaticRouter from '../../../client/the_router/TheStaticRouter';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';
import { StaticContextProvider } from '../../../client/contexts/StaticContext';

var htmlTemplate =
  ({ language, gaTrackingId },
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
    title.toString(),meta.toString(), link.toString()
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
        backEndRoutes : ['/login', '/signup'].includes(path) ? loggedOutRoutes :
          frontEndRoutes;
    let context = { config, types }, { path: pathMatch } =
        routes.find(route => matchThePath(path, route)) || {},
      promise = fetchers[pathMatch] ? fetchers[pathMatch](path) :
        Promise.resolve();
    promise.then(data => {
      if (data) context.dataObj = data;
      let jsx = (
          <TheStaticRouter {...{ location }}>
            <StaticContextProvider initialVals={context}>
              <App />
            </StaticContextProvider>,
          </TheStaticRouter>), markup = renderToString(jsx),
        helmet = Helmet.renderStatic();
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' } );
      res.end(htmlTemplate(config, helmet, markup, context));
    }).catch(next);
  };

export default ssrRenderer;
