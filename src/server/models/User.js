import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';

var conn = mongoose.createConnection(
  require('../../../config/db.js').url, {}, (err) => {
    if (!err) console.log('connection succesful');
    else console.error(err);
  }
);

autoIncrement.initialize(conn);

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username required.'],
    unique: true,
    validate: {
      validator: (val) => /[a-zA-Z0-9]+/.test(val),
      message: 'Username must be alphanumeric.'
    }
  },
  password: {
    type: String
  },
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
  }
});

UserSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});

UserSchema.plugin(autoIncrementPlugin,
  { model: 'User', field: 'userId', startAt: 0, incrementBy: 1 });

export default mongoose.model('User', UserSchema);
