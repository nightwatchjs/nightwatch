var fs = require('fs'),
    path = require('path'),
    ejs = require('ejs'),
    child_process = require('child_process');

exports.save = function(results, folder, callback) {
  var tmpl = __dirname + "/junit.xml.ejs";

  fs.readFile(tmpl, function (err, data) {
    if (err) {
      throw err;
    }
    var tmpl = data.toString();

    for (var moduleName in results.modules) {
      if (results.modules.hasOwnProperty(moduleName)) {
        var module = results.modules[moduleName];
        var tests = 0, errors = 0, failures = 0;
        for (var x in module) {
          if (module.hasOwnProperty(x)) {
            tests += module[x].passed + module[x].failed + module[x].skipped;
            errors += module[x].errors;
            failures += module[x].failed;
          }
        }

        var rendered = ejs.render(tmpl, {
          locals: {
            module     : module,
            moduleName : moduleName,
            tests      : tests,
            errors     : errors,
            failures   : failures,
            systemerr  : results.errmessages.join("\n")
          }
        });

        var filename = path.join(folder, moduleName + '.xml');
        fs.writeFile(filename, rendered, callback);
      }
    }
  });
};
