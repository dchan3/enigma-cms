import express from 'express';
import SiteConfig from '../../models/SiteConfig';
import { default as verifyMiddleware } from '../middleware';

var router = express.Router();

router.post('/update', verifyMiddleware, function(req, res, next) {
  SiteConfig.findOne({ }).then(config => {
    var reset = [];
    for (var attr in req.body) {
      console.log(attr);
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          config.set(mainKey, attr.match(/\.\d+/) ? [] : {});
          reset.push(mainKey);
        }
      }
      config.set(attr, req.body[attr]);
    }
    config.save(function (err) {
      if (err) next(err);
      else res.status(200).end();
    });
  });
});

export default router;
