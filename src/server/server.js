import express from 'express';
import passport from 'passport';
import { User, SiteConfig, Document, DocumentType, SiteTheme } from './models';
import { default as SignupStrategy } from './passport/signup';
import { default as LoginStrategy } from './passport/login';
import mongoose from 'mongoose';
import {
  userRoutes, configRoutes, documentRoutes, fileRoutes, searchRoutes,
  sitemapRoutes, themeRoutes
} from './routes/api';
import { default as expressSession } from './session';
import { default as ssrRoutes } from './routes/ssr';
import { default as ampRoutes } from './routes/ssr/amp';
import { createProxyServer } from 'http-proxy';
import path from 'path';
import fs from 'fs';

mongoose.Promise = global.Promise;

var app = express(), port = process.env.SERVER_PORT || 8080,
  apiProxy = createProxyServer();

mongoose.connect(require('../../config/db.js').url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  SiteConfig.findOne({}).then(config => {
    if (!fs.existsSync(path.join(process.env.DIRECTORY || __dirname, 'site-files'))) {
      fs.mkdirSync(path.join(process.env.DIRECTORY || __dirname, 'site-files'));
    }

    if (!config) {
      let newConfig = new SiteConfig({});
      newConfig.save();
    }
    else config.save();
  });

  SiteTheme.findOne({}).then(theme => {
    if (!theme) {
      let newTheme = new SiteTheme({});
      newTheme.save();
    }
    else return;
  });

  if (!fs.existsSync(path.join(process.env.DIRECTORY || __dirname, 'documents'))) {
    fs.mkdirSync(path.join(process.env.DIRECTORY || __dirname, 'documents'));
  }

  if (!fs.existsSync(path.join(process.env.DIRECTORY || __dirname, 'profiles'))) {
    fs.mkdirSync(path.join(process.env.DIRECTORY || __dirname, 'profiles'));
  }

  User.find().then(users => {
    users.forEach(u => { u.save(); });
  });

  DocumentType.find({ }).then(types => {
    var protocol = process.env.PROTOCOL || (process.env.HOST ?
        'https' : 'http'), host = process.env.HOST || `localhost:${process.env.SERVER_PORT}`;

    var slugs = [`${protocol}://${host}/`, `${protocol}://${host}/?amp=true`];

    types.forEach(function({ docTypeNamePlural, docTypeId }) {
      if (!fs.existsSync(path.join(process.env.DIRECTORY || __dirname, `documents/${docTypeNamePlural}`))) {
        fs.mkdirSync(path.join(process.env.DIRECTORY || __dirname, `documents/${docTypeNamePlural}`));
      }
      slugs.push(`${protocol}://${host}/${docTypeNamePlural}`,
        `${protocol}://${host}/${docTypeNamePlural}?amp=true`);
      Document.find({ docTypeId }).then(docs => {
        docs.forEach((doc) => {
          slugs.push(`${protocol}://${host}/${docTypeNamePlural}/${doc.slug}`);
          slugs.push(`${protocol}://${host}/${docTypeNamePlural}/${doc.slug}?amp=true`);
          doc.save();
        });
        slugs.sort();
        fs.writeFileSync(path.join(process.env.DIRECTORY || __dirname, 'public/sitemap.txt'), slugs.join('\n'));
      });
    });
  });
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

passport.use('local-signup', SignupStrategy);
passport.use('local-login', LoginStrategy);

passport.serializeUser(({ _id }, done) => {
  done(null, _id);
});
passport.deserializeUser((_id, done) => {
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});

app.use(express.static(path.join(process.env.DIRECTORY || __dirname, '/public')));
app.use('/api/users', userRoutes);
app.use('/api/site_config', configRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/sitemap', sitemapRoutes);
app.use('/api/site_theme', themeRoutes);

app.use('/', express.static(path.join(process.env.DIRECTORY || __dirname, '/public')));
app.get('/*', function(req, res, next) {
  if (req.query.amp) return ampRoutes(req, res, next);
  return ssrRoutes(req, res, next);
});
app.post('/api', function(req, res) {
  apiProxy.web(req, res, { target: `http://localhost:${port}/api` });
});

app.listen(port);

export default app;
