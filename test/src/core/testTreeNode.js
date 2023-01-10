const assert = require('assert');
const EventEmitter = require('events');
const TreeNode = require('../../../lib/core/treenode');
const common = require('../../common.js');

describe('test Queue', function () {
  it('Test commands treeNode - clear error events in handleCommandResult', function () {
    const treeNode = new TreeNode({
      name: '__root__',
      parent: null
    });

    class MockCommandLoader extends EventEmitter {
      constructor() {
        super();
        this.__commandName = 'testCommand';
      }
    }

    const mockCommandLoader = new MockCommandLoader();

    treeNode.setCommand(()=>{}, mockCommandLoader, {}, {});

    treeNode.execute();
    treeNode.execute();
    treeNode.execute();

    assert.equal(mockCommandLoader.listenerCount('error'), 3);
    assert.equal(mockCommandLoader.listenerCount('complete'), 3);
    
    mockCommandLoader.emit('complete');

    assert.equal(mockCommandLoader.listenerCount('error'), 0);
    assert.equal(mockCommandLoader.listenerCount('complete'), 0);   
    
    
    treeNode.execute();
    treeNode.execute();
    treeNode.execute();

    assert.equal(mockCommandLoader.listenerCount('error'), 3);
    assert.equal(mockCommandLoader.listenerCount('complete'), 3);

    mockCommandLoader.emit('error', new Error(), false);

    assert.equal(mockCommandLoader.listenerCount('error'), 0);
    assert.equal(mockCommandLoader.listenerCount('complete'), 0);  
  });

  it('test handleError - set abortOnFailure to false in debug mode', function () {
    const treeNode = new TreeNode({
      name: '__root__',
      parent: null
    });
    const Debuggability = common.require('utils/debuggability');

    Debuggability.debugMode = true;
    let error = new Error('Error while executing command in debug mode');
    error.abortOnFailure = true;

    error = treeNode.handleError(error);
    assert.strictEqual(error.abortOnFailure, false);

    Debuggability.debugMode = false;
  });
});
