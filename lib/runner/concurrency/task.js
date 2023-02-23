const Nightwatch = require('../../index');
function runChildProcess ({argv, settings, port1}) {
  
  process.stdout.write = process.stderr.write = (data) => {
    data = data.toString().trim();

    if (data){
      port1.postMessage({
        type: 'stdout',
        data: data
      });
    }
  };

  //send reports to main thread using message port
  process.port = port1;
  
  return Nightwatch.runTests(argv, {});
}

module.exports = runChildProcess;