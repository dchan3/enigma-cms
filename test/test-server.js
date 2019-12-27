import { expect } from 'chai';
import { default as createReverseIndex }
  from '../src/server/utils/create_reverse_index';
import TemplateParser from '../src/server/utils/template_parser';

describe('Reverse Index function', function() {
  it ('works as desired', function(done) {
    var actual = createReverseIndex('Hello World'),
      expected = { 'Hello': [0], 'World': [6] };
    expect(actual).to.deep.equal(expected);
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
