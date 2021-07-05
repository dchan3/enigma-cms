import { Router } from 'express';
import { SiteConfig } from '../../models';
import { default as verifyMiddleware } from '../middleware';
import { writeFile } from 'fs';
import path from 'path';
import { updateMongoDoc } from './utils';

var router = Router();

router.get('/get_config', function(req, res) {
  SiteConfig.findOne({ }).then(config => {
    if (!config) res.send('nope').end();
    return res.status(200).json(config).end();
  }).catch(() => res.send('nope'));
});

router.post('/update', verifyMiddleware, function({ body }, res, next) {
  SiteConfig.findOne({ }).then(async config => {
    let { iconFile, fileContent } = body;

    if (iconFile && iconFile !== '') {
      let fn = iconFile.split('\\').pop();
      await writeFile(path.resolve(__dirname,
        `./public/site-icon/${fn}`),
      Buffer.from(fileContent, 'base64'), { flag: 'w' },
      function(error) {
        if (error) return next(error);
        config.set('iconUrl', `/site-icon/${fn}`);
      });
    }
    updateMongoDoc(body, config, (function (err) {
      if (err) next(err);
      else res.status(200).end();
    }, { ignore: ['iconFile', 'fileContent'] }));
  });
});

export default router;
