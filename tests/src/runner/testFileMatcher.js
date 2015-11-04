
var BASE_PATH = process.env.NIGHTWATCH_COV ? 'lib-cov' : 'lib';
var matcher = require('../../../'+ BASE_PATH +'/runner/filematcher.js');

module.exports = {
  'tag: test matching tags': function (test) {
    var tags = ['home', 'login', 'sign-up'];
    var testModule = {
      tags: ['home', 'siberia']
    };

    var matched = matcher.tags.checkModuleTags(testModule, {
      tag_filter : tags
    });

    test.ok(matched === true);
    test.done();
  },

  'tag: test non-matching tags': function (test) {
    var tags = ['home', 'login', 'sign-up'];
    var testModule = {
      tags: ['boroboro', 'siberia']
    };

    var matched = matcher.tags.checkModuleTags(testModule, {
      tag_filter : tags
    });

    test.ok(matched === false);
    test.done();
  },

  'tag: test undefined tags': function (test) {
    var tags = ['home', 'login', 'sign-up'];
    var testModule = {};

    var matched = matcher.tags.checkModuleTags(testModule, {
      tag_filter : tags
    });

    test.ok(matched === false);
    test.done();
  },

  'tag: test loading module with tags': function (test) {
    var tags = ['home', 'login', 'sign-up'];

    var matched = matcher.tags.match(__dirname + '/../../sampletests/tags/sample.js', {
      tag_filter : tags
    });

    test.ok(matched === true);
    test.done();
  },

  'tag: test matching numeric tags': function (test) {
    var tags = ['room', 101];
    var testModule = {
      tags: ['101']
    };

    var matched = matcher.tags.checkModuleTags(testModule, {
      tag_filter : tags
    });
    test.ok(matched === true);
    test.done();
  },

  'tag: test matching numeric tags single': function (test) {
    var tags = 101;
    var testModule = {
      tags: ['101']
    };

    var matched = matcher.tags.checkModuleTags(testModule, {
      tag_filter : tags
    });
    test.ok(matched === true);
    test.done();
  },

  'skiptag test not matching' : function(test) {
    var matched = matcher.tags.checkModuleTags({
      tags: ['room', 101]
    }, {
      skiptags : ['101']
    });

    test.ok(matched === false);
    test.done();
  },

  'skiptag test matching' : function(test) {
    var matched = matcher.tags.checkModuleTags({
      tags: ['room', 101]
    }, {
      skiptags : ['other']
    });

    test.ok(matched === true);
    test.done();
  },

  'skiptag test matching - undefined local tags' : function(test) {
    var matched = matcher.tags.checkModuleTags({}, {
      skiptags : ['other']
    });

    test.ok(matched === true);
    test.done();
  },

  'skiptag test loading module with matching tags' : function(test) {
    var matched = matcher.tags.match(__dirname + '/../../sampletests/tags/sample.js', {
      skiptags : ['login']
    });

    test.ok(matched === false);
    test.done();
  },

  'skiptag test loading module with no tags' : function(test) {
    var matched = matcher.tags.match(__dirname + '/../../sampletests/simple/sample.js', {
      skiptags : ['login']
    });

    test.ok(matched === true);
    test.done();
  },

  'tag filter does not find module, but skiptag does and excludes it' : function(test) {
    var matched = matcher.tags.checkModuleTags({
      tags: ['room', 101]
    }, {
      tag_filter : ['other'],
      skiptags : ['101']
    });

    test.ok(matched === false);
    test.done();
  },

  'tag filter finds module, skiptag also does and excludes it' : function(test) {
    var matched = matcher.tags.checkModuleTags({
      tags: ['room', 101]
    }, {
      tag_filter : ['room'],
      skiptags : ['101']
    });

    test.ok(matched === false);
    test.done();
  },

  'tag filter finds module, and skiptag does not' : function(test) {
    var matched = matcher.tags.checkModuleTags({
      tags: ['room', 101]
    }, {
      tag_filter : ['room'],
      skiptags : ['other']
    });

    test.ok(matched === true);
    test.done();
  }
};
