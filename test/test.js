import React from 'react';
import { expect } from 'chai';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import { GeneratedForm, CodeEditor } from '../src/client/reusables';
import { default as camelcaseConvert }
  from '../src/client/utils/camelcase_convert';
import { default as gensig } from '../src/lib/utils/gensig';
import { default as formGenUtils } from '../src/client/utils/form_from_obj';
import { loget, loset } from '../src/client/utils/lofuncs.js';
import htmlToJsx, { createHtmlTree } from '../src/client/utils/html_to_jsx';
import { default as createReverseIndex }
  from '../src/server/utils/create_reverse_index';
import fromCss from '../src/client/utils/component_from_css';
import styleObject from '../src/client/utils/style_object';
import matchThePath,
{ returnPathKeys } from '../src/lib/utils/match_the_path';
import TemplateParser from '../src/server/utils/template_parser';

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
          lastName: {
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
        },
        value: [{
          firstName: 'John',
          lastName: 'Doe',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }]
      }
    };
    const wrapper = render(<GeneratedForm params={parameters}
      title="Event Summary" method="post" formAction="" />);
    expect(wrapper.text().indexOf('Contact Information'))
      .to.be.greaterThan(-1);
    expect(wrapper.text().indexOf('Phone'))
      .to.be.greaterThan(-1);
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(4);
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
    expect(gensig(obj)).to.match(regex);
    done();
  });
});

