const assert = require('assert');
const path = require('path');
const common = require('../../../common.js');
const NightwatchClient = common.require('index.js');

describe('Test CLI Runner in Sequential Mode', function () {
  const testPath = path.join(__dirname, '../../../sampletests/async/test/sample.js');
  const processArgs = process.argv;

  afterEach(function(){
    delete require.cache[require.resolve('../../../../lib/runner/cli/argv-setup.js')];
    process.argv = processArgs;
  })
  
  it('Passed array of environments to check sequential mode enabled', function () {
    process.argv = [
      ...processArgs,
      '-e', 'safari',
      '-e', 'chrome'
    ]
    NightwatchClient.cli(function(argv) {
      let runner = NightwatchClient.CliRunner({...argv, source: testPath});
      assert.strictEqual(argv.sequential, true);
    })
  });

  it('Passed strings of environments to check sequential mode disabled', function () {
    process.argv = [
      ...processArgs,
      '-e', 'safari,chrome'
    ]
    NightwatchClient.cli(function(argv) {
      let runner = NightwatchClient.CliRunner({...argv, source: testPath});
      assert.strictEqual(argv.sequential, false);
    })
  });

  it('To check if parallel mode enabled', function(){
    process.argv = [
      ...processArgs,
      '-e', 'safari',
      '-e', 'chrome',
      '--parallel'
    ]

    assert.throws(function() {
      NightwatchClient.cli(function(argv) {
        NightwatchClient.CliRunner({...argv, source: testPath});
      })
    }, /Error: Sequential and parallel modes are not yet supported together./);
  })
});
