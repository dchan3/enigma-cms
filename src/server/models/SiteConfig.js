import mongoose from 'mongoose';
import ShortcodeSchema from './ShortcodeSchema';
import User from './User';

let { Schema, model } = mongoose;

const SiteConfigSchema = new Schema({
  siteName: {
    type: String,
    required: [true, 'Site name required.'],
    default: 'My Website'
  },
  description: {
    type: String,
    required: [true, 'Description required.'],
    default: 'Welcome to my Website!'
  },
  aboutBody: {
    type: String,
    required: [true, 'About text required.'],
    default: 'Welcome to my Website!'
  },
  iconUrl: {
    type: String,
    required: false
  },
  profileTemplate: {
    type: String,
    required: false,
    default: '<div><h1>{{displayName}}</h1><p>@{{username}}</p></div>'
  },
  stylesheet: {
    type: String,
    required: false
  },
  menuLinks: {
    type: Array,
    required: false,
    default: [{
      linkText: 'Login',
      linkUrl: '/login'
    },
    {
      linkText: 'Register',
      linkUrl: '/signup'
    }]
  },
  useSlug: {
    type: Boolean,
    required: false,
    default: false
  },
  shortcodes: {
    type: [ShortcodeSchema],
    required: false
  },
  keywords: {
    type: [String],
    required: false
  },
  gaTrackingId: {
    type: String,
    required: false
  },
  language: {
    type: String,
    enum: ['en', 'zh'],
    default: 'en'
  }
});

SiteConfigSchema.post('save', function() {
  User.find({ }).then(users => {
    users.forEach(user => { user.save(); });
  });
});

export default model('SiteConfig', SiteConfigSchema);
