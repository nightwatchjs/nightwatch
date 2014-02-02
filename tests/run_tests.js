try {
  var args = process.argv, reporter_type = 'default';
  var reporters = require('nodeunit').reporters;
  
  if (args.length == 3) {
    reporter_type = args[2];
    
    if (!(reporter_type in reporters)) {
      console.error('Invalid reporter_type specified', reporter_type);
      process.exit();
    }
  } 
  
  var reporter = reporters[reporter_type];
  var options  = require('./nodeunit.json');
}
catch(e) {
  console.log(e);
  console.log("Cannot find nodeunit module.");
  process.exit();
}

process.chdir(__dirname);

try {
  var server = require('mockserver').init();
  server.on('listening', function() {
    reporter.run(['src', 'src/assertions', 'src/protocol', 'src/commands'], options, function() {
      server.close();
    });  
  });
  

  //reporter.run(['src/commands'], options);  
} catch (err) {
  console.log(e);
  process.exit();
}
