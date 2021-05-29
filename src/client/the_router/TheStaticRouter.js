import { h } from 'preact'; /** @jsx h **/
import TheRouter from './TheRouter';
import { parsePath } from 'history';

function addSlash(path) {
  return path[0] === '/' ? path : `/${path}`;
}

function addBasename(basename, location) {
  if (!basename) return location;
  return {
    ...location,
    pathname: addSlash(basename) + location.pathname
  };
}

function makeUrl(location) {
  return typeof location === 'string' ? location : createPath(location);
}

export default function TheStaticRouter({
  basename = '', children, context = {}, location = '/' }) {
  let history = {
    createHref: (path) => addSlash(basename + makeUrl(path)),
    action: 'POP',
    location: parsePath(location),
    block: {},
    listen: () => {},
    replace: (location) => {
      context.action = 'REPLACE';
      context.location = parsePath(location);
      context.url = context.location;
    },
    go: {},
    goBack: {},
    goForward: {},
    push: (location) => {
      context.action = 'PUSH';
      context.location = addBasename(basename, parsePath(location));
      context.url = makeUrl(context.location);
    }
  };

  return <TheRouter history={history} staticContext={context || {}}>
    {children || null}</TheRouter>;
}
