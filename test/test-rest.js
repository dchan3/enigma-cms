import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { default as app } from '../src/server/server.js';
chai.use(chaiHttp);

const { JSDOM } = require('jsdom'), jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  pretendToBeVisible: true
});
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.history = window.history;
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};

describe('API requests', function() {
  describe('Site config', function() {
    it('Config exists', function(done) {
      chai.request(app).get('/').then((err, res) => {
      }).then(done).catch(e => {
      });
    });
  });
});
