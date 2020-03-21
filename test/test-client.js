import { h } from 'preact'; /** @jsx h **/
import { expect } from 'chai';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';
Enzyme.configure({ adapter: new Adapter });
import { GeneratedForm, CodeEditor } from '../src/client/reusables';
import { default as camelcaseConvert }
  from '../src/client/utils/camelcase_convert';
import { default as formGenUtils } from '../src/client/utils/form_from_obj';
import { loget, loset, objMap } from '../src/client/utils/lofuncs.js';
import htmlToJsx, { createHtmlTree } from '../src/client/utils/html_to_jsx';
import fromCss from '../src/client/utils/component_from_css';
import styleObject from '../src/client/utils/style_object';
import { generateArray, truncatePageList } from '../src/client/reusables/PaginatorControls';
import { strQuery, shallowSearch } from '../src/client/reusables/PaginatorControlContext';

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

global.window = window;
global.document = window.document;

let renderForm = function(title, params, currentValue = null) {
  return render(<GeneratedForm params={params} title={title}
    currentValue={currentValue} method="post" formAction="" />);
}

describe('Reusable UI Components - Generated Form', function() {
  it('renders one parameter correctly', function(done) {
    var parameters = {
      username: {
        label: 'Username',
        type: 'text'
      }
    };
    const wrapper = renderForm('Find User', parameters);
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
          }
        }
      }, currentValue = {
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
    const wrapper = renderForm('Event Summary', parameters, currentValue);
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
    expect(wrapper.find('textarea')).to.exist;
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

  it('function types', function(done) {
    let parameters = {
        data: {
          type: function(value) {
            return value;
          },
          attrDepends: { type: ['dataType'] }
        },
        dataType: {
          type: 'enum',
          enumList: [
            { 'text': 'Text', 'value': 'text' },
            { 'text': 'Datetime', 'value': 'date' },
            { 'text': 'Select', 'value': 'enum' },
            { 'text': 'Number', 'value': 'number' },
            { 'text': 'Email', 'value': 'email' },
            { 'text': 'URL', 'value': 'url' },
            { 'text': 'Color', 'value': 'color' }
          ]
        }
      }, currentValue = {
        dataType: 'number',
        data: ''
      };
    let wrapper = renderForm('Data Entry', parameters, currentValue);
    expect(wrapper.find('input[type="number"]')).to.have.lengthOf(1);
    done();
  });

  it('maximum - text', function(done) {
    var parameters = {
      username: {
        type: 'text',
        maximum: 12
      }
    };
    let wrapper = renderForm('Sign Up', parameters);
    expect(wrapper.find('input[maxlength="12"]')).to.have.lengthOf(1);
    done();
  });

  it('maximum - non-text', function(done) {
    var parameters = {
      username: {
        type: 'number',
        maximum: 9000
      }
    };
    let wrapper = renderForm('Pick a number', parameters);
    expect(wrapper.find('input[maximum="9000"]')).to.have.lengthOf(1);
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

  it('real-world scenario', function(done) {
    let html =
      `<p>It's not an uncommon peeve for a single-page app in React to make browsers refresh upon clicking on a link, regardless of where it leads. This happens often in WordPress themes made with React, and many MERN stack apps as well. Contrary to many of the answers I've come across, there seems to be a workaround, assuming you're using React Router and the React Hooks API.</p>
<p>My solution involves <b>preventing the default behavior of anchor tags</b> and <b>pushing to the browser history object</b>, therefore <b>access to the history object needs to be provided to the tags.</b> My initial solution involved prop-drilling, the most common solution to which is to <b>use a context</b>, as follows:</p>
<h3>GeneralContext.js</h3>
<div style="background-color: #e0e0e0;"><code>import React, { useState, createContext } from 'react';</code><br /><code>let initialState = ({ history }) =&gt; ({ history });</code><br /><code>const GeneralContext = createContext(initialState);</code><br /><br /><code>export default GeneralContext;</code><br /><br /><code>const { Provider } = GeneralContext;</code><code>export const GeneralContextProvider = ({ children, initialVals }) =&gt; {</code><br /><code>  let iState = Object.assign({}, initialState(initialVals)), [generalState, setGeneralState] = useState(iState);</code><br /><code>  return &lt;Provider value={{ generalState, setGeneralState }}&gt;{children}&lt;/Provider&gt;;<br />};</code></div><p>Wherever in the code you specify your routes, create a functional component that returns a <code>Route</code> with the <code>GeneralContextProvider</code> and the component nested inside, then refactor accordingly:</p><div style="background-color: #e0e0e0;"><code>import React from 'react';import { Route } from 'react-router-dom';</code><br /><br /><code>let GeneralRoute = ({ component: Component, ...rest }) =&gt; &lt;Route  exact {...rest} component={({ history }) =&gt; (</code><br /><code>&lt;GeneralContextProvider initialVals={{ history, match }}&gt;</code><br /><code>      &lt;Component /&gt;&lt;/GeneralContextProvider&gt;</code><br /><code>)} /&gt;;</code></div><p>As you can see, the <code>GeneralContext</code> is provided the browser history object by means of the <code>Route</code> component attribute. Anything in this attribute will be passed an object with a <code>location</code>, <code>history</code>, and <code>match</code> attributes.</p><p>Now, for the actual link itself (don't mind the use of <code>styled-components</code>):</p><div style="background-color: #e0e0e0;"><code>import React, { useContext } from 'react';</code><br /><code>import GeneralContext from './GeneralContext';</code><br /><br /><code>function SamePageAnchor({  children, href, target, className, id, style, component}) {</code><br /><code>  let { generalState, setGeneralState } = useContext(GeneralContext),    Anchor = component || styled.a\`\`, AlreadyOn = styled.span\`    text-decoration: underline;    font-weight: 900;↵    margin: 0;↵    width: fit-content;   height: fit-content;  \`;</code><br /><br /><code>  function handleClick(event) {</code><br /><code>    if (href.startsWith('/')) {</code><br /><code>      let newState = Object.assign({}, generalState);</code><br /><code>      event.preventDefault();</code><br /><code>      newState.history.push(href);</code><br /><code>      setGeneralState(newState);</code><br /><code>    }</code><br /><code>  }</code><br /><br /><code>  return (generalState.history &&generalState.history.location.pathname !== href) ?    &lt;Anchor {...{ href, target, className, id, style     }} onClick={handleClick}&gt;{children}&lt;/Anchor&gt; :    &lt;AlreadyOn&gt;{children}&lt;/AlreadyOn&gt;;<br />}<br /><br />export default SamePageAnchor;</code></div><p>Now you should be good to go. Make sure that wherever in your code used, it has access to a <code>GeneralContext</code>.</p>`,
      actual = htmlToJsx(html),
      expected = [
        <p>{
          'It\'s not an uncommon peeve for a single-page app in React to make browsers refresh upon clicking on a link, regardless of where it leads. This happens often in WordPress themes made with React, and many MERN stack apps as well. Contrary to many of the answers I\'ve come across, there seems to be a workaround, assuming you\'re using React Router and the React Hooks API.'}</p>,
        <p>My solution involves <b>
          preventing the default behavior of anchor tags
        </b> and <b>pushing to the browser history object</b>, therefore <b>access to the history object needs to be provided to the tags.</b> My initial solution involved prop-drilling, the most common solution to which is to <b>use a context</b>, as follows:</p>,
        <h3>GeneralContext.js</h3>,
        <div style={{ backgroundColor: '#e0e0e0' }}>
          <code>{'import React, { useState, createContext } from \'react\';'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'let initialState = ({ history }) => ({ history });'}</code>
          <br key={undefined} ref={undefined} />
          <code>const GeneralContext = createContext(initialState);</code>
          <br key={undefined} ref={undefined} /><br key={undefined} ref={undefined} />
          <code>export default GeneralContext;</code>
          <br key={undefined} ref={undefined} /><br key={undefined} ref={undefined} />
          <code>{'const { Provider } = GeneralContext;'}</code>
          <code>{'export const GeneralContextProvider = ({ children, initialVals }) => {'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'  let iState = Object.assign({}, initialState(initialVals)), [generalState, setGeneralState] = useState(iState);'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'  return <Provider value={{ generalState, setGeneralState }}>{children}</Provider>;'}<br key={undefined} ref={undefined} />
            {'};'}</code>
        </div>,
        <p>Wherever in the code you specify your routes, create a functional component that returns a <code>Route</code> with the <code>GeneralContextProvider</code> and the component nested inside, then refactor accordingly:</p>,
        <div style={{ backgroundColor: '#e0e0e0' }}>
          <code>{'import React from \'react\';import { Route } from \'react-router-dom\';'}</code>
          <br key={undefined} ref={undefined} /><br key={undefined} ref={undefined} />
          <code>{'let GeneralRoute = ({ component: Component, ...rest }) => <Route  exact {...rest} component={({ history }) => ('}</code><br key={undefined} ref={undefined} />
          <code>{'<GeneralContextProvider initialVals={{ history, match }}>'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'      <Component /></GeneralContextProvider>'}</code>
          <br key={undefined} ref={undefined} />
          <code>{')} />;'}</code>
        </div>,
        <p>As you can see, the <code>GeneralContext</code> is provided the browser history object by means of the <code>Route</code> component attribute. Anything in this attribute will be passed an object with a <code>location</code>, <code>history</code>, and <code>match</code> attributes.</p>,
        <p>Now, for the actual link itself (don't mind the use of <code>styled-components</code>):</p>,
        <div style={{ backgroundColor: '#e0e0e0' }}>
          <code>{'import React, { useContext } from \'react\';'}</code>
          <br key={undefined} ref={undefined} />
          <code>import GeneralContext from './GeneralContext';</code>
          <br key={undefined} ref={undefined} /><br key={undefined} ref={undefined} />
          <code>{'function SamePageAnchor({  children, href, target, className, id, style, component}) {'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'  let { generalState, setGeneralState } = useContext(GeneralContext),    Anchor = component || styled.a``, AlreadyOn = styled.span`    text-decoration: underline;    font-weight: 900;↵    margin: 0;↵    width: fit-content;   height: fit-content;  `;'}</code>
          <br key={undefined} ref={undefined} /><br key={undefined} ref={undefined} /><code>{'  function handleClick(event) {'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'    if (href.startsWith(\'/\')) {'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'      let newState = Object.assign({}, generalState);'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'      event.preventDefault();'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'      newState.history.push(href);'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'      setGeneralState(newState);'}</code>
          <br key={undefined} ref={undefined} />
          <code>{'    }'}</code><br key={undefined} ref={undefined} />
          <code>{'  }'}</code><br key={undefined} ref={undefined} /><br key={undefined} ref={undefined} />
          <code>{'  return (generalState.history &&generalState.history.location.pathname !== href) ?    <Anchor {...{ href, target, className, id, style     }} onClick={handleClick}>{children}</Anchor> :    <AlreadyOn>{children}</AlreadyOn>;'}
            <br key={undefined} ref={undefined} />{'}'}<br key={undefined} ref={undefined} /><br key={undefined} ref={undefined} />
            {'export default SamePageAnchor;'}</code>
        </div>,
        <p>Now you should be good to go. Make sure that wherever in your code used, it has access to a <code>GeneralContext</code>.</p>];
    expect(actual).to.deep.equal(expected);
    done();
  })
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

describe('obj map', function() {
  it('flat out works', function(done) {
    expect(objMap({
      uno: '1',
      dos: '2',
      tres: '3'
    }, function(k) {
      return Number.parseInt(this[k]);
    })).to.deep.equal([1,2,3]);
    done();
  });
});


describe('Paginator Controls', function() {
  it('array generation from 1 to n', function(done) {
    expect(generateArray(5)).to.deep.equal([1,2,3,4,5]);
    done();
  });

  it('array generation from n to k', function(done) {
    expect(generateArray(4,7)).to.deep.equal([4,5,6,7]);
    done();
  });

  // numberOfPages, maxPageTabs, currentPage
  it('truncated page list 1', function(done) {
    expect(truncatePageList(4,5,3)).to.deep.equal([1,2,3,4]);
    done();
  });

  it('truncated page list 2', function(done) {
    expect(truncatePageList(7,5,1)).to.deep.equal([1,2,3,null,6,7]);
    done();
  });

  it('shallow search 1', function(done) {
    expect(strQuery('boogie man', 'boogie')).to.equal(true);
    done();
  });

  it('shallow search 2', function(done) {
    expect(strQuery('alpha', 'alpha male')).to.equal(false);
    done();
  });

  it('shallow search 3', function(done) {
    expect(shallowSearch(['alpha', 'bravo', 'charlie', 'alphabet'], 'alpha')).to.deep.equal(['alpha', 'alphabet']);
    done();
  });
});
