import React from 'react';
import App from '../../../client/app/App';
import fs from 'fs';
import path from 'path';
import { frontEndRoutes, backEndRoutes, loggedOutRoutes } from
  '../../../lib/routes/route_data';
import { default as fetchers } from './fetch_data';
import { SiteConfig, DocumentType, SiteTheme } from '../../models';
import matchThePath from  '../../../lib/utils/match_the_path';
import TheStaticRouter from '../../../client/the_router/TheStaticRouter';
import { renderToString } from 'react-dom/server';
import { HeadContextProvider } from '../../../client/contexts/HeadContext';
import serialize from 'serialize-javascript';
import { StaticContextProvider } from '../../../client/contexts/StaticContext';

var htmlTemplate =
  ({ language, gaTrackingId },
    { title, meta, link }, dom, data) => `<!DOCTYPE html>
<html lang="${language}" amp>
  <head>
  <meta charset="utf-8" />
  ${gaTrackingId ?
    `<!-- Global site tag (gtag.js) - Google Analytics -->
  <amp-script async src="https://www.googletagmanager.com/gtag/js?id=${
  gaTrackingId}">
  </amp-script>
  <amp-script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${gaTrackingId}');
  </amp-script>` : ''}
${[
    title, meta, link
  ].map(str => str.length ? (`    ${str}`) : '')
    .join('\n').replace(/\n{2,}/g, '\n').replace(/\n$/, '')}
    <amp-script>
      window.__INITIAL_DATA__ = ${serialize(data, { unsafe: true })};
    </amp-script>
    ${data.dataObj.createdAt ? `<script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "BlogPosting",
        "headline": "${data.dataObj.metadata.title}",
        "description": "${data.dataObj.metadata.description}",
        "image": "${data.dataObj.metadata.image}",
        "datePublished": "${data.dataObj.createdAt.toISOString()}",
        "inLanguage": "${language}"
      }
    </script>` : ''}
    <style amp-boilerplate>
      body {
        -webkit-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
        -moz-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
        -ms-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
        animation: -amp-start 8s steps(1, end) 0s 1 normal both;
      }
      @-webkit-keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
      @-moz-keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
      @-ms-keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
      @-o-keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
      @keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
    </style>
    <noscript><style amp-boilerplate>
        body {
          -webkit-animation: none;
          -moz-animation: none;
          -ms-animation: none;
          animation: none;
        }
      </style></noscript>
    <style amp-custom>
      ${fs.readFileSync(path.resolve(__dirname, 'assets/app.style.css'))}
    </style>
    <script async src="https://cdn.ampproject.org/v0.js"></script
    <amp-script src='/app.bundle.js' defer></script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <div id="root">${dom}</div>
  </body>
</html>
`, ssrRenderer = async ({ path, url: location }, res, next) => {
    let config = await SiteConfig.findOne({}),
      theme = await SiteTheme.findOne({}),
      types = await DocumentType.find({}), routes = path.startsWith('/admin') ?
        backEndRoutes : ['/login', '/signup'].includes(path) ? loggedOutRoutes :
          frontEndRoutes;
    let context = { config, types, theme }, { path: pathMatch } =
        routes.find(route => matchThePath(path, route)) || {},
      promise = fetchers[pathMatch] ? fetchers[pathMatch](path) :
        Promise.resolve();
    promise.then(data => {
      if (data) context.dataObj = data;
      let value = {}, title = `<title>${config.siteName}</title>`, meta = '';

      let makeMeta = (type, attr, content) => `<meta ${type}="${attr}" content="${content}" />`;

      if (data && data.metadata) {
        title = `<title>${data.metadata.title}</title>`;

        meta = makeMeta('name', 'description', data.metadata.description) +
          makeMeta('name', 'keywords', data.metadata.keywords) +
          makeMeta('property', 'og:title', data.metadata.title) +
          makeMeta('name', 'twitter:title', data.metadata.title) +
        makeMeta('property', 'og:description', data.metadata.description) +
        makeMeta('name', 'twitter:description', data.metadata.description) +
        (data.metadata.image && (makeMeta('property', 'og:image', data.metadata.image) +
      makeMeta('name', 'twitter:image', data.metadata.image)) || '');

        value = {
          title: data.metadata.title,
          description: data.metadata.description,
          image: data.metadata.image || config.iconUrl || ''
        };
      }
      else {
        title = `<title>${config.siteName}</title>`;

        meta = makeMeta('name', 'description', config.description) +
          makeMeta('name', 'keywords', config.keywords) +
          makeMeta('name', 'news_keywords', config.keywords) +
          makeMeta('property', 'og:title', config.siteName) +
          makeMeta('name', 'twitter:title', config.siteName) +
        makeMeta('property', 'og:description', config.description) +
        makeMeta('name', 'twitter:description', config.description) +
        (config.iconUrl && (makeMeta('property', 'og:image', config.iconUrl) +
      makeMeta('name', 'twitter:image', config.iconUrl)) || '');

        value = {
          title: config.siteName,
          description: config.description,
          image: config.iconUrl || ''
        };
      }

      let jsx = (<HeadContextProvider value={value}>
        <TheStaticRouter {...{ location }}>
          <StaticContextProvider initialVals={context}>
            <App />
          </StaticContextProvider>
        </TheStaticRouter>
      </HeadContextProvider>);
      let markup = renderToString(jsx);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' } );
      res.end(htmlTemplate(config, { title, meta, link: `<link rel="canonical" href="${location}" />` }, markup, context));
    }).catch(next);
  };

export default ssrRenderer;
