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
      }, 
      {
        code: 'console.log(window["location"] === undefined);',
        output: 'console.log(window[點] === 冇);',
        snapshot: false,
        error: false
      }, {
        code: 'let obj = {"className": "lol"};',
        output: 'let obj = {\n  [類]: "lol"\n};',
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
        output: 'function p(array) {\n  for (let item of array) parseInt(item);\n}',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(console.log);',
        output: 'for (let item of array) console.log(item);',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(function(i) { console.log(i); });',
        output: 'for (let i of array) {\n  console.log(i);\n}',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(function(i, n) { console.log(i, n); });',
        output: 'for (let n in array) {\n  if (n !== "length") {\n    let i = array[n];\n    console.log(i, n);\n  }\n}',
        snapshot: false,
        error: false
      },
      {
          code: 'array.forEach(function({ i }) { console.log(i); });',
          output: 'for (let { i } of array) {\n  console.log(i);\n}',
          snapshot: false,
          error: false
      },
      {
        code: 'array.forEach(function({ h, k }) { console.log(h, k); });',
        output: 'for (let { h, k } of array) {\n  console.log(h, k);\n}',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(function({ j: i }) { console.log(i); });',
        output: 'for (let { j: i } of array) {\n  console.log(i);\n}',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(function({ h, k }, n) { console.log(h, k, n); });',
        output: 'for (let n in array) {\n  if (n !== "length") {\n    let { h, k } = array[n];\n    console.log(h, k, n);\n  }\n}',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(function({ h, i: { j, k } }, n) { console.log(h, j, k, n); });',
        output: 'for (let n in array) {\n  if (n !== "length") {\n    let {\n      h,\n      i: { j, k },\n    } = array[n];\n    console.log(h, j, k, n);\n  }\n}',
        snapshot: false,
        error: false
      },
      {
        code: 'array.forEach(function({ h, i: k }, n) { console.log(h, k, n); });',
        output: 'for (let n in array) {\n  if (n !== "length") {\n    let { h, i: k } = array[n];\n    console.log(h, k, n);\n  }\n}',
        snapshot: false,
        error: false
      }]
    });
    expect(allGud).to.equal(true);
    done();
  });
});
