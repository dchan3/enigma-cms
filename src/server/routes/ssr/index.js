import { h } from 'preact'; /** @jsx h **/
import { ssrGen, renderHead, gaScript, gaUrl, staticScript, adSenseScript } from './utils';

var htmlTemplate =
  ({ language, gaTrackingId, themeColor, adSenseId },
    head, dom, data, back, style) => `<!DOCTYPE html>
<html lang="${language}">
  <head>
  ${adSenseId ? adSenseScript(adSenseId) : ''}
  <style data-fc>${style}</style>
${(gaTrackingId && !back) ?
    `<script async src="${gaUrl(gaTrackingId)}">
  </script>${gaScript(gaTrackingId)}` : ''}
${renderHead(head)}
${staticScript(data)}
    <script src='/preact.bundle.js' defer></script>
    <script src='/preactHooks.bundle.js' defer></script>
    <script src='/preactCompat.bundle.js' defer></script>
    <script src='/${back ? 'dashboard' : 'app'}.bundle.js' defer></script>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="theme-color" content="${themeColor}"/>
    <link rel="stylesheet" type="text/css" href="/app.style.css"/>
    <link rel="stylesheet" type="text/css" href="/style.css"/></head>
<body><div id="root">${dom}</div></body></html>`,
  ssrRenderer = ssrGen(htmlTemplate);

export default ssrRenderer;
