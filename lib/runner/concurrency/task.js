const Nightwatch = require('../../index');
function runWorkerTask({argv, port1}) {
  const writeData = (data) => {
    data = data.toString().trim();

    if (data){
      port1.postMessage({
        type: 'stdout',
        data: data
      });
    }
  };

  process.stdout.write = writeData;
  process.stderr.write = writeData;

  //send reports to main thread using message port
  process.port = port1;

  process.on('unhandledRejection', function (err) {
    port1.postMessage({
      type: 'unhandledRejection',
      err: err
    });
  });

  process.on('uncaughtException', function (err) {
    port1.postMessage({
      type: 'uncaughtException',
      err: err
    });
  });

  return Nightwatch.runTests(argv, {});
}

module.exports = runWorkerTask;
