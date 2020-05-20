import { expect } from 'chai';
import mongoose from 'mongoose';
import User from '../src/server/models/User';
import SiteConfig from '../src/server/models/SiteConfig';
let dbURI = process.env.DB_CONN_URL || 'mongodb://localhost/enigma-test';

let clearDB = function(done) {
  mongoose.connection.collections['siteconfigs'].remove(done);
  mongoose.connection.collections['users'].remove(done);
}

describe('DB tests', function () {
  before(function (done) {
    mongoose.connect(dbURI);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
        console.log('We are connected to test database!');
        done();
      });
    });

  describe('Site config', function(done) {
    it('site config creatable', function(done) {
      var testConfig = SiteConfig();

      testConfig.save(done);
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
  });

  after(function(done){
    mongoose.connection.db.dropDatabase(async function(){
      await mongoose.disconnect();
      done();
    });
  });
});
