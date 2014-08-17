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
  console.log('Cannot find nodeunit module.');
  process.exit();
}

process.chdir(__dirname);

process.removeAllListeners('uncaughtException');

try {
  var server = require('mockserver').init();
  server.on('listening', function() {
    reporter.run([
      'src',
      'src/index',
      'src/runner',
      'src/assertions',
      'src/commands',
      'src/protocol',
      'src/http'
    ], options, function(err) {
      server.close();
      if (err) {
        process.exit(1);
      }
    });
  });
} catch (err) {
  console.log(err.stack);
  process.exit(1);
}
