import { Router } from 'express';
import { SiteTheme } from '../../models';
import { default as verifyMiddleware } from '../middleware';

var router = Router();

router.post('/update', verifyMiddleware, function({ body }, res, next) {
  SiteTheme.findOne({ }).then(async config => {
    var reset = [];
    for (var attr in body) {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          config.set(mainKey, attr.match(/\.\d+/) ? [] : {});
          reset.push(mainKey);
        }
      }
    }

    await config.save(function (err) {
      if (err) next(err);
      else res.status(200).end();
    });
  });
});

export default router;
