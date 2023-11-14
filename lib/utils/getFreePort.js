/**
 * @method getFreePort
 * @param host
 * @returns {Promise<number>}
 */
module.exports = function(host = 'localhost') {
  const net = require('net');

  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.on('listening', function () {
      const serverAddress = server.address();

      if (!serverAddress || typeof serverAddress === 'string') {
        reject(new Error('Unable to get port from server address.'));
      } else {
        resolve(serverAddress.port);
      }

      server.close();
    });

    server.on('error', (e) => {
      let err;
      if (e.code === 'EADDRINUSE' || e.code === 'EACCES') {
        err = new Error('Unable to find a free port');
      } else {
        err = e;
      }

      reject(err);
    });

    // By providing 0 we let the operative system find an arbitrary port
    server.listen(0, host);
  });
};
