import mongoose from 'mongoose';
import bcrypt, { hash, genSalt } from 'bcrypt';
import autoInc from 'mongoose-sequence';
import renderMarkup from '../utils/render_markup';
import SiteConfig from './SiteConfig';
import fs from 'fs';
import path from 'path';

let autoIncPlugin = autoInc(mongoose);

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
    required: true,
    default: -1
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
  return await (async () => {
    var profileTemplate = await SiteConfig.findOne({ }, 'profileTemplate', r => r).then(({ profileTemplate }) => profileTemplate);

    let r = await renderMarkup(profileTemplate, {
      displayName: this.displayName,
      bio: this.bio,
      username: this.username,
      email: this.email,
      pictureSrc: this.pictureSrc
    });

    this.rendered = r;

    if (!fs.existsSync(path.join(process.env.DIRECTORY || __dirname, 'profiles'))) {
      fs.mkdirSync(path.join(process.env.DIRECTORY || __dirname, 'profiles'));
    }

    fs.writeFileSync(path.join(process.env.DIRECTORY || __dirname, `profiles/${this.username}.enigma`), JSON.stringify({
      rendered: this.rendered,
      metadata: {
        title: `${this.username}'s Profile`,
        image: this.pictureSrc,
        description: `Profile of ${this.username}`
      },
      username: this.username
    }));


    // proceed further only if the password is modified or the user is new
    if (!this.isModified('password')) {
      if (next && typeof next === 'function') return next();
    }

    try {
      let salt = await genSalt();
      this.password = await hash(this.password, salt);
    }
    catch(err) {
      return next(err);
    }
  }).bind(this)();
});

UserSchema.plugin(autoIncPlugin, { inc_field: 'userId', startAt: 0, incrementBy: 1 });

export default mongoose.model('User', UserSchema);
