import { expect } from 'chai';
import { default as gensig } from '../src/lib/utils/gensig';
import matchThePath,
{ returnPathKeys } from '../src/lib/utils/match_the_path';

describe('Signature Generator', function () {
  it('generates signatures correctly', function (done) {
    var obj = { a: 5, b: 4 }, regex = /#[\da-f]{6} #[\da-f]{6}/;
    expect(gensig(obj)).to.match(regex);
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

  it('path matcher 4', function(done) {
    let actual = matchThePath('/admin/configbruh', {
      path: '/admin/config'
    });
    expect(actual).to.equal(null);
    done();
  });

  it('path matcher 5', function(done) {
    let actual = matchThePath('/lol', {
      path: '*'
    });
    expect(actual).to.deep.equal({
      path: '*',
      url: '/lol',
      params: {}
    });
    done();
  });

  it('path matcher 6', function(done) {
    let actual = matchThePath('/dude', {
      path: '/'
    });
    expect(actual).to.equal(null);
    done();
  });

  it('path matcher 7', function(done) {
    let actual = matchThePath('/:slug', {
      path: '/documents/lol'
    });
    expect(actual).to.equal(null);
    done();
  });

  it('path matcher 8', function(done) {
    let actual = matchThePath('/', {
      path: '/'
    });
    expect(actual).to.deep.equal({
      path: '/',
      url: '/',
      params: {}
    });
    done();
  });

  it('path matcher 9', function(done) {
    let actual = matchThePath('/admin', {
      path: '/admin',
      exact: true
    });
    expect(actual).to.deep.equal({
      path: '/admin',
      url: '/admin',
      params: {}
    });
    done();
  });
});
