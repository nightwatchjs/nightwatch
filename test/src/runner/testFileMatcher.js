var assert = require('assert');
var path = require('path');
var common = require('../../common.js');
var FileMatcher = common.require('runner/filematcher.js');

module.exports = {
  'test FileMatcher' : {

    'tag: test matching tags': function () {
      var tags = ['home', 'login', 'sign-up'];
      var testModule = {
        tags: ['home', 'siberia']
      };

      var matched = FileMatcher.tags.checkModuleTags(testModule, {
        tag_filter: tags
      });

      assert.ok(matched === true);
    },

    'tag: test non-matching tags': function () {
      var tags = ['home', 'login', 'sign-up'];
      var testModule = {
        tags: ['boroboro', 'siberia']
      };

      var matched = FileMatcher.tags.checkModuleTags(testModule, {
        tag_filter: tags
      });

      assert.ok(matched === false);
    },

    'tag: test undefined tags': function () {
      var tags = ['home', 'login', 'sign-up'];
      var testModule = {};

      var matched = FileMatcher.tags.checkModuleTags(testModule, {
        tag_filter: tags
      });

      assert.ok(matched === false);
    },

    'tag: test loading module with tags': function () {
      var tags = ['home', 'login', 'sign-up'];

      var matched = FileMatcher.tags.match(path.join(__dirname, '../../sampletests/tags/sample.js'), {
        tag_filter: tags
      });

      assert.ok(matched === true);
    },

    'tag: test loading modules containing an error should not be silent': function () {
      var errorThrown;

      try {
        var tags = ['home', 'login', 'sign-up'];
        FileMatcher.tags.match(path.join(__dirname, '../../mock-errors/sample-error.js'), {
          tag_filter: tags
        });
      } catch(err) {
        errorThrown = err;
      }
      assert.ok(errorThrown instanceof Error);
    },

    'tag: test matching numeric tags': function () {
      var tags = ['room', 101];
      var testModule = {
        tags: ['101']
      };

      var matched = FileMatcher.tags.checkModuleTags(testModule, {
        tag_filter: tags
      });
      assert.ok(matched === true);
    },

    'tag: test matching numeric tags single': function () {
      var tags = 101;
      var testModule = {
        tags: ['101']
      };

      var matched = FileMatcher.tags.checkModuleTags(testModule, {
        tag_filter: tags
      });
      assert.ok(matched === true);
    },

    'skiptag test not matching': function () {
      var matched = FileMatcher.tags.checkModuleTags({
        tags: ['room', 101]
      }, {
        skiptags: ['101']
      });

      assert.ok(matched === false);
    },

    'skiptag test matching': function () {
      var matched = FileMatcher.tags.checkModuleTags({
        tags: ['room', 101]
      }, {
        skiptags: ['other']
      });

      assert.ok(matched === true);
    },

    'skiptag test matching - undefined local tags': function () {
      var matched = FileMatcher.tags.checkModuleTags({}, {
        skiptags: ['other']
      });

      assert.ok(matched === true);
    },

    'skiptag test loading module with matching tags': function () {
      var matched = FileMatcher.tags.match(path.join(__dirname, '../../sampletests/tags/sample.js'), {
        skiptags: ['login']
      });

      assert.ok(matched === false);
    },

    'skiptag test loading module with no tags': function () {
      var matched = FileMatcher.tags.match(path.join(__dirname, '../../sampletests/simple/sample.js'), {
        skiptags: ['login']
      });

      assert.ok(matched === true);
    },

    'tag filter does not find module, but skiptag does and excludes it': function () {
      var matched = FileMatcher.tags.checkModuleTags({
        tags: ['room', 101]
      }, {
        tag_filter: ['other'],
        skiptags: ['101']
      });

      assert.ok(matched === false);
    },

    'tag filter finds module, skiptag also does and excludes it': function () {
      var matched = FileMatcher.tags.checkModuleTags({
        tags: ['room', 101]
      }, {
        tag_filter: ['room'],
        skiptags: ['101']
      });

      assert.ok(matched === false);
    },

    'tag filter finds module, and skiptag does not': function () {
      var matched = FileMatcher.tags.checkModuleTags({
        tags: ['room', 101]
      }, {
        tag_filter: ['room'],
        skiptags: ['other']
      });

      assert.ok(matched === true);
    }
  }
};
