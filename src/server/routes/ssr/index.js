import React from 'react';
import App from '../../../client/app/App';
import fetch from 'isomorphic-fetch';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { default as urlUtils } from '../../../lib/utils';

var htmlTemplate = dom => `<!DOCTYPE html>
   <html>
    <head>
    <title></title>
    <link rel="stylesheet" href="/prism.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <div id="root">${dom}</div>
      <script src="${urlUtils.info.path('/app.bundle.js')}"></script>
     </body>
</html>`, ssrRenderer = async (req, res) => {
    var config = await fetch(urlUtils.info.path('/api/site_config/get'));
    var configData = await config.json();

    var types =
      await fetch(urlUtils.info.path('/api/documents/get_types'));
    var typesData = await types.json();

    const jsx = (
        <StaticRouter location={req.url} context={{}}>
          <App user={null} config={configData} types={typesData} />
        </StaticRouter>), markup = renderToString(jsx);
    res.writeHead( 200, { 'Content-Type': 'text/html' } );
    res.end( htmlTemplate( markup ));
  };

export default ssrRenderer;
