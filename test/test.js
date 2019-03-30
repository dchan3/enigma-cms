import React from 'react';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import GeneratedForm from '../src/client/reusables/GeneratedForm';
import CodeEditor from '../src/client/reusables/CodeEditor';
import { default as urlUtilsClient } from '../src/client/utils';
import { default as urlUtilsServer } from '../src/server/utils';
import icongen from '../src/server/utils/icongen';
import { default as camelcaseConvert }
  from '../src/client/utils/camelcase_convert';
import { default as gensigClient } from '../src/client/utils/gensig';
import { default as gensigServer } from '../src/server/utils/gensig';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');

const window = jsdom.window;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);

describe('Reusable UI Components - Generated Form', function() {
  it('renders one parameter correctly', function(done) {
    var parameters = {
      username: {
        label: 'Username',
        type: 'text'
      }
    };
    const wrapper = render(<GeneratedForm params={parameters}
      title="Find User" method="post" formAction="" />);
    expect(wrapper.find('h2')).to.have.lengthOf(1);
    expect(wrapper.find('h2').text()).to.equal('Find User');
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(1);
    expect(wrapper.find('label[for="username"]')).to.have.lengthOf(1);
    expect(wrapper.find('label[for="username"]').text()).to.equal('Username');
    done();
  });

  it('renders recursively without error', function(done) {
    var parameters = {
      guestList: {
        type: '[object]',
        shape: {
          firstName: {
            type: 'text'
          },
          age: {
            type: 'number'
          },
          contactInformation: {
            type: 'object',
            shape: {
              phone: {
                type: 'text'
              },
              email: {
                type: 'text'
              }
            }
          }
        }
      }
    };
    const wrapper = render(<GeneratedForm params={parameters}
      title="Event Summary" method="post" formAction="" />);
    expect(wrapper.text().indexOf('Contact Information'))
      .to.be.greaterThan(-1);
    expect(wrapper.text().indexOf('Phone'))
      .to.be.greaterThan(-1);
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(3);
    expect(wrapper.find('input[type="number"]')).to.have.lengthOf(1);
    done();
  });
});

describe('Reusable UI Components - Code Editor', function() {
  it('renders correctly with existing value', function(done) {
    const wrapper = render(<CodeEditor grammar="html" name="post-body"
      id="post-body" value="<h1>Hello World!</h1>" />);
    expect(wrapper.find('textarea').text()).to.equal('<h1>Hello World!</h1>');
    done();
  });
});

// WARNING: Do not run URL Utils tests with environment variables set, or else
// tests will fail!
describe('URL Utils', function() {
  it('server url info works as expected', function(done) {
    expect(urlUtilsClient.serverInfo.url).to.equal('http://localhost:8080');
    done();
  });

  it('server path function works as expected', function(done) {
    expect(urlUtilsClient.serverInfo.path('/api'))
      .to.equal('http://localhost:8080/api');
    done();
  });

  it('client url info works as expected', function(done) {
    expect(urlUtilsServer.clientInfo.url).to.equal('http://localhost:3000');
    done();
  });

  it('client path function works as expected', function(done) {
    expect(urlUtilsServer.clientInfo.path('/index'))
      .to.equal('http://localhost:3000/index');
    done();
  });
});

describe('Profile Picture Generation', function() {
  it('pretty much works', function(done) {
    icongen('d_dog_tha_man', function(result) {
      expect(result).to.not.be.null;
      expect(result).to.match(/^data:image\/png;base64,/);
      done();
    });
  });
});

describe('Camel Case String Conversion', function() {
  it('one word', function(done) {
    expect(camelcaseConvert('monkey')).to.equal('Monkey');
    done();
  });

  it('two words', function(done) {
    expect(camelcaseConvert('codeMonkey')).to.equal('Code Monkey');
    done();
  });

  it('three words', function(done) {
    expect(camelcaseConvert('threeLeggedDog'))
      .to.equal('Three Legged Dog');
    done();
  });
});

describe('Signature Generator', function () {
  it('generates signatures correctly', function (done) {
    var obj = { a: 5, b: 4 }, regex = /#[\da-f]{6} #[\da-f]{6}/;
    expect(gensigClient(obj)).to.match(regex);
    expect(gensigServer(obj)).to.match(regex);
    expect(gensigClient(obj) === gensigServer(obj)).to.be.true;
    done();
  });
});