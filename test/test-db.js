import { expect } from 'chai';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import User from '../src/server/models/User';
import SiteConfig from '../src/server/models/SiteConfig';
import DocumentType from '../src/server/models/DocumentType';

let dbURI = process.env.DB_CONN_URL || 'mongodb://localhost/enigma-test';

let clearDB = function(done) {
  mongoose.connection.collections['siteconfigs'].remove(done);
  mongoose.connection.collections['users'].remove(done);
}

describe('DB and CRUD tests', function () {
  before(function (done) {
    mongoose.connect(dbURI, {useNewUrlParser: true}, function(e,c) {
      if (!e && c) {
        console.log('We are connected to test database!');
        fs.writeFile(path.resolve(
          process.env.DIRECTORY || '', 'public/style.css'), '', done);
      }
      if (e) throw e;
    });
  });

  describe('Site config', function() {
    it('site config creatable', function(done) {
      var testConfig = SiteConfig();

      testConfig.save(done);
    });

    it('site config save hooks work - stylesheet', function(done) {
      SiteConfig.findOne({ }).then(config => {
        let style = '.themed{background:cadetblue;}body{font-family:"Comic Sans MS,sans-serif;"}';
        config.set('stylesheet', style);
        config.save(() => {
          fs.readFile(path.resolve(
            process.env.DIRECTORY || '', 'public/style.css'), 'utf8', (err, nuStyle) => {
              expect(style).to.deep.equal(nuStyle);
              done();
          });
        });
      });
    });

    it('site config save hooks work - shortcodes', function(done) {
      SiteConfig.findOne({ }).then(config => {
        let shortcodes = [{
          name: 'dateFmt',
          args: ['date'],
          code: 'return date.toString();'
        }], thaCode = '{\ndateFmt: new Function("date", "return date.toString();")};\n';
        config.set('shortcodes', shortcodes);
        config.save(() => {
          fs.readFile(path.resolve(
            process.env.DIRECTORY || '', 'site-files/shortcodes.js'), 'utf8', (err, nuCode) => {
              expect(thaCode).to.deep.equal(nuCode);
              done();
          });
        });
      });
    });
  });

  describe('User test', function() {
    it('new user creatable', function(done) {
      var testUser = User({
        username: 'testuser',
        email: 'test@test.xyz',
        password: '123456',
        roleId: 1
      });

      testUser.save(done);
    });

    it('detect duplicate username', function(done) {
      var testUser = User({
        username: 'testuser',
        email: 'tester@test.xyz',
        password: '91200',
        roleId: 1
      });

      testUser.save((err) => {
        if (err && err.errmsg.indexOf('username') > -1) done();
      });
    });

    it('detect duplicate email', function(done) {
      var testUser = User({
        username: 'tstr',
        email: 'test@test.xyz',
        password: '93012',
        roleId: 1
      });

      testUser.save((err) => {
        if (err && err.errmsg.indexOf('email') > -1) done();
      });
    });

    it('bypass duplicate password', function(done) {
      var testUser = User({
        username: 'tstr',
        email: 'lol@test.xyz',
        password: '123456',
        roleId: 1
      });

      testUser.save(done);
    });
  });

  describe('Document test', function() {
    it('can create new document type', function(done) {
      var testType = DocumentType({
        docTypeName: 'post',
        docTypeNamePlural: 'posts',
        attributes: {
          title: 'text',
          body: 'text'
        },
        slugFrom: 'title'
      });
      testType.save(done);
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      mongoose.disconnect(done);
    });
  });
});
