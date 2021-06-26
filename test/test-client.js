/* eslint-disable max-len */
import { h } from 'preact'; /** @jsx h **/
import chai, { expect } from 'chai';
import { configure, render, shallow, mount } from 'enzyme';
import { act } from 'preact/test-utils';
import Adapter from 'enzyme-adapter-preact-pure';
configure({ adapter: new Adapter() });
import { GeneratedForm, CodeEditor, SamePageAnchor } from '../src/client/reusables';
import { default as camelcaseConvert }
  from '../src/client/utils/camelcase_convert';
import { default as formGenUtils } from '../src/client/utils/form_from_obj';
import formComps from '../src/client/reusables/formComps';
import { loget, loset, objMap } from '../src/lib/utils/lofuncs.js';
import htmlToJsx from '../src/client/utils/html_to_jsx';
import InnerHtmlRenderer from '../src/client/utils/inner_html_renderer';
import fromCss from '../src/client/contexts/FromCssContext';
import styleObject from '../src/client/utils/style_object';
import { generateArray, truncatePageList } from '../src/client/reusables/PaginatorControls';
import { strQuery, shallowSearch, pages } from '../src/client/reusables/PaginatorControlContext';
import { StaticContextProvider } from '../src/client/contexts/StaticContext';
import { TheRouterContextProvider } from '../src/client/contexts/TheRouterContext';
import { HeadContextProvider } from '../src/client/contexts/HeadContext';
import Fedora from '../src/client/reusables/Fedora';
import Footer from '../src/client/reusables/Footer';
import { createMemoryHistory as createHistory } from 'history';
import CodeEditorToolbar from '../src/client/reusables/CodeEditorToolbar';
import LoginPage from '../src/client/views/admin/LoginPage';
import SignupPage from '../src/client/views/admin/SignupPage';
import ConfigPage from '../src/client/views/admin/ConfigPage';
import ThemePage from '../src/client/views/admin/ThemePage';
import AdminLanding from '../src/client/views/admin/AdminLanding';
import ChangePasswordPage from '../src/client/views/admin/ChangePasswordPage';
import MainMenu from '../src/client/views/admin/MainMenu';
import FrontMenu from '../src/client/reusables/FrontMenu';
import DropdownMenu from '../src/client/reusables/DropdownMenu';
import TablePaginator from '../src/client/reusables/TablePaginator';
import NotFound from '../src/client/views/front/NotFound';
import { CodeEditorContextProvider } from '../src/client/reusables/CodeEditorContext';
import { TheBrowserRouter, TheStaticRouter, TheSwitch, TheRoute } from '../src/client/the_router';
import chaiExclude from 'chai-exclude';

chai.use(chaiExclude);

const { JSDOM } = require('jsdom'), jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  pretendToBeVisible: true
});
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.history = window.history;
global.requestAnimationFrame = () => {};
global.cancelAnimationFrame = () => {};
global.DOMParser = window.DOMParser;

let renderFromCss = function(children, par = { attachTo: document.body }) {
  return mount(<StaticContextProvider initialVals={{
      config: {
        themeColor: 'blue'
      }
    }}>{children}</StaticContextProvider>, par);
}

let mountRenderForm = function(title, params, currentValue = null) {
  return renderFromCss(<GeneratedForm params={params} title={title}
    currentValue={currentValue} method="post" formAction="" />);
}

let guestListParams = {
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
}

