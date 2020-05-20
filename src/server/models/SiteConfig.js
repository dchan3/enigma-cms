import mongoose from 'mongoose';
import ShortcodeSchema from './ShortcodeSchema';
import User from './User';
import fs from 'fs';
import path from 'path';

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
    required: false,
    default: ''
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
  },
  themeColor: {
    type: String,
    default: 'cadetblue'
  }
});

SiteConfigSchema.post('save', function() {
  User.find({ }).then(users => {
    users.forEach(user => { user.save(); });
  });

  var {
    siteName, description, aboutBody, gaTrackingId, language,
    keywords, iconUrl, profileTemplate, menuLinks, stylesheet,
    shortcodes, themeColor
  } = this;

  if (!fs.existsSync(path.join(process.env.DIRECTORY || __dirname, 'site-files'))) {
    fs.mkdirSync(path.join(process.env.DIRECTORY || __dirname, 'site-files'));
  }

  fs.writeFileSync(path.join(process.env.DIRECTORY || __dirname, 'site-files/config.enigma'), JSON.stringify({
    siteName, description, aboutBody, gaTrackingId, language,
    keywords, iconUrl, profileTemplate, menuLinks, themeColor,
    stylesheet
  }));

  if (!fs.existsSync(path.join(process.env.DIRECTORY || __dirname, 'public'))) {
    fs.mkdirSync(path.join(process.env.DIRECTORY || __dirname, 'public'));
  }

  fs.writeFileSync(path.join(process.env.DIRECTORY || __dirname, 'public/style.css'), stylesheet);

  let shortcodeData = '{\n';

  shortcodeData += shortcodes.map(({ name, args, code }) => {
    if (name.length && code.length) {
      return `${name}: new Function(${ args.map(arg => `"${arg}"`).join(', ')}, "${code}")`
    }
    else return null;
  }).filter(i => i || false).join(',\n');

  shortcodeData += '};\n';

  fs.writeFileSync(path.join(process.env.DIRECTORY || __dirname, 'site-files/shortcodes.js'), shortcodeData);
});

export default model('SiteConfig', SiteConfigSchema);
