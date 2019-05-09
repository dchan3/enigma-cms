import express from 'express';
import SiteConfig from '../../models/SiteConfig';
import { default as verifyMiddleware } from '../middleware';
import fs from 'fs';
import path from 'path';

var router = express.Router();

router.post('/update', verifyMiddleware, function(req, res, next) {
  SiteConfig.findOne({ }).then(async config => {
    var reset = [];
    for (var attr in req.body) {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          config.set(mainKey, attr.match(/\.\d+/) ? [] : {});
          reset.push(mainKey);
        }
      }
      if (attr !== 'iconFile' && attr !== 'fileContent') {
        config.set(attr, req.body[attr]);
      }
    }
    if (req.body.iconFile && req.body.iconFile !== '') {
      let fn = req.body.iconFile.split('\\').pop();
      await fs.writeFile(path.resolve(__dirname,
        `./public/site-icon/${fn}`),
      Buffer.from(req.body.fileContent, 'base64'), { flag: 'a+' },
      function(error) {
        if (error) return next(error);
        config.set('iconUrl', `/site-icon/${fn}`);
        config.save(function (err) {
          if (err) next(err);
          else res.status(200).end();
        });
      });
    }
    else await config.save(function (err) {
      if (err) next(err);
      else res.status(200).end();
    });
  });
});

export default router;
