var fs = require('fs'),
  mkpath = require('mkpath'),
  path = require('path'),
  ejs = require('ejs');

exports.save = function(results, opts, callback) {
  var tmpl = __dirname + '/junit.xml.ejs';

  fs.readFile(tmpl, function (err, data) {
    if (err) {
      throw err;
    }
    var tmpl = data.toString();

    for (var moduleKey in results.modules) {
      if (results.modules.hasOwnProperty(moduleKey)) {
        var module = results.modules[moduleKey];
        var tests = 0, errors = 0, failures = 0;
        for (var x in module) {
          if (module.hasOwnProperty(x)) {
            tests += module[x].passed + module[x].failed + module[x].skipped;
            errors += module[x].errors;
            failures += module[x].failed;
          }
        }
        var pathParts = moduleKey.split(path.sep);
        var moduleName = pathParts.pop();
        var rendered = ejs.render(tmpl, {
          locals: {
            module     : module,
            moduleName : moduleName,
            testsNo    : tests,
            errors     : errors,
            failures   : failures,
            systemerr  : results.errmessages.join('\n')
          }
        });

        var output_folder = opts.output_folder;
        if (pathParts.length) {
          output_folder = path.join(output_folder, pathParts.join(path.sep));
          mkpath.sync(output_folder);
        }

        var filename = path.join(output_folder, opts.filename_prefix + moduleName + '.xml');
        fs.writeFile(filename, rendered, callback);
      }
    }
  });
};
