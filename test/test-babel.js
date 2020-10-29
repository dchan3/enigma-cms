import { transform } from "@babel/core";
import chai, { expect } from 'chai';
import pluginTester from 'babel-plugin-tester';
import unitify from '../babel/unitify-react';
import commonStrings from '../babel/common-strings';
import forify from '../babel/forify';

describe('Unitify', function() {
  it('functions correctly', function(done) {
    var allGud = true;
    pluginTester({
      plugin: unitify,
      tests: [{
        code: 'var react = _react2;',
        output: 'var react = _react;',
        snapshot: false,
        error: false
      }, {
        code: 'var react = _react2.default;',
        output: 'var react = _react.default;',
        snapshot: false,
        error: false
      }]
    });
    expect(allGud).to.equal(true);
    done();
  });
});

describe('Common Strings', function() {
  it('functions correctly', function(done) {
    var allGud = true;
    pluginTester({
      plugin: commonStrings,
      babelOptions: {
        plugins: [
          "@babel/plugin-transform-react-jsx",
        ],
        comments: false
      },
      tests: [{
        code: 'React.createElement("div");',
        output: 'React[造](分);',
        snapshot: false,
        error: false
      },
      {
        code: '<div></div>',
        output: 'React[造](分, 零);',
        snapshot: false,
        error: false
      }]
    });
    expect(allGud).to.equal(true);
    done();
  });
});

describe('Forify', function() {
  it('functions correctly', function(done) {
    var allGud = true;
    pluginTester({
      plugin: forify,
      babelOptions: {
        comments: false,
        babelrc: false,
        sourceType: 'script'
      },
      tests: [
      {
        code: 'function p(array) { array.forEach(parseInt); }',
        output: 'function p(array) {\n  for (item of array) parseInt(item);\n}',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(console.log);',
        output: 'for (item of array) console.log(item);',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(function(i) { console.log(i); });',
        output: 'for (i of array) {\n  console.log(i);\n}',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(function(i, n) { console.log(i, n); });',
        output: 'for (n in array) {\n  if (n !== "length") {\n    let i = array[n];\n    console.log(i, n);\n  }\n}',
        snapshot: false,
        error: false
      }]
    });
    expect(allGud).to.equal(true);
    done();
  });
});
