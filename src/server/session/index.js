import session from 'express-session';
import { v4 as uuid } from 'uuid';
import { default as secret } from '../../../config/secret';
import MongoSesh from 'connect-mongodb-session';

var MongoStore = MongoSesh(session);

var store = new MongoStore({
  uri: require('../../../config/db.js').url,
  collection: 'sessions'
});

export default session({
  genid: () => uuid(),
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  store
});
