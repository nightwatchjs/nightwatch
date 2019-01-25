const expect = require('chai').expect;
const path = require('path');
const common = require('../../common.js');
const TagsMatcher = common.require('runner/matchers/tags.js');

describe('test TagsMatcher', function() {

  describe('reading tag settings', function() {
    const testCases = [
      ['undefined', undefined, []],
      ['null', null, []],
      ['number', 777, ['777']],
      ['number array', [777, 888], ['777', '888']],
      ['empty string', '', []],
      ['string with one tag', 'a', ['a']],
      ['string with multiple tags', 'A,b,C,777', ['a', 'b', 'c', '777']],
      ['empty array', [], []],
      ['array with one tag', ['a'], ['a']],
      ['array with multiple tags', ['a','B','c', 777], ['a', 'b', 'c', '777']],
    ];

    testCases.forEach(([description, given, expected]) => {
      it(`${description}`, function() {
        const result = TagsMatcher.convertTags(given);
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe('matching', function () {
    const testCases = [
      [
        'matching tags',
        ['home', 'login', 'sign-up'],
        ['home', 'siberia'],
        undefined,
        true,
      ],
      [
        'non-matching tags',
        ['boroboro', 'siberia'],
        ['home', 'login', 'sign-up'],
        undefined,
        false,
      ],
      [
        'undefined module tags',
        undefined,
        ['home', 'login', 'sign-up'],
        undefined,
        false,
      ],
      [
        'numeric tags',
        ['101'],
        ['room', 101],
        undefined,
        true,
      ],
      [
        'numeric tags single',
        ['101'],
        101,
        undefined,
        true,
      ],
      [
        'skiptag not matching',
        ['room', 101],
        undefined,
        ['101'],
        false,
      ],
      [
        'skiptag matching',
        ['room', 101],
        undefined,
        ['other'],
        true,
      ],
      [
        'skiptag matching - undefined local tags',
        undefined,
        undefined,
        ['other'],
        true,
      ],
      [
        'tag filter does not find module, but skiptag does and excludes it',
        ['room', 101],
        ['other'],
        ['101'],
        false,
      ],
      [
        'tag filter does not find module, and skiptag does not and excludes it',
        ['room', 101],
        ['other'],
        ['777'],
        false,
      ],
      [
        'tag filter finds module, skiptag also does and excludes it',
        ['room', 101],
        ['room'],
        ['101'],
        false,
      ],
      [
        'tag filter finds module, and skiptag does not',
        ['room', 101],
        ['room'],
        ['other'],
        true,
      ],
    ];
    testCases.forEach(([description, moduleTags, tag_filter, skiptags, expected]) => {
      it(`${description}`, function () {
        const testModule = {
          tags: moduleTags
        };

        const matcher = new TagsMatcher({
          tag_filter: tag_filter,
          skiptags: skiptags,
        });

        const matched = matcher.checkModuleTags(testModule);

        expect(matched).to.equal(expected);
      });
    });
  });

  describe('loading and matching', function(){
    const testCases = [
      [
        'module with tags',
        'sampletests/tags/sample.js',
        ['home', 'login', 'sign-up'],
        undefined,
        true,
      ],
      [
        'loading modules containing an error should not be silent',
        'extra/mock-errors/sample-error.js',
        ['home', 'login', 'sign-up'],
        undefined,
        false,
      ],
      [
        'skiptag test loading module with matching tags',
        'sampletests/tags/sample.js',
        undefined,
        ['login'],
        false,
      ],
      [
        'skiptag test loading module with no tags',
        'sampletests/simple/test/sample.js',
        undefined,
        ['login'],
        true,
      ],
    ];

    testCases.forEach(([description, modulePath, tag_filter, skiptags, expected]) => {
      it(`${description}`, function () {
        const fullModulePath = path.join(__dirname, '../../' + modulePath);

        const matcher = new TagsMatcher({
          tag_filter: tag_filter,
          skiptags: skiptags,
        });

        const matched = matcher.match(fullModulePath);

        expect(matched).to.equal(expected);
      });
    });
  });
});
