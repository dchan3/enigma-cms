import { h } from 'preact'; /** @jsx h **/
import { ssrGen, renderHead, gaScript, gaUrl, staticScript } from './utils';

var htmlTemplate =
  ({ language, gaTrackingId },
    head, dom, data, back) => `<!DOCTYPE html>
<html lang="${language}"><head>
${(gaTrackingId && !back) ?
    `<script async src="${gaUrl(gaTrackingId)}">
  </script>${gaScript(gaTrackingId)}` : ''}
${renderHead(head)}
${staticScript(data)}
    <script src='/${back ? 'dashboard' : 'app'}.bundle.js' defer></script>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="stylesheet" type="text/css" href="/app.style.css"/>
    <link rel="stylesheet" type="text/css" href="/style.css"/></head>
<body><div id="root">${dom}</div></body></html>`,
  ssrRenderer = ssrGen(htmlTemplate);

export default ssrRenderer;
