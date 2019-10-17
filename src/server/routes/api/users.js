import passport from 'passport';
import { Router } from 'express';
import { User } from '../../models';
import { ObjectId } from 'mongodb';
import icongen from '../../utils/icongen';
import { default as verifyMiddleware } from '../middleware';
import { writeFileSync } from 'fs';
import path from 'path';
import { findTheOne } from './utils';
import { default as userFetchFuncs } from '../fetch_funcs/users';

let router = Router();

// GET Requests
router.get('/get', ({ user }, res)  => {
  if (user !== undefined) {
    res.send(JSON.stringify(user)).status(200).end();
  }
  else res.send(JSON.stringify(null)).end();
});

router.get('/get_all_users', async function(req, res) {
  return res.status(200).json(await userFetchFuncs.getAllUsers());
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/get_user_by_username/:username',
  findTheOne(User, { username: 'username' }));

router.get('/get_user_profile/:username',
  async function({ params: { username } },
    res) {
    return res.status(200).json(await userFetchFuncs.getUserProfile({
      username }));
  });

// POST Requests
router.post('/register', verifyMiddleware, function(req, res, next) {
  passport.authenticate('local-signup',  function(err, user) {
    if (err) return next(err);
    if (!user) return next({ error: 'Invalid Credentials.' });
    req.logIn(user, function(er) {
      if (er) { return next(er); }
      return res.status(200).end();
    });
  })(req, res, next);
});

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

router.post('/change_password', verifyMiddleware,
  function({ body: { userId, currentPassword, newPassword } }, res, next) {
    User.findOne({ _id: ObjectId(userId) }).then(user => {
      if (!user.comparePassword(currentPassword)) {
        return next({ error: 'Wrong password.' });
      }
      else {
        user.set('password', newPassword);
        user.save(function (err) {
          if (err) return next({ error: err.message });
          else return res.status(200).end();
        });
      }
    })
  });

router.post('/update', verifyMiddleware,  function({ body }, res, next) {
  var { userId, username, currentPassword, profilePhoto, fileContent } = body;
  User.findOne({ userId }).then(async user => {
    if (user !== null) {
      if (!user.comparePassword(currentPassword)) {
        return next({ error: 'Wrong password.' });
      }
      else {
        for (let attr in body) {
          if (!['currentPassword', 'userId',
            'profilePhoto', 'fileContent'].includes(attr))
            user.set(attr, body[attr]);
        }

        if (profilePhoto && fileContent) {
          let fmt = profilePhoto.split('.').pop(), filepath = path.resolve(
            __dirname, `./public/profile-pix/${username}.${fmt}`);
          writeFileSync(filepath, Buffer.from(fileContent, 'base64'),
            { flag: 'a+' });
          user.set('pictureSrc', `/profile-pix/${username}.${fmt}`);
        }
        else if (user.get('pictureSrc') === undefined ||
            user.get('pictureSrc') === null || user.get('pictureSrc') === '' ||
            user.get('pictureSrc').startsWith('data:image/png;base64,')) {
          let icon = await icongen(user.username);
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
