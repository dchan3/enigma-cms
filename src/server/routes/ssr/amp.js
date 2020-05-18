import { h } from 'preact'; /** @jsx h **/
import { ssrGen, renderHead, gaScript, gaUrl, staticScript } from './utils';
import fs from 'fs';
import path from 'path';

const css1 = ['-webkit-', '-moz-', '-ms-', ''],
  css2 = ['-webkit-', '-moz-', '-ms-', '-o-', ''];

var htmlTemplate =
  ({ language, gaTrackingId },
    head, dom, data, back) => {
    let { dataObj } = data, renderable = gaTrackingId && !back;
    return `<!DOCTYPE html>
<html lang="${language}" amp>
  <head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  ${renderHead(head)}
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-script" src="https://cdn.ampproject.org/v0/amp-script-0.1.js"></script>
    ${(dataObj && dataObj.createdAt) ? `<script type="application/ld+json">{
        "@context":"http://schema.org",
        "@type":"BlogPosting",
        "headline":"${dataObj.metadata.title}",
        "description":"${dataObj.metadata.description}",
        "image":"${dataObj.metadata.image}",
        "datePublished":"${dataObj.createdAt.toISOString()}",
        "inLanguage":"${language}",
        "author":"${dataObj.authorInfo.displayName}",
        "publisher":{
          "@type":"Organization",
          "name":"${dataObj.authorInfo.displayName}",
          "logo":{
            "@type":"ImageObject",
            "url":"${process.env.HOST && `https://${process.env.HOST}` || 'http://localhost:8080'}/favicon.ico"}}}
    </script>` : ''}
    <style amp-boilerplate>
      body{${css1.map(str => `${str
  }animation:-amp-start 8s steps(1, end) 0s 1 normal both;`).join('')}${
  css2.map(str => `@${str}keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`).join('')
}</style><noscript><style amp-boilerplate>body{${css1.map(str =>
  `${str}animation:none;`).join('')}}</style></noscript><style amp-custom>
      ${fs.readFileSync(path.resolve(__dirname, 'public/app.style.css'))}
      ${fs.readFileSync(path.resolve(__dirname, 'public/style.css'))}</style>
    ${renderable ?
    gaScript(gaTrackingId, 'id="gainit" type="text/plain" target="amp-script"') : ''}
    ${staticScript(data, 'id="ctx" type="text/plain" target="amp-script"')}</head><body>
    <amp-script script="gainit"></amp-script><amp-script script="ctx"></amp-script>
    <div id="root">${dom}</div>
    ${renderable ?
    `<amp-script src="${gaUrl(gaTrackingId)}"></amp-script>`
    : ''}
  </body></html>`; },
  ssrRenderer = ssrGen(htmlTemplate);

export default ssrRenderer;
