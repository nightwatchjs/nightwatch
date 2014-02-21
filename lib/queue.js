var util = require("util"),
    events = require("events"),
    Logger = require("./logger.js");

function AsyncTree() {
  events.EventEmitter.call(this);
  this.rootNode = {
    name : '__root__',
    children : [],
    started : false,
    done : false,
    parent : this.rootNode
  };
  this.currentNode = this.rootNode;
}
util.inherits(AsyncTree, events.EventEmitter);

AsyncTree.prototype.append = function(nodeName, command, context, args) {
  var node = {
      name       : nodeName,
      command    : command,
      context    : context,
      args       : args || [],
      started    : false,
      done       : false,
      children   : [],
      parent     : this.currentNode
  };
  this.currentNode.children.push(node);

  if (this.currentNode.started && !this.currentNode.done) {
    this.traverse();
  }
  this.lastCommand = null;
}

AsyncTree.prototype.walkDown = function walkDown(context) {
  var self = this;
  var node = this.getNextChild(context);

  if (node) {
    this.currentNode = node;
    this.lastCommand = this.run(node).once('complete', function onCommandComplete(command) {
      Logger.log(Logger.colors.light_gray('  - Completed command ' + Logger.colors.light_green(node.name)));
      if (command) {
        self.lastCommand = command;
      }

      // checking if new children have been added while running this command which havent finished yet
      var childrenInProgress = false;
      for (var i = 0; i < node.children.length; i++) {
        if (!node.children[i].done) {
          childrenInProgress = true;
        }
      }
      if (!childrenInProgress) {
        self.traverse();
      }
    });
  } else {
    context.done = true;
    if (this.currentNode.name == '__root__') {
      this.done();
    } else {
      this.walkUp(context);
    }
  }
}

AsyncTree.prototype.walkUp = function(context) {
  this.currentNode = context.parent;
  context.done = true;
  this.walkDown(context.parent);
}

AsyncTree.prototype.getNextChild = function(context) {
  for (var i = 0; i < context.children.length; i++) {
    if (!context.children[i].started) {
      return context.children[i];
    }
  }
  return false;
}

AsyncTree.prototype.run = function(node) {
  node.started = true;
  try {
    return node.command.apply(node.context, node.args);
  } catch (err) {
    err.name = 'Error while running ' + node.name + " command";
    this.emit('error', err);
    return this;
  }
}

AsyncTree.prototype.done = function() {
  this.emit('queue:finished');
  return this;
}

AsyncTree.prototype.empty = function() {
  this.rootNode.children = [];
  return this;
}
AsyncTree.prototype.reset = function() {
  this.rootNode.started = false;
  this.rootNode.done = false;
  this.removeAllListeners();
  this.currentNode = this.rootNode;
  return this;
}

AsyncTree.prototype.traverse = function() {
  this.walkDown(this.currentNode);
  this.currentNode.started = true;
  return this;
}

var queue = new AsyncTree();

exports.reset = function() {
  queue.reset();
};
exports.empty = function() {
  queue.empty();
};
exports.add = function addCommand(commandName, command, context, args) {
  queue.append(commandName, command, context, args);
};

exports.run = function run(callback) {
  if (queue.rootNode.started) {
    return queue;
  }

  if (callback) {
    queue.once('queue:finished', function() {
      callback(null);
    })
    .on('error', function(err) {
      callback(err);
    });
  }
  return queue.traverse();
};

exports.done = function() {
  queue.done();
}

exports.instance = function instance() {
  return queue;
};

exports.getSkipped = function() {
  var items = queue.rootNode.children.filter(function(item) {
    return !item.started
  });
  return items.length;
}

exports.list = function list() {
  return queue.rootNode.children.map(function(item) {
    return item.name
  });
};
