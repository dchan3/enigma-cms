import { h } from 'preact'; /** @jsx h **/
import renderToString from 'preact-render-to-string';
import App from '../../../client/app/App';
import Dashboard from '../../../client/dashboard/Dashboard';
import frontEndRoutes from '../../../lib/routes/front_routes';
import backEndRoutes from '../../../lib/routes/route_data';
import { default as fetchers } from './fetch_data';
import { SiteConfig, DocumentType, SiteTheme } from '../../models';
import matchThePath from  '../../../lib/utils/match_the_path';
import TheStaticRouter from '../../../client/the_router/TheStaticRouter';
import { HeadContextProvider } from '../../../client/contexts/HeadContext';
import serialize from 'serialize-javascript';
import { StaticContextProvider } from '../../../client/contexts/StaticContext';

var htmlTemplate =
  ({ language, gaTrackingId },
    { title, meta, link }, dom, data, back) => `<!DOCTYPE html>
<html lang="${language}">
  <head>
  ${(gaTrackingId && !back) ?
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
    title, meta, link
  ].map(str => str.length ? (`${str}`) : '')
    .join('\n').replace(/\n{2,}/g, '\n').replace(/\n$/, '')}
    <script>
      window.__INITIAL_DATA__ = ${serialize(data, { unsafe: true })};
    </script>
    <script src='/${back ? 'dashboard' : 'app'}.bundle.js' defer></script>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" href="/app.style.css" />
    <link rel="stylesheet" type="text/css" href="/style.css" />
  </head>
  <body>
    <div id="root">${dom}</div>
  </body>
</html>
`, ssrRenderer = async ({ path, url: location, user }, res, next) => {
    let config = await SiteConfig.findOne({}),
      theme = await SiteTheme.findOne({}),
      types = await DocumentType.find({}), routes = (path.startsWith('/admin') || ['/login', '/signup'].includes(path)) ?
        backEndRoutes :  frontEndRoutes, Comp = (path.startsWith('/admin') || ['/login', '/signup'].includes(path)) ?
        Dashboard : App;
    let context = { config, types, theme }, foundRoutes =
      routes.find(route => matchThePath(path, route));
    let pathMatch = foundRoutes && (typeof foundRoutes.path === 'string' ? foundRoutes.path :
        foundRoutes.path[0]) || '',
      promise = (pathMatch.length && fetchers[pathMatch]) ? fetchers[pathMatch](path) :
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
        <TheStaticRouter location={location}>
          <StaticContextProvider initialVals={{ ...context, user }}>
            <Comp />
          </StaticContextProvider>
        </TheStaticRouter>
      </HeadContextProvider>);
      let markup = renderToString(jsx);

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' } );
      res.end(htmlTemplate(config, { title, meta, link: `<link rel="canonical" href="${location}" />` }, markup, context,
        path.startsWith('/admin') || ['/login', '/signup'].includes(path)));
    }).catch(next);
  };

export default ssrRenderer;
