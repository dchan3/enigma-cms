import express from 'express';
import SiteConfig from '../../models/SiteConfig';
import { default as verifyMiddleware } from '../middleware';

var router = express.Router();
router.use(verifyMiddleware);

// GET Requests
router.get('/get', function(req, res) {
  SiteConfig.findOne({ }).then(doc => {
    res.status(200).json(doc);
  });
});

// POST Requests
router.post('/update', verifyMiddleware, function(req, res, next) {
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
      if (err) next(err);
      else res.status(200).end();
    });
  });
});

export default router;
