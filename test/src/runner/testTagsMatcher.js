const expect = require('chai').expect;
const path = require('path');
const common = require('../../common.js');
const TagsMatcher = common.require('runner/matchers/tags.js');

describe('test TagsMatcher', function() {

  describe('reading tag settings', function() {
    const testCases = [
      ['undefined', undefined, []],
      ['null', null, []],
      ['empty string', '', []],
      ['string with one tag', 'a', ['a']],
      ['string with multiple tags', 'a,b,c', ['a', 'b', 'c']],
      ['empty array', [], []],
      ['array with one tag', ['a'], ['a']],
      ['array with multiple tags', ['a','b','c'], ['a', 'b', 'c']],
    ];

    testCases.forEach(([description, given, expected]) => {
      it(`${description}`, function() {
        const result = TagsMatcher.convertTags(given);
        expect(result).to.deep.equal(expected);
      });
    });
  });

  it('tag: test matching tags', function() {
    let tags = ['home', 'login', 'sign-up'];
    let testModule = {
      tags: ['home', 'siberia']
    };

    let matcher = new TagsMatcher({
      tag_filter: tags
    });
    let matched = matcher.checkModuleTags(testModule);

    expect(matched).to.equal(true);
  });

  it('tag: test non-matching tags', function() {
    let tags = ['home', 'login', 'sign-up'];
    let testModule = {
      tags: ['boroboro', 'siberia']
    };

    let matcher = new TagsMatcher({
      tag_filter: tags
    });
    let matched = matcher.checkModuleTags(testModule);

    expect(matched).to.equal(false);
  });

  it('tag: test undefined tags', function() {
    let tags = ['home', 'login', 'sign-up'];
    let testModule = {};

    let matcher = new TagsMatcher({
      tag_filter: tags
    });
    let matched = matcher.checkModuleTags(testModule);

    expect(matched).to.equal(false);
  });

  it('tag: test loading module with tags', function() {
    let tags = ['home', 'login', 'sign-up'];

    let matcher = new TagsMatcher({
      tag_filter: tags
    });
    let matched = matcher.match(path.join(__dirname, '../../sampletests/tags/sample.js'));

    expect(matched).to.equal(true);
  });

  it('tag: test loading modules containing an error should not be silent', function() {
    let tags = ['home', 'login', 'sign-up'];
    let matcher = new TagsMatcher({
      tag_filter: tags
    });
    let matched = matcher.match(path.join(__dirname, '../../extra/mock-errors/sample-error.js'));

    expect(matched).to.equal(false);
  });

  it('tag: test matching numeric tags', function() {
    let tags = ['room', 101];
    let testModule = {
      tags: ['101']
    };

    let matcher = new TagsMatcher({
      tag_filter: tags
    });
    let matched = matcher.checkModuleTags(testModule);
    expect(matched).to.equal(true);
  });

  it('tag: test matching numeric tags single', function() {
    let tags = 101;
    let testModule = {
      tags: ['101']
    };

    let matcher = new TagsMatcher({
      tag_filter: tags
    });
    let matched = matcher.checkModuleTags(testModule);
    expect(matched).to.equal(true);
  });

  it('skiptag test not matching', function() {
    let matcher = new TagsMatcher({
      skiptags: ['101']
    });
    let matched = matcher.checkModuleTags({
      tags: ['room', 101]
    });

    expect(matched).to.equal(false);
  });

  it('skiptag test matching', function() {
    let matcher = new TagsMatcher({
      skiptags: ['other']
    });
    let matched = matcher.checkModuleTags({
      tags: ['room', 101]
    });

    expect(matched).to.equal(true);
  });

  it('skiptag test matching - undefined local tags', function() {
    let matcher = new TagsMatcher({
      skiptags: ['other']
    });
    let matched = matcher.checkModuleTags({});

    expect(matched).to.equal(true)
  });

  it('skiptag test loading module with matching tags', function() {
    let matcher = new TagsMatcher({
      skiptags: ['login']
    });
    let matched = matcher.match(path.join(__dirname, '../../sampletests/tags/sample.js'));

    expect(matched).to.equal(false);
  });

  it('skiptag test loading module with no tags', function() {
    let matcher = new TagsMatcher({
      skiptags: ['login']
    });
    let matched = matcher.match(path.join(__dirname, '../../sampletests/simple/test/sample.js'));

    expect(matched).to.equal(true)
  });

  it('tag filter does not find module, but skiptag does and excludes it', function() {
    let matcher = new TagsMatcher({
      tag_filter: ['other'],
      skiptags: ['101']
    });
    let matched = matcher.checkModuleTags({
      tags: ['room', 101]
    });

    expect(matched).to.equal(false);
  });

  it('tag filter finds module, skiptag also does and excludes it', function() {
    let matcher = new TagsMatcher({
      tag_filter: ['room'],
      skiptags: ['101']
    });
    let matched = matcher.checkModuleTags({
      tags: ['room', 101]
    });

    expect(matched).to.equal(false);
  });

  it('tag filter finds module, and skiptag does not', function() {
    let matcher = new TagsMatcher({
      tag_filter: ['room'],
      skiptags: ['other']
    });
    let matched = matcher.checkModuleTags({
      tags: ['room', 101]
    });

    expect(matched).to.equal(true);
  });
});