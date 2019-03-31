import express from 'express';
import passport from 'passport';
import User from './models/User';
import { default as SignupStrategy } from './passport/signup';
import { default as LoginStrategy } from './passport/login';
import mongoose from 'mongoose';
import { default as userRoutes } from './routes/api/users';
import { default as configRoutes } from './routes/api/site_config';
import { default as documentRoutes } from './routes/api/documents';
import bodyParser from 'body-parser';
import { default as expressSession } from './session';
import { default as urlUtils } from './utils';

mongoose.Promise = global.Promise;

var app = express(), port = process.env.SERVER_PORT || 8080;

mongoose.connect(require('../../config/db.js').url, {}, (err) => {
  if (!err) console.log('connection successful');
  else console.error(err);
});

app.use(expressSession);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', urlUtils.clientInfo.url);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.username);
});
passport.deserializeUser((username, done) => {
  User.findOne({ username: username }, function(err, user) {
    done(err, user);
  });
});

passport.use('local-signup', SignupStrategy);

passport.use('local-login', LoginStrategy);

app.use('/api/users', userRoutes);
app.use('/api/site_config', configRoutes);
app.use('/api/documents', documentRoutes);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
