import { h } from 'preact'; /** @jsx h **/
import renderToString from 'preact-render-to-string';
import TheStaticRouter from '../../../client/the_router/TheStaticRouter';
import { HeadContextProvider } from '../../../client/contexts/HeadContext';
import { StaticContextProvider } from '../../../client/contexts/StaticContext';
import { default as fetchers } from './fetch_data';
import { DocumentType } from '../../models';
import matchThePath from  '../../../lib/utils/match_the_path';
import App from '../../../client/app/App';
import Dashboard from '../../../client/dashboard/Dashboard';
import frontEndRoutes from '../../../lib/routes/front_routes';
import backEndRoutes from '../../../lib/routes/route_data';
import serialize from 'serialize-javascript';
import fs from 'fs';
import path from 'path';

function makeMeta(type, attr, content) {
  return `<meta ${type}="${attr}" content="${content}"/>`;
}

export function generateMeta(d) {
  let { title, keywords, description, image, iconUrl, siteName } = d, img = image || iconUrl || '';
  return {
    meta: makeMeta('name', 'description', description) +
        makeMeta('name', 'keywords', keywords) +
        makeMeta('property', 'og:title', title) +
        makeMeta('name', 'twitter:title', title) +
      makeMeta('property', 'og:description', description) +
      makeMeta('name', 'twitter:description', description) +
      (img.length && (makeMeta('property', 'og:image', img) +
    makeMeta('name', 'twitter:image', img)) || ''),
    value: {
      title,
      description,
      image: img
    },
    headTitle: `<title>${title || siteName}</title>`
  };
}

function GenerateStaticJsx({ value, location, initialVals, component: Comp }) {
  return <HeadContextProvider {...{ value }}>
    <TheStaticRouter {...{ location }}>
      <StaticContextProvider {... { initialVals }}>
        <Comp/>
      </StaticContextProvider>
    </TheStaticRouter>
  </HeadContextProvider>;
}

export function renderString(props) {
  return renderToString(<GenerateStaticJsx {...props} />);
}

export function ssrGen(htmlTemplate) {
  return async function ssrRenderer({ path: p, url: location, user }, res, next) {
    let isDash = p.startsWith('/admin') || ['/login', '/signup'].includes(p);
    let config = JSON.parse(fs.readFileSync(path.join(__dirname, 'site-files/config.enigma'))), routes = isDash ?
        backEndRoutes :  frontEndRoutes, component = isDash ? Dashboard : App;
    let context = isDash ? { config, types: await DocumentType.find({}) } : { config }, foundRoutes =
      routes.find(route => matchThePath(p.replace('?amp=true', ''), route));
    let pathMatch = foundRoutes && (typeof foundRoutes.path === 'string' ? foundRoutes.path :
        foundRoutes.path[0]) || '',
      promise = (pathMatch.length && fetchers[pathMatch]) ? fetchers[pathMatch](p.replace('?amp=true', '')) :
        Promise.resolve();
    promise.then(data => {
      if (data) context.dataObj = data;
      let { meta, value, headTitle } = generateMeta(data && data.metadata || config);
      let markup = renderString({ value, location, initialVals: { ...context, user }, component });

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' } );
      res.end(htmlTemplate(config, { title: headTitle, meta, link: `<link rel="canonical" href="${`${location}?amp=true`}" />` }, markup, context, isDash));
    }).catch(next);
  };
}

export function renderHead({ title, meta, link }) {
  return [title, meta, link].map(str => (str && str.length) ? (`${str}`) : '')
    .join('\n').replace(/\n{2,}/g, '\n').replace(/\n$/, '');
}

export function gaScript(gaTrackingId, attrs) {
  return `<script${attrs ? (` ${attrs}`) : ''}>
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments);}
    gtag('js',new Date());
    gtag('config','${gaTrackingId}');
  </script>`;
}

export function staticScript(data, attrs) {
  return `<script${attrs ? (` ${attrs}`) : ''}>
    window.__INITIAL_DATA__=${serialize(data, { unsafe: true })};
  </script>`;
}

export function gaUrl(gaTrackingId) {
  return `https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`;
}
