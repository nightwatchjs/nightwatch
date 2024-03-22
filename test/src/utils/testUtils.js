const assert = require('assert');
const path = require('path');
const common = require('../../common.js');
const Utils = common.require('utils');
const mockery = require('mockery');

delete require.cache['fs'];
delete require.cache['path'];

describe('test Utils', function() {

  it('testFormatElapsedTime', function() {

    const resultMs = Utils.formatElapsedTime(999);
    assert.strictEqual(resultMs, '999ms');

    const resultSec = Utils.formatElapsedTime(1999);
    assert.strictEqual(resultSec, '1.999s');

    const resultMin = Utils.formatElapsedTime(122299, true);
    assert.strictEqual(resultMin, '2m 2s / 122299ms');
  });

  it('testMakeFnAsync', function() {
    function asyncFn(cb) {
      cb();
    }

    function syncFn() {
    }

    const convertedFn = Utils.makeFnAsync(1, syncFn);
    let called = false;
    convertedFn(function() {
      called = true;
    });

    assert.strictEqual(Utils.makeFnAsync(1, asyncFn), asyncFn);
    assert.ok(called);
  });

  it('testCheckFunction', function() {
    const g = {
      fn: function() {
      }
    };

    const o = {
      fn: false
    };

    const x = {
      y: {
        testFn: function() {
        }
      }
    };

    assert.ok(Utils.checkFunction('fn', g));
    assert.ok(!Utils.checkFunction('fn', o));
    assert.ok(Utils.checkFunction('testFn', x.y));
  });

  it('testGetTestSuiteName', function() {

    assert.strictEqual(Utils.getTestSuiteName('test-case-one'), 'Test Case One');
    assert.strictEqual(Utils.getTestSuiteName('test_case_two'), 'Test Case Two');
    assert.strictEqual(Utils.getTestSuiteName('test.case.one'), 'Test Case One');
    assert.strictEqual(Utils.getTestSuiteName('testCaseOne'), 'Test Case One');
  });

  it('testFlattenArrayDeep', function() {

    assert.throws(() => {
      Utils.flattenArrayDeep(null);
    }, Error);
    assert.throws(() => {
      Utils.flattenArrayDeep({name: 'test'});
    }, Error);
    assert.throws(() => {
      Utils.flattenArrayDeep('test');
    }, Error);
  });

  it('testStripControlChars', function() {

    assert.doesNotThrow(() => Utils.stripControlChars(null));
    assert.strictEqual(
      Utils.stripControlChars('\x00rendered output'),
      'rendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars('rendered \x1Foutput'),
      'rendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars('rendered output\x7F'),
      'rendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars('\x00rendered\x1F \x1Boutput\x9F\x00'),
      'rendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars(
        '\x00rendered output\nrendered \x1Foutput\nrendered output\x7F'
      ),
      'rendered output\nrendered output\nrendered output'
    );
    assert.strictEqual(
      Utils.stripControlChars(
        '\x00rendered output\rrendered \x1Foutput\rrendered output\x7F'
      ),
      'rendered output\rrendered output\rrendered output'
    );
  });

  it('testRelativeUrl', function() {
    assert.strictEqual(Utils.relativeUrl('https://nightwatchjs.org'), false);
    assert.strictEqual(Utils.relativeUrl('http://nightwatchjs.org'), false);
    assert.strictEqual(Utils.relativeUrl('chrome-extension://pkehgijcmpdhfbdbbnkijodmdjhbjlgp/skin/options.html'), false);
    assert.strictEqual(Utils.relativeUrl('nightwatchjs.org'), true);
    assert.strictEqual(Utils.relativeUrl('nightwatchjs.org/guide'), true);
    assert.strictEqual(Utils.relativeUrl('/guide'), true);
  });

  it('isTsFile', function() {
    assert.strictEqual(Utils.isTsFile('/tests/sampleTest.ts'), true);
    assert.strictEqual(Utils.isTsFile('/tests/sampleTest.js'), false);
    assert.strictEqual(Utils.isTsFile('/tests/sampleTest.json'), false);
    assert.strictEqual(Utils.isTsFile('/tests/sampleTest'), false);
  });

  it('isFileNameValid', function() {
    assert.strictEqual(Utils.isFileNameValid('/tests/sampleTest.js'), true);
    assert.strictEqual(Utils.isFileNameValid('/tests/sampleTest.ts'), true);
    assert.strictEqual(Utils.isFileNameValid('/tests/sampleTest.json'), false);
  });

  it('readFolderRecursively with normal folder', async function(){
    const absPath = [];
    Utils.readFolderRecursively(path.join(__dirname, '../../extra/commands/other/'), [], (sourcePath, resource) => {
      absPath.push(path.join(sourcePath, resource));
    });
    assert.deepStrictEqual(absPath, [path.join(__dirname, '../../extra/commands/other/otherCommand.js')]);
  });

  it('readFolderRecursively with glob pattern', async function(){
    const absPath = [];
    Utils.readFolderRecursively(path.join(__dirname, '../../extra/commands/typescript/*.js'), [], (sourcePath, resource) => {
      absPath.push(path.join(sourcePath, resource));
    });
    assert.deepStrictEqual(absPath, [path.join(__dirname, '../../extra/commands/typescript/tsWait.js')]);
  });

  it('SafeJSON.stringify for circurlar reference objects', function() {
    const obj = {
      value: 1
    };
    obj.cirRef = obj;

    assert.strictEqual(Utils.SafeJSON.stringify(obj), '{"value":1,"cirRef":"[Circular]"}');
  });

  it('SafeJSON.stringify for Proxy objects', function() {
    
    const target = {
      value: 1
    };

    const proxyObj = new Proxy(target, {
      get(target, property) {
        return function(...args) {
          if (!target[property]){
            throw new Error('Unknown property');
          }

          return target[property];
        };
      }
    });

    assert.strictEqual(Utils.SafeJSON.stringify(proxyObj), '"[Error]"');
  });

  it('test printVersionInfo', function() {
    const semVerRegex = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?/;

    const oldConsole = console;
    const logArgs = [];

    // eslint-disable-next-line no-console
    console.log = function(args) {
      logArgs.push(args);
    };

    Utils.printVersionInfo();
    const logString = logArgs.join('\n');
    
    assert.match(logString, /Nightwatch:/);
    assert.match(logString, /version:/);
    assert.match(logString, /changelog: https:\/\/github.com\/nightwatchjs\/nightwatch\/releases\/tag\//);
    assert.match(logString, semVerRegex);

    // eslint-disable-next-line no-global-assign
    console = oldConsole;
  });

  it('test getModuleKey', function() {
    const srcFolderPath = path.join(__dirname, '../../sampletests/before-after');
    const {statSync, readdirSync} = require('fs');
    const getSrcTestsPaths = (testPath)=>{
      let fullPaths = [];
      readdirSync(testPath).forEach(file=>{
        if (statSync(path.join(testPath, file)).isDirectory()){
          fullPaths = [...fullPaths, ...getSrcTestsPaths(path.join(testPath, file))];
        } else {
          fullPaths.push(path.join(testPath, file));
        }
      });

      return fullPaths;
    };
    const currentTestPath = path.join(srcFolderPath, 'sampleSingleTest.js');
    const testFiles = getSrcTestsPaths(srcFolderPath);
    const fullPaths = testFiles.map(file=>({env: 'default', module: file}));
    assert.equal(Utils.getModuleKey(currentTestPath, testFiles, fullPaths), 'sampleSingleTest.js');
    assert.equal(Utils.getModuleKey(currentTestPath, ['test/sampletests/simple', 'test/sampletests/before-after'], fullPaths), path.join('before-after', 'sampleSingleTest.js'));
  });


  describe('test findTSConfigFile', function () {
    const {constants, rmdirSync} = require('fs');

    beforeEach(function () {
      mockery.enable({useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false});
    });

    afterEach(function () {
      mockery.deregisterAll();
      mockery.resetCache();
      mockery.disable();
    });

    it('loads default tsconfig correctly', function () {
      const tsConfigPath = path.join(__dirname, '../../typescript-tests/tsconfig.nightwatch.json');

      const tsConfigFile = Utils.findTSConfigFile(tsConfigPath);

      assert.strictEqual(tsConfigFile, tsConfigPath);
    });

    it('loads `tsconfig.nightwatch.json` correctly', function () {
      mockery.registerMock('path', {
        join: function (a, b) {
          if (b === 'tsconfig.nightwatch.json') {
            return '/path/to/tsconfig.nightwatch.json';
          }
        }
      });
      mockery.registerMock('fs', {
        statSync: function (module) {
          if (module === '/path/to/tsconfig.nightwatch.json') {
            return {
              isFile: function () {
                return true;
              }
            };
          }
          throw new Error('Does not exist');
        },
        constants,
        rmdirSync
      });

      const tsConfigPath = '/path/to/tsconfig.nightwatch.json';
      const localUtils = common.require('utils');

      const tsConfigFile = localUtils.findTSConfigFile('');

      assert.strictEqual(tsConfigFile, tsConfigPath);
    });

    it('loads `nightwatch/tsconfig.json` correctly', function () {
      mockery.registerMock('path', {
        join: function (a, b) {
          if (b === 'nightwatch') {
            return '/path/to/nightwatch/tsconfig.json';
          }
        }
      });
      mockery.registerMock('fs', {
        statSync: function (module) {
          if (module === '/path/to/nightwatch/tsconfig.json') {
            return {
              isFile: function () {
                return true;
              }
            };
          }
          throw new Error('Does not exist');
        },
        constants,
        rmdirSync
      });
      const tsConfigPath = '/path/to/nightwatch/tsconfig.json';
      const localUtils = common.require('utils');

      const tsConfigFile = localUtils.findTSConfigFile('');

      assert.strictEqual(tsConfigFile, tsConfigPath);
    });
  });
});
