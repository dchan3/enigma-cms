import { Router } from 'express';
import { SiteConfig } from '../../models';
import { default as verifyMiddleware } from '../middleware';
import { writeFile } from 'fs';
import path from 'path';

var router = Router();

router.post('/update', verifyMiddleware, function({ body }, res, next) {
  SiteConfig.findOne({ }).then(async config => {
    var reset = [];
    for (var attr in body) {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          config.set(mainKey, attr.match(/\.\d+/) ? [] : {});
          reset.push(mainKey);
        }
      }
      if (attr !== 'iconFile' && attr !== 'fileContent') {
        config.set(attr, body[attr]);
      }
    }

    let { iconFile, fileContent } = body;

    if (iconFile && iconFile !== '') {
      let fn = iconFile.split('\\').pop();
      await writeFile(path.resolve(__dirname,
        `./public/site-icon/${fn}`),
      Buffer.from(fileContent, 'base64'), { flag: 'a+' },
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
