import { Router } from 'express';
import { SiteTheme } from '../../models';
import { default as verifyMiddleware } from '../middleware';
import { updateMongoDoc } from './utils';

var router = Router();

router.post('/update', verifyMiddleware, function({ body }, res, next) {
  SiteTheme.findOne({ }).then(async theme => {
    updateMongoDoc(body, theme, function (err) {
      if (err) next(err);
      else res.status(200).end();
    });
  });
});

export default router;
