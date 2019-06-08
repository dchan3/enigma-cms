import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';
import Role from '../models/Role';
import SiteConfig from '../models/SiteConfig';
import icongen from '../utils/icongen';

var SignupStrategy = new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback: true
}, ({ body }, username, password, done) => {
  let { email } = body;
  User.findOne({}, function(erra, u) {
    User.findOne({ $or: [{ username }, { email }] },
      function(err, userWith) {
        if (err) return done(err);
        if (userWith) return done(null, false);
        else {
          icongen(username, function(pictureSrc) {
            const userData = {
              username, password, email, pictureSrc,
              displayName: '',
              roleId: u ? 1 : 0,
            };

            var newUser = new User(userData);
            newUser.save((err) => {
              if (err) { return done(err); }
              if (newUser.userId === 0) {
                var adminRole = new Role({ name: 'admin' });
                adminRole.save((error) => {
                  if (error) return done(error);
                });
                var config = new SiteConfig({});
                config.save((error) => {
                  if (error) return done(error);
                });
              }
              else if (newUser.userId === 1) {
                var userRole = new Role({ name: 'user' });
                userRole.save((error) => {
                  if (error) return done(error);
                });
              }
              return done(null, newUser);
            });
          });
        }
      }
    );
  });
});

export default SignupStrategy;
