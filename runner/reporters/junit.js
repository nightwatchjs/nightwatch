var fs = require('fs'),
    path = require('path'),
    mkpath = require('mkpath'),
    ejs = require('ejs'),
    child_process = require('child_process');
    
exports.save = function(results, folder) {
  var tmpl = __dirname + "/junit.xml.ejs";
  
  fs.readFile(tmpl, function (err, data) {
    if (err) {
      throw err;
    }
    var tmpl = data.toString();
    
    for (var moduleName in results.modules) {
      var module = results.modules[moduleName];
      var tests = 0, errors = 0, failures = 0;
      for (var x in module) {
        tests += module[x].passed + module[x].failed + module[x].skipped;
        errors += module[x].errors;
        failures += module[x].failed;
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
      mkpath.sync(path.dirname(filename));
      fs.writeFileSync(filename, rendered, 'utf8');
    }
  });
}
