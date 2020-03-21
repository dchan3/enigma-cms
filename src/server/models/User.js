import mongoose from 'mongoose';
import bcrypt, { hash, genSalt } from 'bcrypt';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';
import renderMarkup from '../utils/render_markup';
import SiteConfig from './SiteConfig';
import fs from 'fs';
import path from 'path';

var conn = mongoose.createConnection(
  require('../../../config/db.js').url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => { });

autoIncrement.initialize(conn);

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username required.'],
    unique: true,
    validate: {
      validator: val => /[a-zA-Z0-9]+/.test(val),
      message: 'Username must be alphanumeric.'
    }
  },
  pictureSrc: {
    type: String,
    required: false,
    default: ''
  },
  password: { type: String },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    validate: {
      validator: val => /[a-zA-Z0-9_.-]+@([a-z0-9-]+.)+[a-z]/.test(val),
      message: 'Invalid email.'
    },
  },
  displayName: {
    type: String,
    default: ''
  },
  roleId: {
    type: Number,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  rendered: {
    type: String
  }
});

UserSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', async function saveHook(next) {
  const user = this;

  var profileTemplate = await SiteConfig.findOne({ }, 'profileTemplate', r => r).then(({ profileTemplate }) => profileTemplate);

  user.rendered = await renderMarkup(profileTemplate, user);

  fs.writeFileSync(path.join(__dirname, `profiles/${user.username}.enigma`), JSON.stringify({
    rendered: user.rendered,
    metadata: {
      title: `${user.username}'s Profile`,
      image: user.pictureSrc,
      description: `Profile of ${user.username}`
    }
  }));


  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) {
    if (next && typeof next === 'function') return next();
  }

  return genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      if (next && typeof next === 'function') return next();
      return;
    });
  });
});

UserSchema.plugin(autoIncrementPlugin,
  { model: 'User', field: 'userId', startAt: 0, incrementBy: 1 });

export default mongoose.model('User', UserSchema);