describe('Reusable UI Components - Generated Form', function() {
  it('renders one parameter correctly', function(done) {
    var parameters = {
      username: {
        label: 'Username',
        type: 'text'
      }
    };
    const wrapper = mountRenderForm('Find User', parameters);
    expect(wrapper.find('h2')).to.have.lengthOf(1);
    expect(wrapper.find('h2').text()).to.equal('Find User');
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(1);
    wrapper.detach();
    done();
  });

  it('renders recursively without error', function(done) {
    let currentValue = {
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
    let wrapper = mountRenderForm('Event Summary', guestListParams, currentValue);
    expect(wrapper.text().indexOf('Contact Information'))
      .to.be.greaterThan(-1);
    expect(wrapper.text().indexOf('Phone'))
      .to.be.greaterThan(-1);
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(4);
    expect(wrapper.find('input[type="number"]')).to.have.lengthOf(1);
    wrapper.detach();
    done();
  });

  it('Array Add', function(done) {
    let params = {
      names: {
        type: '[text]'
      }
    }, wrapper = mountRenderForm("Guest List", params, { names: ['Jordan'] });
    act(function() {
      wrapper.find('button').at(0).props().onClick({
        preventDefault: () => {}
      })
    });
    wrapper.update();
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(2);
    expect(wrapper.find('input[type="text"]').at(0).props().value).to.deep.equal('Jordan');
    expect(wrapper.find('input[type="text"]').at(1).props().value).to.deep.equal('');
    wrapper.detach();
    done();
  });

  it('Array Add (object)', function(done) {
    let params = {
      familyMembers: {
        type: '[object]',
        shape: {
          name: {
            type: 'text'
          },
          age: {
            type: 'number'
          }
        }
      }
    }, wrapper = mountRenderForm("Guest List", params, { familyMembers: [] });
    act(function() {
      wrapper.find('button').at(0).props().onClick({
        preventDefault: () => {}
      })
    });
    wrapper.update();
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(1);
    expect(wrapper.find('input[type="number"]')).to.have.lengthOf(1);
    wrapper.detach();
    done();
  });

  it('Array Remove', function(done) {
    let { FormSubmitButton } = formComps, params = {
      names: {
        type: '[text]'
      }
    }, wrapper = mountRenderForm("Guest List", params, { names: ['Jordan'] });
    act(function() {
      wrapper.find('button').at(1).props().onClick({
        preventDefault: () => {}
      })
    });
    wrapper.update();
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(0);
    wrapper.detach();
    done();
  });
});

describe('Reusable UI Components - Code Editor', function() {
  function verifyEditor(wrapper, value) {
    expect(wrapper.find('textarea')).to.exist;
    expect(wrapper.find('textarea').props().value).to.deep.equal(value);
  }

  function verifyPreview(wrapper, element, value) {
    expect(wrapper.find('div')).to.exist;
    expect(wrapper.find('div').at(6).props().contentEditable).to.be.true;
    expect(wrapper.find('div').at(6).find(element)).to.exist;
    expect(wrapper.find('div').at(6).find(element).text()).to.deep.equal(value);
  }

  it('renders correctly with existing value', function(done) {
    let wrapper = renderFromCss(<CodeEditor grammar="html" name="post-body"
      id="post-body" value="<h1>Hello World!</h1>" />);
    expect(wrapper.find('textarea')).to.exist;
    wrapper.detach();
    done();
  });

  it('changes value', function(done) {
    let wrapper = renderFromCss(<CodeEditor grammar="html" name="post-body"
      id="post-body" value="<h1>Hello World!</h1>" />);
    expect(wrapper.find('textarea')).to.exist;
    act(function() {
      wrapper.find('textarea').props().onInput({ target: { value: "<p>Lol.</p>"}});
    });
    wrapper.update();
    expect(wrapper.find('textarea').props().value).to.deep.equal('<p>Lol.</p>');
    wrapper.detach();
    done();
  });

  it('preview box - with value', function(done) {
    let wrapper = renderFromCss(<CodeEditor grammar="html" name="post-body"
      id="post-body" value="<h1>Hello World!</h1>" />);
    verifyEditor(wrapper, '<h1>Hello World!</h1>');
    act(function() {
      wrapper.find('button').at(0).props().onClick();
    });
    wrapper.update();
    verifyPreview(wrapper, 'h1', 'Hello World!');
    act(function() {
      wrapper.find('button').at(0).props().onClick();
    });
    wrapper.update();
    expect(wrapper.find('textarea')).to.exist;
    wrapper.detach();
    done();
  });
});

it('preview box - without value edit preview first', function(done) {
  let wrapper = renderFromCss(<CodeEditor grammar="html" name="post-body"
    id="post-body" value="" />);
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('');
  act(function() {
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('div')).to.exist;
  expect(wrapper.find('div').at(6).props().contentEditable).to.be.true;
  act(function() {
    wrapper.find('div').at(6).props().onInput({
      target: { innerHTML: '<p>Lol.</p>'}
    });
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<p>Lol.</p>');
  wrapper.detach();
  done();
});

it('preview box - with value edit preview first', function(done) {
  let wrapper = renderFromCss(<CodeEditor grammar="html" name="post-body"
    id="post-body" value="<h1>Hello.</h1>" />);
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<h1>Hello.</h1>');
  act(function() {
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('div')).to.exist;
  expect(wrapper.find('div').at(6).props().contentEditable).to.be.true;
  expect(wrapper.find('div').at(6).find('h1')).to.exist;
  expect(wrapper.find('div').at(6).find('h1').text()).to.equal('Hello.');
  act(function() {
    wrapper.find('div').at(6).props().onInput({
      target: { innerHTML: '<p>Lol.</p>'}
    });
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<p>Lol.</p>');
  wrapper.detach();
  done();
});

it('preview box - with value edit code first not changing preview', function(done) {
  let wrapper = renderFromCss(<CodeEditor grammar="html" name="post-body"
    id="post-body" value="<h1>Hello.</h1>" />);
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<h1>Hello.</h1>');
  act(function() {
    wrapper.find('textarea').at(0).props().onInput({
      target: { value: '<p>Lol.</p>' }
    });
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('div')).to.exist;
  expect(wrapper.find('div').at(6).props().contentEditable).to.be.true;
  expect(wrapper.find('div').at(6).find('p')).to.exist;
  expect(wrapper.find('div').at(6).find('p').text()).to.equal('Lol.');
  act(function() {
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<p>Lol.</p>');
  wrapper.detach();
  done();
});

it('preview box - with value edit code first changing preview', function(done) {
  let wrapper = renderFromCss(<CodeEditor grammar="html" name="post-body"
    id="post-body" value="<h1>Hello.</h1>" />);
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<h1>Hello.</h1>');
  act(function() {
    wrapper.find('textarea').at(0).props().onInput({
      target: { value: '<p>Lol.</p>' }
    });
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('div')).to.exist;
  expect(wrapper.find('div').at(6).props().contentEditable).to.be.true;
  expect(wrapper.find('div').at(6).find('p')).to.exist;
  expect(wrapper.find('div').at(6).find('p').text()).to.equal('Lol.');
  act(function() {
    wrapper.find('div').at(6).props().onInput({
      target: { innerHTML: '<h2>Bruh?</h2>' }
    });
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<h2>Bruh?</h2>');
  done();
});

it('preview box - edit preview bold command 1', function(done) {
  let wrapper = renderWithDom(<CodeEditor grammar="html" name="post-body"
    id="post-body" value="" />, null, {
      attachTo: document.body
    });
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('');
  act(function() {
    wrapper.find('textarea').at(0).props().onInput({
      target: { value: '<p>Lol</p>' }
    });
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('div')).to.exist;
  expect(wrapper.find('div').at(6).props().contentEditable).to.be.true;
  expect(wrapper.find('div').at(6).find('p')).to.exist;
  expect(wrapper.find('div').at(6).find('p').text()).to.equal('Lol');
  act(function() {
    let r = document.createRange(), s = document.getSelection();
    r.selectNodeContents(wrapper.find('div').at(6).find('p').getDOMNode());
    s.addRange(r);
    wrapper.find('button').at(1).props().onClick();
  });
  wrapper.update();
  act(function() {
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<p><strong>Lol</strong></p>');
  wrapper.detach();
  document.getSelection().removeAllRanges();
  done();
});

it('preview box - edit preview bold command 2', function(done) {
  let wrapper = renderWithDom(<CodeEditor grammar="html" name="post-body"
    id="post-body" value="" />, null, {
      attachTo: document.body
    });
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('');
  act(function() {
    wrapper.find('textarea').at(0).props().onInput({
      target: { value: '<p>Lol</p>' }
    });
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('div')).to.exist;
  expect(wrapper.find('div').at(6).props().contentEditable).to.be.true;
  expect(wrapper.find('div').at(6).find('p')).to.exist;
  expect(wrapper.find('div').at(6).find('p').text()).to.equal('Lol');
  act(function() {
    let r = document.createRange(), s = document.getSelection();
    r.selectNodeContents(wrapper.find('div').at(6).find('p').getDOMNode());
    r.setStart(wrapper.find('div').at(6).find('p').getDOMNode().firstChild, 0);
    r.setEnd(wrapper.find('div').at(6).find('p').getDOMNode().firstChild, 1);
    s.addRange(r);
    let range = document.getSelection().getRangeAt(0);
    wrapper.find('button').at(1).props().onClick();
  });
  wrapper.update();
  act(function() {
    wrapper.find('button').at(0).props().onClick();
  });
  wrapper.update();
  expect(wrapper.find('textarea')).to.exist;
  expect(wrapper.find('textarea').props().value).to.deep.equal('<p><strong>L</strong>ol</p>');
  wrapper.detach();
  done();
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

let renderWithDom = function(component, staticVal = null, par) {
  return renderFromCss(<TheRouterContextProvider value={{
    history: createHistory({
      basename: 'localhost:8080'
    }),
    basename: 'localhost:8080'
  }}>
  <StaticContextProvider initialVals={staticVal}>
    {component}
  </StaticContextProvider>
  </TheRouterContextProvider>, par);
}

describe('Change Password Page', function() {
  it('displays as intended', function(done) {
    let wrapper = renderWithDom(<ChangePasswordPage />, { config: { themeColor: 'blue' }, user: { username: 'my_user'}});
    expect(wrapper.find('input[type="password"]')).to.have.lengthOf(2);
    done();
  });
});

describe('Footer', function() {
  it('when user exists', function(done) {
    let wrapper = renderWithDom(<Footer />, { config: { themeColor: 'blue' }, user: { username: 'my_user' }});
    expect(wrapper.find('a')).to.have.lengthOf(5);
    wrapper.detach();
    done();
  });

  it('when user does not exist', function(done) {
    let wrapper = renderWithDom(<Footer />, { config: { themeColor: 'blue' }, user: null });;
    expect(wrapper.find('a')).to.have.lengthOf(3);
    wrapper.detach();
    done();
  });
});

describe('Config Page', function() {
  it('displays as intended', function(done) {
    let wrapper = renderWithDom(<ConfigPage />, { config: { themeColor: 'blue' }, user: { username: 'my_user', config: { } }});
    expect(wrapper.find('input')).to.have.lengthOf(9);
    wrapper.detach();
    done();
  });
});

describe('Theme Page', function() {
  it('displays as intended', function(done) {
    let wrapper = renderWithDom(<ThemePage />, { config: { themeColor: 'blue' }, theme: null });
    expect(wrapper.find('textarea')).to.have.lengthOf(4);
    wrapper.detach();
    done();
  });
});

describe('Admin Landing', function() {
  it('displays as intended', function(done) {
    let wrapper = renderWithDom(<AdminLanding />, { config: { themeColor: 'blue' }, user: { username: 'my_user' } });
    expect(wrapper.find('h1')).to.have.lengthOf(1);
    expect(wrapper.find('h1').text()).to.deep.equal('Welcome, my_user.');
    wrapper.detach();
    done();
  });
});

describe('Main Menu', function() {
  it('displays as intended', function(done) {
    let wrapper = renderWithDom(<MainMenu />, { config: { themeColor: 'blue' }, user: { username: 'my_user' } });
    expect(wrapper.find('ul')).to.have.lengthOf(4);
    wrapper.detach();
    done();
  });

  it('displays as intended with types', function(done) {
    let wrapper = renderWithDom(<MainMenu />, { config: { themeColor: 'blue' }, user: { username: 'my_user' }, types: [{
      docTypeId: 0,
      docTypeName: 'posts'
    }]});
    expect(wrapper.find('ul')).to.have.lengthOf(4);
    wrapper.detach();
    done();
  });
});

describe('Inner HTML Renderer', function() {
  it('displays as intended', function(done) {
    let wrapper = renderWithDom(<InnerHtmlRenderer innerHtml='<p>Dude.</p><a href="youtube.com">Here.</a>' />,
      { config: { themeColor: 'blue' },  theme: null });
    expect(wrapper.find('p')).to.have.lengthOf(1);
    expect(wrapper.find('a')).to.have.lengthOf(1);
    wrapper.detach();
    done();
  });
});

describe('Code Editor Toolbar', function() {
  it('displays correctly', function(done) {
    let wrapper = renderFromCss(<CodeEditorContextProvider>
      <CodeEditorToolbar />
    </CodeEditorContextProvider>);
    expect(wrapper.find('button')).to.have.lengthOf(4);
    wrapper.detach();
    done();
  });
});

describe('Front Menu', function() {
  it('displays as intended', function(done) {
    let menuLinks = [{ linkUrl: '/', linkText: 'Home' },
      { linkUrl: '/sitemap.html', linkText: 'Sitemap' }];

    let wrapper = renderWithDom(<FrontMenu menuLinks={menuLinks} />, { config: { themeColor: 'blue' } });
    expect(wrapper.find('li')).to.have.lengthOf(2);
    wrapper.detach();
    done();
  });
});

describe('Dropdown Menu', function() {
  it('displays as intended', function(done) {
    let menuNodes = [{ url: '/manage-users', text: 'Manage Users' },
      { text: 'Posts', childNodes: [{
        linkUrl: '/edit-post', linkText: 'Edit Post'
      }]
    }];

    let wrapper = renderWithDom(<DropdownMenu menuNodes={menuNodes} />, { config: { themeColor: 'blue' } });
    expect(wrapper.find('ul')).to.have.lengthOf(2);
    expect(wrapper.find('li')).to.have.lengthOf(3);
    wrapper.detach();
    done();
  });
});

describe('Login Page', function() {
  it('displays as intended', function(done) {
    let wrapper = renderWithDom(<LoginPage />,
      { config: { siteName: 'My Website', themeColor: 'blue' }});
    expect(wrapper.find('a')).to.have.lengthOf(1);
    wrapper.detach();
    done();
  });
});

describe('Signup Page', function() {
  it('displays as intended', function(done) {
    let wrapper = renderWithDom(<SignupPage />,
      { config: { siteName: 'My Website', themeColor: 'blue' }});
    expect(wrapper.find('a')).to.have.lengthOf(1);
    wrapper.detach();
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

  it('empty values object - single level', function(done) {
    let params = {
      name: {
        type: 'text'
      },
      age: {
        type: 'number'
      }
    }, expected = { name: '', age: '' };

    expect(formGenUtils.emptyValuesObj(params)).to.deep.equal(expected);
    done();
  });

  it('empty values object - two levels', function(done) {
    let params = {
      name: {
        type: 'object',
        shape: {
          firstName: {
            type: 'text'
          },
          lastName: {
            type: 'text'
          }
        }
      },
      age: {
        type: 'number'
      }
    }, expected = { name: {
      firstName: '',
      lastName: ''
    }, age: '' };

    expect(formGenUtils.emptyValuesObj(params)).to.deep.equal(expected);
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
    var valuesValid = {
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
    expect(formGenUtils.validateForm(guestListParams, valuesValid)).to.be.true;
    expect(formGenUtils.validateForm(guestListParams,
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
    let wrapper = mountRenderForm('Data Entry', parameters, currentValue);
    expect(wrapper.find('input[type="number"]')).to.have.lengthOf(1);
    expect(wrapper.find('select')).to.have.lengthOf(1);
    expect(wrapper.find('option')).to.have.lengthOf(7);
    wrapper.detach();
    done();
  });

  it('maximum - text', function(done) {
    var parameters = {
      username: {
        type: 'text',
        maximum: 12
      }
    };
    let wrapper = mountRenderForm('Sign Up', parameters);
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(1);
    wrapper.detach();
    done();
  });

  it('maximum - non-text', function(done) {
    var parameters = {
      username: {
        type: 'number',
        maximum: 9000
      }
    };
    let wrapper = mountRenderForm('Pick a number', parameters);
    expect(wrapper.find('input[type="number"]')).to.have.lengthOf(1);
    wrapper.detach();
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
  it ('HTML Tree - JSX Tree', function(done) {
    var actual =
      htmlToJsx('<a target="_self" href="localhost:8080/">' +
      '<img alt="im a meme" src="me.com/" /></a>'),
      expected = <a target="_self" href="localhost:8080/">
        <img alt="im a meme" src="me.com/" /></a>;
    expect(actual).excludingEvery(['key', 'ref', '__v']).to.deep.equal(expected);
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
    expect(actual).excludingEvery(['key', 'ref', '__v']).to.deep.equal(expected);
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
    let Element = fromCss('p', 'font-family:sans-serif;'),
      actual = renderFromCss(<Element>Hi!</Element>),
      expected = mount(<p style={{
        fontFamily: 'sans-serif'
      }}>Hi!</p>);

    expect(actual.find('p').text()).to.equal(expected.find('p').text());
    done();
  });

  it('Advanced functions', function(done) {
      let Element = fromCss('p', ({ mono }) => `font-family: ${mono === true
          ? 'monospace' : 'sans-serif'};`),
      actual = renderFromCss(<Element>Hi!</Element>),
      expected = mount(<p style={{
        fontFamily: 'monospace'
      }}>Hi!</p>);

    expect(actual.find('p').text()).to.equal(expected.find('p').text());
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

  it('truncated page list 3', function(done) {
    expect(truncatePageList(8,5,8)).to.deep.equal([1,2,null,6,7,8]);
    done();
  });

  it('truncated page list 4', function(done) {
    expect(truncatePageList(10,5,6)).to.deep.equal([1,null,5,6,7,null,10]);
    done();
  });

  it('truncated page list 5', function(done) {
    expect(truncatePageList(9,5,7)).to.deep.equal([1,null,6,7,8,9]);
    done();
  });

  it('truncated page list 5', function(done) {
    expect(truncatePageList(8,5,6)).to.deep.equal([1,null,5,6,7,8]);
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

  it('shallow search 4', function(done) {
    expect(shallowSearch([{ name: 'John', name: "Bob" }], 'o')).to.deep.equal([{ name: 'John', name: "Bob" }]);
    done();
  });

  it('shallow search 5', function(done) {
    expect(shallowSearch([{ name: 'John', name: "Bob" }], 'b')).to.deep.equal([{ name: "Bob" }]);
    done();
  });

  // items, per, maxPages
  it('results pagination', function(done) {
    expect(pages([1,2,3,4,5,6,7], 3, 2)).to.deep.equal([[1,2,3], [4,5,6]]);
    done();
  });

  it('results pagination', function(done) {
    expect(pages([1,2,3,4,5], 4, 2)).to.deep.equal([[1,2,3,4], [5]]);
    done();
  });

  it('table paginator search and sort', function(done) {
    let columns = [{ headerText: 'Name', display: (n) => n }],
      items = ['John', 'Jane', 'Bob', 'Ann']
    let wrapper = renderWithDom(<TablePaginator columns={columns} items={items} />, { config: { themeColor: 'blue' } });
    expect(wrapper.find('table')).to.have.lengthOf(1);
    expect(wrapper.find('table tr')).to.have.lengthOf(5);
    expect(wrapper.find('input')).to.have.lengthOf(1);
    act(function() {
      wrapper.find('input').at(0).props().onInput({
        target: { value: 'B' }
      })
    });
    wrapper.update();
    expect(wrapper.find('table tr')).to.have.lengthOf(2);
    expect(wrapper.find('table tr').at(1).text()).to.deep.equal("Bob");
    act(function() {
      wrapper.find('input').at(0).props().onInput({
        target: { value: 'J' }
      });
      wrapper.find('thead td').at(0).props().onClick({});
      wrapper.find('thead td').at(0).props().onClick({});
    });
    wrapper.update();
    expect(wrapper.find('table tr')).to.have.lengthOf(3);
    expect(wrapper.find('table tr').at(1).text()).to.deep.equal("Jane");
    done();
  });
});

describe('Fedora tests', function() {
  it('works', function(done) {
    let wrapper = mount(<HeadContextProvider>
      <Fedora title="My Website" description='Welcome to my website!' />
    </HeadContextProvider>, { attachTo: document.body });
    expect(document.title).to.deep.equal('My Website');
    wrapper.detach();
    done();
  });
})

describe('Routing Related', function() {
  it('same page anchor', function(done) {
    let wrapper = renderFromCss(<TheStaticRouter basename=''>
      <TheSwitch>
        <TheRoute exact={true} path='/sitemap.html' component={() => {
          return <SamePageAnchor href='/'>Home</SamePageAnchor>;
        }}/>
        <TheRoute path='/' exact={true} component={() => {
          return <SamePageAnchor href='/sitemap.html'>Sitemap</SamePageAnchor>;
        }}/>
      </TheSwitch>
    </TheStaticRouter>, { attachTo: document.body });
    expect(wrapper.find('a')).to.have.lengthOf(1);
    act(function() {
      wrapper.find('a').at(0).props().onClick({
        preventDefault: () => {}
      });
    });
    wrapper.update();
    expect(wrapper.find('a')).to.have.lengthOf(1);
    wrapper.detach();
    done();
  });

  it('not found page', function(done) {
    let wrapper = mount(<NotFound/>);
    expect(wrapper.find('h1')).to.have.lengthOf(1);
    expect(wrapper.find('h1').text()).to.deep.equal('Not Found');
    expect(wrapper.find('p')).to.have.lengthOf(1);
    expect(wrapper.find('p').text()).to.deep.equal("We're sorry, but the page you requested could not be found.");
    done();
  });
});
