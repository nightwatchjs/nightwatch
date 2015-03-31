var BASE_PATH = process.env.NIGHTWATCH_COV
  ? 'lib-cov'
  : 'lib';
var matcher = require('../../../'+ BASE_PATH +'/runner/filematcher.js');

module.exports = {
  'tag: test matching tags': function (test) {
    var tags = ['home', 'login', 'sign-up'];
    var testModule = {
      tags: ['home', 'siberia']
    };

    var matched = matcher.tags.checkModuleTags(testModule, tags);

    test.ok(matched === true);
    test.done();
  },

  'tag: test non-matching tags': function (test) {
    var tags = ['home', 'login', 'sign-up'];
    var testModule = {
      tags: ['boroboro', 'siberia']
    };

    var matched = matcher.tags.checkModuleTags(testModule, tags);

    test.ok(matched === false);
    test.done();
  },

  'tag: test undefined tags': function (test) {
    var tags = ['home', 'login', 'sign-up'];
    var testModule = {};

    var matched = matcher.tags.checkModuleTags(testModule, tags);

    test.ok(matched === false);
    test.done();
  },

  'tag: test loading module with tags': function (test) {
    var tags = ['home', 'login', 'sign-up'];


    var matched = matcher.tags.match(__dirname + '/../../sampletests/tags/sample.js', tags);

    test.ok(matched === true);
    test.done();
  }
};
