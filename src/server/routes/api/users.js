import passport from 'passport';
import express from 'express';
import User from '../../models/User';

var router = express.Router();

router.get('/get', function(req, res) {
  if (req.user !== undefined) {
    res.send(JSON.stringify(req.user));
    res.status(200).end();
  }
  else res.json();
});

router.post('/register', passport.authenticate('local-signup', {
  successRedirect: (process.env.CLIENT_URL || 'http://localhost:' +
(process.env.PORT || 3000)) + '/admin',
  failureRedirect: (process.env.CLIENT_URL || 'http://localhost:' +
(process.env.PORT || 3000)) + '/signup',
}));

router.post('/login',
  passport.authenticate('local-login', {
    successRedirect: (process.env.CLIENT_URL || 'http://localhost:' +
  (process.env.PORT || 3000)) + '/admin',
    failureRedirect: (process.env.CLIENT_URL || 'http://localhost:' +
  (process.env.PORT || 3000)) + '/login?error=' +
      encodeURIComponent('An error occurred'),
    session: true
  })
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect((process.env.CLIENT_URL || 'http://localhost:' +
(process.env.PORT || 3000)));
});

router.put('/update', function(req, res) {
  User.findOne({ _id: req.user._id }).then(user => {
    for (var attr in req.params) {
      user.set(attr, req.params[attr]);
    }
    user.save(function (err) {
      if (err) res.status(500);
      else res.redirect((process.env.CLIENT_URL || 'http://localhost:' +
    (process.env.PORT || 3000)));
    });
  });
});

export default router;
