import passport from 'passport';
import express from 'express';
import User from '../../models/User';
import { default as urlUtils } from '../../../lib/utils';
import { ObjectId } from 'mongodb';
import icongen from '../../utils/icongen';
import { default as verifyMiddleware } from '../middleware';

var router = express.Router();

// GET Requests
router.get('/get', (req, res)  => {
  if (req.user !== undefined) {
    res.send(JSON.stringify(req.user));
    res.status(200).end();
  }
  else res.send(JSON.stringify(null)).status(200).end();
});

router.get('/generate_icon/:username', function(req, res) {
  icongen(req.params.username, function(result) {
    res.send(result);
  });
});

router.get('/get_user_by_username/:username', function(req, res) {
  User.findOne({ username: req.params.username }).then(user => {
    res.json(user);
  }).catch(() => {
    res.status(500);
  });
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect(urlUtils.info.url);
});

// POST Requests
router.post('/register', verifyMiddleware,
  passport.authenticate('local-signup', {
    successRedirect: urlUtils.info.path('/admin'),
    failureRedirect: urlUtils.info.path('/signup'),
  }));

router.post('/login', verifyMiddleware, function(req, res, next) {
  passport.authenticate('local-login', function(err, user) {
    if (err) return next(err);
    if (!user) return next({ error: 'Invalid Credentials.' });
    req.logIn(user, function(er) {
      if (er) { return next(er); }
      return res.status(200).end();
    });
  })(req, res, next);
});

router.post('/change_password', verifyMiddleware, function(req, res, next) {
  User.findOne({ _id: ObjectId(req.body.userId) }).then(user => {
    if (!user.comparePassword(req.body.currentPassword)) {
      return next({ error: 'Wrong password.' });
    }
    else {
      user.set('password', req.body.newPassword);
      user.save(function (err) {
        if (err) return next({ error: err.message });
        else return res.status(200).end();
      });
    }
  })
});

router.post('/update', verifyMiddleware, function(req, res, next) {
  User.findOne({ _id: ObjectId(req.body.userId) }).then(user => {
    if (user !== null) {
      if (!user.comparePassword(req.body.currentPassword)) {
        return next({ error: 'Wrong password.' });
      }
      else {
        for (var attr in req.body) {
          if (!['currentPassword', 'userId'].includes(attr))
            user.set(attr, req.body[attr]);
        }
        if (user.get('pictureSrc') === undefined ||
            user.get('pictureSrc') === null || user.get('pictureSrc') === '') {
          icongen(user.username, function(result) {
            user.set('pictureSrc', result);
            user.save(function (err) {
              if (err) return next({ error: err.message });
              else return res.status(200).end();
            });
          });
        }
        else
          user.save(function (err) {
            if (err) return next({ error: err.message });
            else return res.status(200).end();
          });
      }
    }
    else res.status(500);
  }).catch((err) => {
    return next(err);
  });
});

export default router;
