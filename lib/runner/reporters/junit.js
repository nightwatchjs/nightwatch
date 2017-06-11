/**
 * https://svn.jenkins-ci.org/trunk/hudson/dtkit/dtkit-format/dtkit-junit-model/src/main/resources/com/thalesgroup/dtkit/junit/model/xsd/junit-4.xsd
 * @type {exports}
 */
var fs = require('fs');
var mkpath = require('mkpath');
var path = require('path');
var ejs = require('ejs');
var util = require('util');
var Utils = require('../../util/utils.js');

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

  function adaptAssertions(module) {
    Object.keys(module.completed).forEach(function(item) {
      var testcase = module.completed[item];
      var assertions = testcase.assertions;
      for (var i = 0; i < assertions.length; i++) {
        if (assertions[i].stackTrace) {
          assertions[i].stackTrace = Utils.stackTraceFilter(assertions[i].stackTrace.split('\n'));
        }
      }

      if (testcase.failed > 0 && testcase.stackTrace) {
        var stackParts = testcase.stackTrace.split('\n');
        var errorMessage = stackParts.shift();
        testcase.stackTrace = Utils.stackTraceFilter(stackParts);
        testcase.message = errorMessage;
      }
    });
  }

  function writeReport(moduleKey, data, opts, callback) {
    var module = globalResults.modules[moduleKey];
    var pathParts = moduleKey.split(path.sep);
    var moduleName = pathParts.pop();
    var className = moduleName;
    var output_folder = opts.output_folder;

    adaptAssertions(module);

    if (pathParts.length) {
      output_folder = path.join(output_folder, pathParts.join(path.sep));
      mkpath.sync(output_folder);
      className = pathParts.join('.') + '.' + moduleName;
    }

    var filename = path.join(output_folder, opts.filename_prefix + moduleName + '.xml');

    var rendered = ejs.render(data, {
      locals: {
        module     : module,
        moduleName : moduleName,
        className  : className,
        systemerr  : globalResults.errmessages.join('\n')
      }
    });

    fs.writeFile(filename, rendered, function(err) {
      callback(err);
    });
  }

  this.write = function(results, options, callback) {
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
