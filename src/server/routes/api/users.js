import passport from 'passport';
import express from 'express';
import User from '../../models/User';
import { default as urlUtils } from '../../utils';

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
      encodeURIComponent('An error occurred')),
    session: true
  })
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect(urlUtils.clientInfo.url);
});

router.put('/update', function(req, res) {
  User.findOne({ _id: req.user._id }).then(user => {
    for (var attr in req.params) {
      user.set(attr, req.params[attr]);
    }
    user.save(function (err) {
      if (err) res.status(500);
      else res.redirect(urlUtils.clientInfo.url);
    });
  });
});

export default router;
