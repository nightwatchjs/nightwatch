const assert = require('assert');
const EventEmitter = require('events');
const TreeNode = require('../../../lib/core/treenode');

describe('test Queue', function () {
  it('Test commands treeNode - clear error events in handleCommandResult', function () {
    const treeNode =this.__rootNode__ = new TreeNode({
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
});
