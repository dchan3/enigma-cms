import express from 'express';
import SiteConfig from '../../models/SiteConfig';
import { default as urlUtils } from '../../utils';

var router = express.Router();

router.get('/get', function(req, res) {
  SiteConfig.findOne({ }).then(doc => {
    res.status(200).json(doc);
  });
});

router.post('/update', function(req, res) {
  SiteConfig.findOne({ }).then(config => {
    var reset = [];
    for (var attr in req.body) {
      if (attr.indexOf('.') > -1) {
        var mainKey = attr.split('.')[0];
        if (!reset.includes(mainKey)) {
          config.set(mainKey, {});
          reset.push(mainKey);
        }
      }
      config.set(attr, req.body[attr]);
    }
    config.save(function (err) {
      if (err) res.status(500);
      else res.redirect(urlUtils.clientInfo.path('/admin/'));
    });
  });
});

export default router;
