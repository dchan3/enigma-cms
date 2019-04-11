import session from 'express-session';
import uuid from 'uuid/v4';
import { default as secret } from '../../../config/secret';

export default session({
  genid: () => {
    return uuid();
  },
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
});
