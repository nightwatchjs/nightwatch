const assert = require('assert');
const BaseCommandLoader = require('../../../../lib/api/_loaders/_command-loader.js');

describe('BaseCommandLoader - Duplicate Command Error', function () {
  it('should throw an error with file paths when duplicate commands are defined', function () {
    // Create two instances of the command loader to simulate commands from two different files
    const loader1 = new BaseCommandLoader({});
    loader1.fileName = '/path/to/firstFile.js';
    loader1.commandName = 'testCommand';
    loader1.namespace = 'testNamespace';

    const loader2 = new BaseCommandLoader({});
    loader2.fileName = '/path/to/secondFile.js';
    loader2.commandName = 'testCommand';
    loader2.namespace = 'testNamespace';

    // Validate the first command, it should register without issues
    loader1.validateMethod(null);

    // The second command should throw a detailed error
    assert.throws(
      () => loader2.validateMethod(null),
      (err) => {
        assert.ok(err instanceof TypeError);
        assert.ok(err.message.includes('testNamespace.testCommand'));
        assert.ok(err.message.includes('/path/to/firstFile.js'));
        assert.ok(err.message.includes('/path/to/secondFile.js'));

        return true;
      }
    );
  });

  it('should not throw an error for commands in different namespaces', function () {
    const loader1 = new BaseCommandLoader({});
    loader1.fileName = '/path/to/firstFile.js';
    loader1.commandName = 'testCommand';
    loader1.namespace = 'namespace1';

    const loader2 = new BaseCommandLoader({});
    loader2.fileName = '/path/to/secondFile.js';
    loader2.commandName = 'testCommand';
    loader2.namespace = 'namespace2';

    // Both commands should register without issues
    assert.doesNotThrow(() => loader1.validateMethod(null));
    assert.doesNotThrow(() => loader2.validateMethod(null));
  });
});
