import passport from 'passport';
import express from 'express';
import User from '../../models/User';
import { ObjectId } from 'mongodb';
import icongen from '../../utils/icongen';
import { default as verifyMiddleware } from '../middleware';
import fs from 'fs';
import path from 'path';

var router = express.Router();

// GET Requests
router.get('/get', (req, res)  => {
  if (req.user !== undefined) {
    res.send(JSON.stringify(req.user)).status(200).end();
  }
  else res.send(JSON.stringify(null)).end();
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// POST Requests
router.post('/register', verifyMiddleware,
  passport.authenticate('local-signup', {
    successRedirect: '/admin',
    failureRedirect: '/signup',
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

router.post('/update', verifyMiddleware,  function(req, res, next) {
  User.findOne({ _id: ObjectId(req.body.userId) }).then(async user => {
    if (user !== null) {
      if (!user.comparePassword(req.body.currentPassword)) {
        return next({ error: 'Wrong password.' });
      }
      else {
        for (let attr in req.body) {
          if (!['currentPassword', 'userId',
            'profilePhoto', 'fileContent'].includes(attr))
            user.set(attr, req.body[attr]);
        }

        if (req.body.profilePhoto && req.body.fileContent) {
          let fmt = req.body.profilePhoto.split('.').pop(),
            filepath = path.resolve(__dirname,
              `./public/profile-pix/${req.body.username}.${fmt}`);
          fs.writeFileSync(
            filepath,
            Buffer.from(req.body.fileContent, 'base64'), { flag: 'a+' });
          user.set('pictureSrc', `/profile-pix/${req.body.username}.${fmt}`);
        }
        else if (user.get('pictureSrc') === undefined ||
            user.get('pictureSrc') === null || user.get('pictureSrc') === '' ||
            user.get('pictureSrc').startsWith('data:image/png;base64,')) {
          var icon = await icongen(user.username);
          user.set('pictureSrc', icon);
        }
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
