import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';

var LoginStrategy = new LocalStrategy({
  usernameField: 'user'
}, function(username, password, done) {
  User.findOne({ $or: [
    { username: username },
    { email: username }
  ] }, (err, user) => {
    if (err) return done(null, false);

    if (!user) {
      return done(null, false, { message: 'Incorrect username or email.' });
    }

    if (!user.comparePassword(password)) {
      var error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(null, false);
    }

    return done(null, user);
  });
})

export default LoginStrategy;
