export function returnPathKeys(path) {
  let found = path.match(/:[A-Za-z]+/g), keys = [];
  if (found) {
    for (let f of found) {
      keys.push(f.substring(1));
    }
  }

  return {
    regex: new RegExp(path.replace(/:[A-Za-z]+\//g, '(.+)\\/')
      .replace(/:[A-Za-z]+$/, '(.+)')),
    keys
  };
}

export default function matchThePath(pathname, { path, exact }) {
  if (typeof path !== 'string' && path.length) {
    return path.map(p => matchThePath(pathname, {
      path: p, exact })).find((t) => t !== null);
  }
  if (path === '*') {
    return {
      path,
      url: pathname,
      params: {}
    };
  }
  if (path === '/') {
    if (pathname === '/') {
      return {
        path: '/',
        url: pathname,
        params: {}
      };
    }
    else if (pathname.length) {
      return null;
    }
  }
  let { regex, keys } = returnPathKeys(path);

  if (!keys.length && pathname !== path && pathname !== `${path}/`) {
    return null;
  }

  if (!keys.length && (pathname === path && exact) || (pathname === `${path}/` && !exact)) {
    return {
      path,
      url: pathname,
      params: {}
    };
  }

  let params = {},
    res = pathname.match(regex);

  if (!res) { return null; }

  for (let k = 0; k < keys.length; k++) {
    params[keys[k]] = res[k + 1];
  }

  for (let param of Object.values(params)) {
    if (param.indexOf('/') >= 0) {
      return null;
    }
  }

  return {
    path,
    url: pathname,
    params
  };
}
