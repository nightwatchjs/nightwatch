const expect = require('@nightwatch/chai').expect;
const path = require('path');
const common = require('../../common.js');
const TagsMatcher = common.require('runner/matchers/tags.js');

describe('test TagsMatcher', function() {
  describe('reading module tags and skiptags from settings', function() {
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
      ['array with multiple tags', ['a', 'B', 'c', 777], ['a', 'b', 'c', '777']]
    ];

    testCases.forEach(([description, given, expected]) => {
      it(`${description}`, function() {
        const result = TagsMatcher.convertTags(given);
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe('reading filter tags from settings', function () {
    const testCases = [
      ['undefined', undefined, []],
      ['null', null, []],
      ['empty string', '', []],
      ['empty array', [], []],
      ['number', 777, [['777']]],
      ['number array: --tag 777 --tag 888', [777, 888], [['777'], ['888']]],
      ['string with one tag: --tag a', 'a', [['a']]],
      ['AND tags: --tag A,b,C,777', 'A,b,C,777', [['a', 'b', 'c', '777']]],
      ['OR tags: --tag A --tag b --tag C --tag 777', ['A', 'b', 'C', '777'], [['a'], ['b'], ['c'], ['777']]],
      ['AND and OR tags: --tag A,b --tag c,D --tag e,777', ['A,b', 'c,D', 'e,777'], [['a', 'b'], ['c', 'd'], ['e', '777']]]
    ];

    testCases.forEach(([description, given, expected]) => {
      it(`${description}`, function () {
        const result = TagsMatcher.convertFilterTags(given);
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
        true
      ],
      [
        'matching single filter tag',
        ['home', 'login', 'sign-up'],
        ['home'],
        undefined,
        true
      ],
      [
        'multiple filter tags as AND match',
        ['home', 'login', 'siberia', 'sign-up'],
        ['home,siberia'],
        undefined,
        true
      ],
      [
        'multiple filter tags as AND do not match',
        ['home', 'login', 'sign-up'],
        ['home,siberia'],
        undefined,
        false
      ],
      [
        'non-matching tags',
        ['boroboro', 'siberia'],
        ['home', 'login', 'sign-up'],
        undefined,
        false
      ],
      [
        'undefined module tags',
        undefined,
        ['home', 'login', 'sign-up'],
        undefined,
        false
      ],
      [
        'numeric tags',
        ['101'],
        ['room', 101],
        undefined,
        true
      ],
      [
        'numeric tags single',
        ['101'],
        101,
        undefined,
        true
      ],
      [
        'skiptag not matching',
        ['room', 101],
        undefined,
        ['101'],
        false
      ],
      [
        'skiptag matching',
        ['room', 101],
        undefined,
        ['other'],
        true
      ],
      [
        'skiptag matching - undefined local tags',
        undefined,
        undefined,
        ['other'],
        true
      ],
      [
        'tag filter does not find module, but skiptag does and excludes it',
        ['room', 101],
        ['other'],
        ['101'],
        false
      ],
      [
        'tag filter does not find module, and skiptag does not and excludes it',
        ['room', 101],
        ['other'],
        ['777'],
        false
      ],
      [
        'tag filter finds module, skiptag also does and excludes it',
        ['room', 101],
        ['room'],
        ['101'],
        false
      ],
      [
        'tag filter finds module, and skiptag does not',
        ['room', 101],
        ['room'],
        ['other'],
        true
      ]
    ];
    testCases.forEach(([description, moduleTags, tag_filter, skiptags, expected]) => {
      it(`${description}`, function () {
        const matcher = new TagsMatcher({
          tag_filter: tag_filter,
          skiptags: skiptags
        });

        const context = {
          getTags() {
            return moduleTags;
          }
        };

        const matched = matcher.checkModuleTags(context);

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
        true
      ],
      [
        'module with tags single filter tag',
        'sampletests/tags/sample.js',
        ['login'],
        undefined,
        true
      ],
      [
        'module with tags multiple AND filter tags',
        'sampletests/tags/sample.js',
        ['login,other'],
        undefined,
        true
      ],
      [
        'loading modules containing an error should not be silent',
        'extra/mock-errors/sample-error.js',
        ['home', 'login', 'sign-up'],
        undefined,
        false
      ],
      [
        'skiptag test loading module with matching tags',
        'sampletests/tags/sample.js',
        undefined,
        ['login'],
        false
      ],
      [
        'skiptag test loading module with no tags',
        'sampletests/simple/test/sample.js',
        undefined,
        ['login'],
        true
      ]
    ];

    testCases.forEach(([description, modulePath, tag_filter, skiptags, expected]) => {
      it(description, async function () {
        const fullModulePath = path.join(__dirname, '../../' + modulePath);

        const matcher = new TagsMatcher({
          tag_filter: tag_filter,
          skiptags: skiptags
        });

        const matched = await matcher.match(fullModulePath);

        expect(matched).to.equal(expected);
      });
    });
  });
});
