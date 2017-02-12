var Walk = require('./walk.js');
var TestSuite = require('./testsuite.js');
var Logger = require('../util/logger.js');
var path = require('path');
var Q = require('q');

function TagListRunner(testSource, opts, additionalOpts, doneCb) {
  this.testSource = testSource || [];
  this.options = opts;
  this.additionalOpts = additionalOpts;
  this.doneCb = doneCb || function() {}; //TODO: Consider removing.
}

TagListRunner.readPaths = function(testSource, opts, cb) {
  var deferred = Q.defer();
  cb = cb || function() {};

  if (typeof testSource == 'string') {
    testSource = [testSource];
  }

  var fullPaths = testSource.map(function (p) {
    if (p.indexOf(process.cwd()) === 0 || path.resolve(p) === p) {
      return p;
    }

    return path.join(process.cwd(), p);
  });

  if (fullPaths.length === 0) {
    throw new Error('No source folder defined. Check configuration.');
  }

  var errorMessage = ['No tests defined! using source folder:', fullPaths];
  if (opts.tag_filter) {
    errorMessage.push('; using tags:', opts.tag_filter);
  }

  Walk.readPaths(fullPaths, function (err, modules) {
    if (err) {
      if (err.code == 'ENOENT') {
        var error = new Error('Cannot read source folder: ' + err.path);
        cb(error, false);
        deferred.reject(error);
        return;
      }
      cb(err, false);
      deferred.reject(err);
      return;
    }

    opts.modulesNo = modules.length;

    if (modules.length === 0) {
      var error2 = new Error(errorMessage.join(' '));
      cb(error2);
      deferred.reject(error2);
      return;
    }

    cb(null, modules, fullPaths);
    deferred.resolve([modules, fullPaths]);
  }, opts);

  return deferred.promise;
};

TagListRunner.prototype.run = function runner() {
  var deferred = Q.defer();
  var self = this;

  TagListRunner.readPaths(this.testSource, this.options)
    .spread(function TagListRunnerSpreadCallback(modulePaths, fullPaths) {
      var tagsList = [];

      modulePaths.forEach(function(modulePath) {
        var testSuite = new TestSuite(modulePath, fullPaths, self.options, self.additionalOpts);
        var tags = testSuite.module['@attributes']['@tags'] || [];
        tags.map( function(tag) { tagsList.push(tag); } );
      });

      /*
        Output Ideas:
          Tag List: tag1, tag2, tag3 ...

          Tag List:
            Module:Tags tag1, tag2
            Module1:Tags tag3, tag2
       */

      tagsList = tagsList.filter( function deDup( itm, idx, srcArr ) { return srcArr.indexOf(itm) == idx; }).sort();
      console.log( 'Tag List: ', tagsList.join(', ') );
      return tagsList;
    })
    .then(function(tagList) {
      deferred.resolve(tagList);
    })
    .catch(function(err) {
      self.doneCb(err, false);
      deferred.reject(err);
    });

  return deferred.promise;
};

module.exports = TagListRunner;