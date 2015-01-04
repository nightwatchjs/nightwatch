var path = require('path');
var fs = require('fs');
var minimatch = require('minimatch');
var fileMatcher = require('./filematcher.js');

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

    list.forEach(function(file) {
      file = [dir, file].join(path.sep);

      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          var dirName = file.split(path.sep).slice(-1)[0];
          var isExcluded = opts.exclude && opts.exclude.indexOf(file) > -1;
          var isSkipped = opts.skipgroup && opts.skipgroup.indexOf(dirName) > -1;

          if (isExcluded || isSkipped) {
            pending = pending-1;
          } else {
            walk(file, function(err, res) {
              results = results.concat(res);
              pending = pending-1;
              if (!pending) {
                done(null, results);
              }
            }, opts);
          }
        } else {
          results.push(file);
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
    var extensionPattern = /\.js$/;
    if (paths.length === 1 && extensionPattern.test(paths[0])) {
      paths[0] = paths[0].replace(extensionPattern, '');
      return cb(null, paths, opts);
    }

    paths.forEach(function (p) {
      if (opts.exclude) {
        opts.exclude = fileMatcher.exclude.adaptFilePath(p, opts.exclude);
      }

      if (opts.filter) {
        opts.filter = fileMatcher.filter.adaptFilePath(p, opts.filter);
      }

      walk(p, function (err, list) {
        if (err) {
          return cb(err);
        }
        list.sort();

        var modules = list.filter(function (filePath) {
          var filename = filePath.split(path.sep).slice(-1)[0];

          if (opts.exclude && fileMatcher.exclude.match(filePath, opts.exclude)) {
            return false;
          }

          if (opts.filter) {
            return fileMatcher.filter.match(filePath, opts.filter);
          }

          if (opts.filename_filter) {
            return minimatch(filename, opts.filename_filter);
          }

          if (opts.tag_filter) {
            return fileMatcher.tags.match(filePath, opts.tag_filter);
          }

          return extensionPattern.exec(filePath);
        });

        modules = modules.map(function (filename) {
          return filename.replace(extensionPattern, '');
        });

        cb(null, modules);
      }, opts);
    });
  }
};