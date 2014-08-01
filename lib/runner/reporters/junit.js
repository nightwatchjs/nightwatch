var fs = require('fs');
var mkpath = require('mkpath');
var path = require('path');
var ejs = require('ejs');

module.exports = new (function() {

  var tmpl = __dirname + '/junit.xml.ejs';
  var tmplData;
  var globalResults;

  function loadTemplate(cb) {
    if (tmplData) {
      cb(tmplData);
      return;
    }
    fs.readFile(tmpl, function (err, data) {
      if (err) {
        throw err;
      }
      tmplData = data.toString();
      cb(tmplData);
    });
  }

  function writeReport(moduleKey, data, opts, callback) {
    var module = globalResults.modules[moduleKey];
    var tests = 0, errors = 0, failures = 0;
    var pathParts = moduleKey.split(path.sep);
    var moduleName = pathParts.pop();
    var output_folder = opts.output_folder;

    for (var x in module) {
      if (module.hasOwnProperty(x)) {
        tests += module[x].passed + module[x].failed + module[x].skipped;
        errors += module[x].errors;
        failures += module[x].failed;
      }
    }

    var rendered = ejs.render(data, {
      locals: {
        module     : module,
        moduleName : moduleName,
        testsNo    : tests,
        errors     : errors,
        failures   : failures,
        systemerr  : globalResults.errmessages.join('\n')
      }
    });

    if (pathParts.length) {
      output_folder = path.join(output_folder, pathParts.join(path.sep));
      mkpath.sync(output_folder);
    }

    var filename = path.join(output_folder, opts.filename_prefix + moduleName + '.xml');
    fs.writeFile(filename, rendered, callback);
  }

  this.save = function(results, options, callback) {
    globalResults = results;
    var keys = Object.keys(results.modules);

    loadTemplate(function createReport(data) {
      var moduleKey = keys.shift();

      writeReport(moduleKey, data, options, function(err) {
        if (err || (keys.length === 0)) {
          callback(err);
        } else {
          createReport(data);
        }
      });
    });
  };

})();
