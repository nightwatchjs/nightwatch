const Nightwatch = require('../../index');
function runChildProcess ({argv, settings, port1}) {
  
  process.stdout.write = process.stderr.write = (data) => {
    data = data.toString().trim();
    if (data){
      port1.postMessage(data);
    }
  };
  
  return Nightwatch.runTests(argv, {});
}



module.exports = runChildProcess;