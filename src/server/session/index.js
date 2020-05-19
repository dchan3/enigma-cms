import session from 'express-session';
import { v4 as uuid } from 'uuid';
import { default as secret } from '../../../config/secret';

export default session({
  genid: () => uuid(),
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
});
