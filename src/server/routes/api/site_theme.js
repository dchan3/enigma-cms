import { Router } from 'express';
import { SiteTheme } from '../../models';
import { default as verifyMiddleware } from '../middleware';

var router = Router();

router.post('/update', verifyMiddleware, function({ body }, res, next) {
  SiteTheme.findOne({ }).then(async theme => {
    var reset = [];
    for (var attr in body) {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          theme.set(mainKey, attr.match(/\.\d+/) ? [] : {});
          reset.push(mainKey);
        }
      }
      theme.set(attr, body[attr]);
    }

    await theme.save(function (err) {
      if (err) next(err);
      else res.status(200).end();
    });
  });
});

export default router;