describe('Form from Obj', function() {
  it('Key Util Functions', function(done) {
    var obj = {
        'a': 2,
        'b': {
          'c': [1,3]
        },
        'd': ['e', { 'f': 'g' }]
      }, expected =
      ['a', 'b', 'b.c', 'b.c.0', 'b.c.1', 'd', 'd.0', 'd.1', 'd.1.f'], exp =
      ['a', 'b.c.0', 'b.c.1', 'd.0', 'd.1.f'],
      e = { 'a': 2, 'b.c.0': 1, 'b.c.1': 3, 'd.0': 'e', 'd.1.f': 'g' };
    expect(formGenUtils.outputKeys(obj, true)).to.deep.equal(expected);
    expect(formGenUtils.outputKeys(obj, false)).to.deep.equal(exp);
    expect(formGenUtils.mapKeysToValues(obj)).to.deep.equal(e)
    done();
  });

  it('Form from JSON gen fucntion', function(done) {
    var parameters = {
        guestList: {
          type: '[object]',
          shape: {
            firstName: {
              type: 'text'
            },
            lastName: {
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
      }, values = {
        guestList: [{
          firstName: 'John',
          lastName: 'Doe',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }]
      };
    expect(formGenUtils.formFromObj(parameters, values)).to.deep.equal([
      {
        component: 'FormObjectInputLabel',
        innerText: 'Guest List'
      },
      {
        component: 'FormSubmitButton',
        innerText: 'Add',
        attributes: { onClick: 'handleArrayAdd guestList' }
      },
      {
        component: 'FormLabel',
        innerText: 'First Name',
        attributes: { htmlFor: 'guestList.0.firstName' }
      },
      {
        component: 'FormInput',
        attributes: {
          value: 'John',
          id: 'guestList.0.firstName',
          isInvalid: false,
          name: 'guestList.0.firstName',
          onChange: 'handleChange guestList.0.firstName',
          type: 'text',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormLabel',
        innerText: 'Last Name',
        attributes: { htmlFor: 'guestList.0.lastName' }
      },
      {
        component: 'FormInput',
        attributes: {
          value: 'Doe',
          id: 'guestList.0.lastName',
          isInvalid: false,
          name: 'guestList.0.lastName',
          onChange: 'handleChange guestList.0.lastName',
          type: 'text',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormLabel',
        innerText: 'Age',
        attributes: {
          htmlFor: 'guestList.0.age'
        }
      },
      {
        component: 'FormInput',
        attributes: {
          value: 50,
          id: 'guestList.0.age',
          isInvalid: false,
          name: 'guestList.0.age',
          onChange: 'handleChange guestList.0.age',
          type: 'number',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormObjectInputLabel',
        innerText: 'Contact Information'
      },
      {
        component: 'FormLabel',
        innerText: 'Phone',
        attributes: {
          htmlFor: 'guestList.0.contactInformation.phone'
        }
      },
      {
        component: 'FormInput',
        attributes: {
          value: '123-456-7890',
          isInvalid: false,
          id: 'guestList.0.contactInformation.phone',
          name: 'guestList.0.contactInformation.phone',
          onChange: 'handleChange guestList.0.contactInformation.phone',
          type: 'text',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormLabel',
        innerText: 'Email',
        attributes: {
          htmlFor: 'guestList.0.contactInformation.email'
        }
      },
      {
        component: 'FormInput',
        attributes: {
          value: 'john@johndoe.net',
          isInvalid: false,
          id: 'guestList.0.contactInformation.email',
          name: 'guestList.0.contactInformation.email',
          onChange: 'handleChange guestList.0.contactInformation.email',
          type: 'text',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormSubmitButton',
        attributes: {
          onClick: 'handleArrayRemove guestList 0'
        },
        innerText: 'Remove'
      }
    ]);
    done();
  });

  it('Validation function', function(done) {
    var parameters = {
        guestList: {
          type: '[object]',
          shape: {
            firstName: {
              type: 'text',
              required: true
            },
            lastName: {
              type: 'text',
              required: true
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
      }, valuesValid = {
        guestList: [{
          firstName: 'John',
          lastName: 'Doe',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }]
      }, valuesInvalid = {
        guestList: [{
          firstName: 'John',
          lastName: '',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }, {
          firstName: '',
          lastName: '',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }]
      };
    expect(formGenUtils.validateForm(parameters, valuesValid)).to.be.true;
    expect(formGenUtils.validateForm(parameters,
      valuesInvalid)).to.have.members(['guestList.0.lastName',
      'guestList.1.firstName',
      'guestList.1.lastName']);
    done();
  });
});

describe('loget and loset functions', function() {
  it('loget works', function(done) {
    var object = {
      homies: [
        { name: 'Jack', hobbies: ['art', 'music'] }
      ]
    };
    expect(loget(object, 'homies.0.name')).to.equal('Jack');
    expect(loget(object, 'homies.0.hobbies')).to.deep.equal(['art', 'music']);
    expect(loget(object, 'homies.0.girlfriend')).to.be.undefined;
    done();
  });

  it('loset works', function(done) {
    var object = {
      homies: [
        { name: 'Jack', hobbies: ['art', 'music'] }
      ]
    }
    loset(object, 'homies.0.name', 'John');
    expect(loget(object, 'homies.0.name')).to.equal('John');
    done();
  });

  it('loset new key', function(done) {
    var object = {
      leader:
        { name: 'Jack', hobbies: ['art', 'music'] }
    };
    loset(object, 'leader.lastName', 'Sparrow');
    expect(object.leader.lastName).to.equal('Sparrow');
    done();
  });
});

describe('Num Key to Shape Key function', function() {
  it('works', function(done) {
    var actual = formGenUtils.numKeyToShapeKey('groups.1.leader.name'),
      expected = 'groups.shape.leader.shape.name';
    expect(actual).to.equal(expected);
    done();
  });
});

describe('Reverse Index function', function() {
  it ('works as desired', function(done) {
    var actual = createReverseIndex('Hello World'),
      expected = { 'Hello': [0], 'World': [6] };
    expect(actual).to.deep.equal(expected);
    done();
  });
});

describe('HTML to JSX', function() {
  it ('HTML Tree - Single Tag', function(done) {
    var actual = createHtmlTree('<img src="trolol.jpeg" />'),
      expected = [{ node: 'tag', name: 'img', attributes: [
        { name: 'src', value: '"trolol.jpeg"' }
      ] }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - Multiple Tags with Multiple Attributes', function(done) {
    var actual =
      createHtmlTree(
        '<link rel="stylesheet" type="text/css" href="style.css" />' +
        '<meta name="keywords" content="cheese,milk" />'),
      expected = [{ node: 'tag', name: 'link', attributes: [
        { name: 'rel', value: '"stylesheet"' },
        { name: 'type', value: '"text/css"' },
        { name: 'href', value: '"style.css"' }
      ] }, { node: 'tag', name: 'meta', attributes: [
        { name: 'name', value: '"keywords"' },
        { name: 'content', value: '"cheese,milk"' }
      ] }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - Sandwich Tag', function(done) {
    var actual = createHtmlTree('<h1>Hello World!</h1>'),
      expected = [{ node: 'tag', name: 'h1', children: [{
        node: 'text',
        name: 'Hello World!'
      }]
      }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - Sandwich Tag with Attributes', function(done) {
    var actual =
      createHtmlTree('<a target="_self" href="localhost:8080/">Click Here</a>'),
      expected = [{ node: 'tag', name: 'a',
        attributes: [{
          name: 'target', value: '"_self"' }, {
          name: 'href', value: '"localhost:8080/"'
        }],
        children: [{
          node: 'text',
          name: 'Click Here'
        }]
      }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - Sandwich Tag with Nested Single Tag', function(done) {
    var actual =
      createHtmlTree('<a target="_self" href="localhost:8080/">' +
      '<img alt="im a meme" src="me.com/" /></a>'),
      expected = [{ node: 'tag', name: 'a',
        attributes: [{
          name: 'target', value: '"_self"' }, {
          name: 'href', value: '"localhost:8080/"'
        }],
        children: [{
          node: 'tag',
          name: 'img',
          attributes: [{
            name: 'alt', value: '"im a meme"' }, {
            name: 'src', value: '"me.com/"'
          }],
        }]
      }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - Mixed Nested Tags', function(done) {
    var actual =
      createHtmlTree(
        '<p>Written by <a href="localhost:8080/dchan3">dchan3</a></p>'),
      expected = [{ node: 'tag', name: 'p',
        children: [{
          node: 'text',
          name: 'Written by '
        }, {
          node: 'tag',
          name: 'a',
          attributes: [{
            name: 'href', value: '"localhost:8080/dchan3"' }],
          children: [{
            node: 'text',
            name: 'dchan3'
          }]
        }]
      }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it('HTML Tree - Text Node Start', function(done) {
    var actual =
      createHtmlTree('Hello there.' +
        '<a target="_self" href="localhost:8080/">Click this link.</a>'),
      expected = [{
        node: 'text',
        name: 'Hello there.'
      }, { node: 'tag', name: 'a',
        attributes: [{
          name: 'target', value: '"_self"' }, {
          name: 'href', value: '"localhost:8080/"'
        }],
        children: [{
          node: 'text',
          name: 'Click this link.'
        }]
      }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - JSX Tree', function(done) {
    var actual =
      htmlToJsx('<a target="_self" href="localhost:8080/">' +
      '<img alt="im a meme" src="me.com/" /></a>'),
      expected = <a target="_self" href="localhost:8080/">
        <img alt="im a meme" src="me.com/" /></a>;
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - Style Prop', function(done) {
    var actual =
      createHtmlTree(
        '<p style="font-weight: 900; font-family: sans-serif;">Hello.</p>'),
      expected = [{ node: 'tag', name: 'p',
        attributes: [{
          name: 'style', value: {
            fontWeight: 900,
            fontFamily: 'sans-serif'
          }
        }],
        children: [{
          node: 'text',
          name: 'Hello.'
        }]
      }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - Class Prop', function(done) {
    var actual =
      createHtmlTree(
        '<div class="front__menu">Yeah.</div>'),
      expected = [{ node: 'tag', name: 'div',
        attributes: [{
          name: 'className', value: '"front__menu"'
        }],
        children: [{
          node: 'text',
          name: 'Yeah.'
        }]
      }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('HTML Tree - br tag', function(done) {
    var actual =
      createHtmlTree(
        '<p class="front__menu">A paragraph.</p>' +
        '<br /><p class="front__menu">Another.</p>'),
      expected = [{ node: 'tag', name: 'p',
        attributes: [{
          name: 'className', value: '"front__menu"'
        }],
        children: [{
          node: 'text',
          name: 'A paragraph.'
        }]
      }, { node: 'tag', name: 'br' }, { node: 'tag', name: 'p',
        attributes: [{
          name: 'className', value: '"front__menu"'
        }],
        children: [{
          node: 'text',
          name: 'Another.'
        }]
      }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it('Multiple Mixed Tags Children', function(done) {
    var actual = createHtmlTree('<div><code>import React from "react";</code>' +
    '<br /><code>export default function() { console.log("Hello"); }</code>' +
    '</div>'),
      expected = [{
        node: 'tag', name: 'div', children: [
          { node: 'tag', name: 'code', children: [
            { node: 'text',
              name: 'import React from "react";' }
          ] },
          { node: 'tag', name: 'br' },
          { node: 'tag', name: 'code', children: [
            { node: 'text',
              name: 'export default function() { console.log("Hello"); }' }
          ] }
        ] }];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it('HTML Entities', function(done) {
    var actual =
      createHtmlTree('<p>&lt;insert funny puns &amp; jokes here&gt;</p>'),
      expected = [{
        node: 'tag', name: 'p', children: [
          { node: 'text',
            name: '<insert funny puns & jokes here>' }
        ] }];
    expect(actual).to.deep.equal(expected);
    done();
  });
});

describe('From CSS', function() {
  it('To Style Object', function(done) {
    var actual = styleObject('opacity:1;width:calc(100%-16px);'),
      expected = {
        opacity: 1,
        width: 'calc(100%-16px)'
      };
    expect(actual).to.deep.equal(expected);
    done();
  });

  it('Basic functions', function(done) {
    let Element = fromCss('p', 'font-family: sans-serif;'),
      actual = render(<Element>Hi!</Element>), expected = render(<p style={{
        fontFamily: 'sans-serif'
      }}>Hi!</p>);

    expect(actual.find('p').text()).to.equal(expected.find('p').text());
    expect(actual.get(0).style).to.deep.equal(expected.get(0).style);
    done();
  });

  it('Advanced functions', function(done) {
    let Element = fromCss('p',
        ({ mono }) => `font-family: ${mono === true
          ? 'monospace' : 'sans-serif'};`, ['mono']),
      actual = render(<Element mono={true}>Hi!</Element>),
      expected = render(<p style={{
        fontFamily: 'monospace'
      }}>Hi!</p>);

    expect(actual.find('p').text()).to.equal(expected.find('p').text());
    expect(actual.get(0).style).to.deep.equal(expected.get(0).style);
    done();
  });
});

describe('Router', function() {
  it('path matcher 1', function(done) {
    let actual = returnPathKeys('/profile/:id');
    expect(actual.keys).to.deep.equal(['id']);
    done();
  });

  it('path matcher 2', function(done) {
    let actual = matchThePath('/profile/bruh', { path: '/profile/:id' });
    expect(actual).to.deep.equal({
      path: '/profile/:id',
      url: '/profile/bruh',
      params: {
        id: 'bruh'
      }
    });
    done();
  });

  it('path matcher 3', function(done) {
    let actual = matchThePath('/post/what-up', {
      path: ['/post/:slug', '/posts/:slug']
    });
    expect(actual).to.deep.equal({
      path: '/post/:slug',
      url: '/post/what-up',
      params: {
        slug: 'what-up'
      }
    });
    done();
  });
});

describe('Template parser', function() {
  it('basics', function(done) {
    let actual = TemplateParser.compile('<h1>{{message}}</h1>')({
        message: 'Hello World!'
      }), expected = '<h1>Hello World!</h1>';
    expect(actual).to.equal(expected);
    done();
  });

  it('helper functions', function(done) {
    TemplateParser.registerHelper('reverse', function(str) {
      return str.split('').reverse().join('');
    });
    let actual = TemplateParser.compile('<h1>{{reverse message}}</h1>')({
        message: 'Anna'
      }), expected = '<h1>annA</h1>';
    expect(actual).to.equal(expected);
    done();
  });

  it('each tag', function(done) {
    let actual = TemplateParser.compile(
        '<ul>{{#each genres}}<li>{{this}}</li>{{/each}}</ul>')({
        genres: ['EDM', 'Rock', 'Misc']
      }), expected = '<ul><li>EDM</li><li>Rock</li><li>Misc</li></ul>';
    expect(actual).to.equal(expected);
    done();
  });
});
