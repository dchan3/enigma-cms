import { expect } from 'chai';
import { default as ogMurmur } from 'murmurhash-js/murmurhash3_gc';
import { murmur as newMurmur } from '../addons/murmur/build/Release/murmur';

describe('Murmur', function () {
  it("works", function(done) {
    var str = "B";
    expect(newMurmur(str)).to.equal(ogMurmur(str));
    done();
  });

  it("works", function(done) {
    var str = "Eat my shorts";
    expect(newMurmur(str)).to.equal(ogMurmur(str));
    done();
  });

  it("works", function(done) {
    var str = "";
    expect(newMurmur(str)).to.equal(ogMurmur(str));
    done();
  });

  it("works", function(done) {
    var str = "KEKW";
    expect(newMurmur(str)).to.equal(ogMurmur(str));
    done();
  });
});
