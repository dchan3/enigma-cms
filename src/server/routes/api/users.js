import passport from 'passport';
import express from 'express';
import User from '../../models/User';
import { default as urlUtils } from '../../utils';
import { ObjectId } from 'mongodb';

var router = express.Router();

router.get('/get', function(req, res) {
  if (req.user !== undefined) {
    res.send(JSON.stringify(req.user));
    res.status(200).end();
  }
  else res.json();
});

router.post('/register', passport.authenticate('local-signup', {
  successRedirect: urlUtils.clientInfo.path('/admin'),
  failureRedirect: urlUtils.clientInfo.path('/signup'),
}));

router.post('/login',
  passport.authenticate('local-login', {
    successRedirect: urlUtils.clientInfo.path('/admin'),
    failureRedirect: urlUtils.clientInfo.path('/login?error=' +
      encodeURIComponent('An error occurred.')),
    session: true
  })
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect(urlUtils.clientInfo.url);
});

router.post('/update', function(req, res) {
  User.findOne({ _id: ObjectId(req.body.userId) }).then(user => {
    if (user !== null) {
      if (!user.comparePassword(req.body.currentPassword)) {
        res.status(500).redirect(
          urlUtils.clientInfo.path('/admin/edit_profile?error=' +
          encodeURIComponent('Wrong password.')));
      }
      else {
        for (var attr in req.body) {
          if (!['currentPassword', 'userId'].includes(attr))
            user.set(attr, req.body[attr]);
        }
        user.save(function (err) {
          if (err) res.status(500);
          else res.redirect(urlUtils.clientInfo.url);
        });
      }
    }
    else res.status(500).
      redirect(urlUtils.clientInfo.path('/admin/edit_profile?error=' +
      encodeURIComponent('An error occurred.')));
  }).catch((err) => {
    console.log(err);
    res.status(500).
      redirect(urlUtils.clientInfo.path('/admin/edit_profile?error=' +
      encodeURIComponent('An error occurred.')));
  });
});

export default router;
