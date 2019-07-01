import express from 'express';
import passport from 'passport';
import { User, SiteConfig, Document, DocumentType } from './models';
import { default as SignupStrategy } from './passport/signup';
import { default as LoginStrategy } from './passport/login';
import mongoose from 'mongoose';
import { userRoutes, configRoutes, documentRoutes, fileRoutes }
  from './routes/api';
import bodyParser from 'body-parser';
import { default as expressSession } from './session';
import { default as ssrRoutes } from './routes/ssr';
import { createProxyServer } from 'http-proxy';
import fs from 'fs';
import path from 'path';

mongoose.Promise = global.Promise;

var app = express(), port = process.env.SERVER_PORT || 8080,
  apiProxy = createProxyServer();

mongoose.connect(require('../../config/db.js').url, {}, () => {
  SiteConfig.findOne({}).then(config => {
    if (!config) {
      let newConfig = new SiteConfig({});
      newConfig.save();
    }
    else return;
  });
});

app.post('/api', function(req, res) {
  apiProxy.web(req, res, { target: 'http://localhost:8080/api' })
});

app.use(expressSession);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((_id, done) => {
  User.findById(_id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-signup', SignupStrategy);
passport.use('local-login', LoginStrategy);

app.use(express.static('public'));
app.use('/api/users', userRoutes);
app.use('/api/site_config', configRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/files', fileRoutes);

// STATIC FILES
app.get('/app.bundle.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8' );
  res.send(fs.readFileSync(path.resolve(__dirname, 'public/app.bundle.js')))
});
app.get('/prism.css', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'public/prism.css')));
});
app.get('/prism.js', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'public/prism.js')));
});
app.get('/favicon.ico', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'public/favicon.ico')));
});
app.get('/uploads/:type/:filename', ({ params: { type, filename } }, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname,
    `public/${type}/${filename}`)));
});
app.get('/profile-pix/:filename', (req, res) => {
  var { filename } = req.params;
  res.send(fs.readFileSync(path.resolve(__dirname,
    `public/profile-pix/${filename}`)));
});
app.get('/site-icon/:filename', ({ params: { filename } }, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname,
    `public/site-icon/${filename}`)));
});
app.get('/robots.txt', (req, res) => {
  res.send(fs.readFileSync(path.resolve(__dirname, 'public/robots.txt')));
});
app.get('/sitemap.txt', async ({ headers: { host }, protocol }, res) => {
  var docTypes = await DocumentType.find({}).select({ docTypeNamePlural: 1,
      docTypeId: 1 }), documents = await Document.find({ draft: false }).sort({
      docType: 1, createdAt: -1 }).select({ slug: 1, docTypeId: 1, _id: -1 }),
    docTypeMap = {}, slugs = [`${protocol}://${host}/`];
  docTypes.forEach(({ docTypeNamePlural, docTypeId }) => {
    slugs.push(`${protocol}://${host}/${docTypeNamePlural}`);
    docTypeMap[docTypeId] = docTypeNamePlural; });
  slugs.push(...documents.map(({ docTypeId, slug }) =>
    `${protocol}://${host}/${docTypeMap[docTypeId]}/${slug}`));
  slugs.sort();
  res.header('Content-Type', 'text/plain');
  res.send(slugs.join('\n'));
});
app.get('/*', ssrRoutes);

app.listen(port);
