var path = require('path');
var fs = require('fs');
var minimatch = require('minimatch');
var fileMatcher = require('./filematcher.js');
var Matchers = {};

function isFolderExcluded(resource, opts) {
  if (!opts.exclude) {
    return false;
  }

  if (Matchers.exclude) {
    return Matchers.exclude.some(function(item) {
      if (item.indexOf(resource) === -1) {
        return false;
      }

      try {
        return fs.statSync(item).isDirectory();
      } catch (err) {
        return false;
      }
    });
  }
  return false;
}

function addMatcher(type, filePath, opts) {
  Matchers[type] = Matchers[type] || [];
  var matchers = fileMatcher[type].adaptFilePath(filePath, opts[type]);
  if (Array.isArray(matchers)) {
    Matchers[type].push.apply(Matchers[type], matchers);
  } else {
    Matchers[type].push(matchers);
  }

}

function walk(dir, done, opts) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) {
      return done(err);
    }
    var pending = list.length;

    if (pending === 0) {
      return done(null, results);
    }

    list.forEach(function(resource) {
      resource = [dir, resource].join(path.sep);

      fs.stat(resource, function(err, stat) {
        if (stat && stat.isDirectory()) {
          var dirName = resource.split(path.sep).slice(-1)[0];
          var isExcluded = isFolderExcluded(resource, opts); // prevent loading of files from an excluded folder
          var isSkipped = opts.skipgroup && opts.skipgroup.indexOf(dirName) > -1;

          if (isExcluded || isSkipped) {
            pending = pending-1;
          } else {
            walk(resource, function(err, res) {
              results = results.concat(res);
              pending = pending-1;
              if (!pending) {
                done(null, results);
              }
            }, opts);
          }
        } else {
          results.push(resource);
          pending = pending-1;

          if (!pending) {
            done(null, results);
          }
        }
      });
    });
  });
}

module.exports = {
  readPaths : function (paths, cb, opts) {
    Matchers.exclude = [];
    Matchers.filter = [];
    var extensionPattern = /\.js$/;
    if (paths.length === 1 && extensionPattern.test(paths[0])) {
      paths[0] = paths[0].replace(extensionPattern, '');
      return cb(null, paths, opts);
    }

    paths.forEach(function (p) {

      if (opts.exclude) {
        addMatcher('exclude', p, opts);
      }

      if (opts.filter) {
        addMatcher('filter', p, opts);
      }

      walk(p, function (err, list) {
        if (err) {
          return cb(err);
        }
        list.sort();

        var modules = list.filter(function (filePath) {

          if (!extensionPattern.test(filePath)) {
            return false;
          }
          if (opts.exclude && fileMatcher.exclude.match(filePath, Matchers.exclude)) {
            return false;
          }

          if (opts.filter && !fileMatcher.filter.match(filePath, Matchers.filter)) {
            return false;
          }

          var filename = filePath.split(path.sep).slice(-1)[0];
          if (opts.filename_filter) {
            return minimatch(filename, opts.filename_filter);
          }

          if (opts.tag_filter || opts.skiptags) {
            return fileMatcher.tags.match(filePath, opts);
          }

          return true;
        });

        modules = modules.map(function (filename) {
          return filename.replace(extensionPattern, '');
        });

        cb(null, modules);
      }, opts);
    });
  }
};