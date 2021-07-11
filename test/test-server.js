import { expect } from 'chai';
import { default as createReverseIndex }
  from '../src/server/utils/create_reverse_index';
import TemplateParser from '../src/server/utils/template_parser';
import { prepareDocumentsForRender } from '../src/server/utils/render_markup';
import { documentMetadataSync, profileMetadataSync } from '../src/server/utils/render_metadata';
import { gaScript, staticScript, adSenseScript } from '../src/server/routes/ssr/utils';

describe('Reverse Index function', function() {
  it ('works as desired 1', function(done) {
    var actual = createReverseIndex('Hello World'),
      expected = { 'Hello': [0], 'World': [6] };
    expect(actual).to.deep.equal(expected);
    done();
  });

  it ('works as desired 2', function(done) {
    var actual = createReverseIndex('Lol'),
      expected = { 'Lol': [0] };
    expect(actual).to.deep.equal(expected);
    done();
  });
});

describe('script tag functions', function() {
  it ('analytics script', function(done) {
    expect(gaScript('12345')).to.deep.equal(`<script>
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  gtag('js',new Date());
  gtag('config','12345');
</script>`)
    done();
  });

  it('AdSense script', function(done) {
    expect(adSenseScript('12345')).to.deep.equal('<script data-ad-client="ca-pub-12345" defer src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>')
    done();
  });

  it('static script', function (done) {
    expect(staticScript({
      'helloText': 'world'
    })).to.equal(`<script>
    window.__INITIAL_DATA__={"helloText": "world"};
  </script>`);
    done();
  });

  it('static script with attributes', function (done) {
    expect(staticScript({
      'helloText': 'world'
    }, 'defer')).to.equal(`<script defer>
    window.__INITIAL_DATA__={"helloText":"world"};
  </script>`);
    done();
  })
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

describe('document prep', function() {
  it('works', function(done) {
    let theDate = new Date(), itemList = [
      { content: {
        title: 'Lol',
        body: 'Bruh...',
      }, slug: 'lol', createdAt: theDate, editedAt: theDate }
    ];
    expect(prepareDocumentsForRender(itemList)).to.deep.equal([{
      title: 'Lol',
      body: 'Bruh...',
      slug: 'lol',
      createdAt: theDate,
      editedAt: theDate
    }])
    done();
  });

  it('document metadata', function(done) {
    let content = {
      name: 'The Movie',
      synopsis: 'This movie is great. I love it. 10 / 5 stars!',
      tags: 'why,are,you,reading,these,tags'
    }, rendered = documentMetadataSync(content);

    expect(rendered).to.deep.equal({
      title: 'The Movie',
      description: 'This movie is great. I love it. 10 / 5 stars!',
      image: '',
      keywords: 'why,are,you,reading,these,tags'
    });
    done();
  });

  it('profile metadata', function(done) {
    expect(profileMetadataSync()).to.equal(null);

    expect(profileMetadataSync({
      displayName: 'New User',
      username: 'testUser1',
      pictureSrc: 'testuser.jpg'
    })).to.deep.equal({
      title: 'New User\'s Profile',
      description: 'New User\'s Profile.',
      image: 'testuser.jpg'
    });
    done();
  });
});
