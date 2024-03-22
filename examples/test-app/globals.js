const waitOn = require('wait-on');
const {spawn} = require('child_process');
const path = require('path');

let serverPid = null;
const serverPort = '13370';

module.exports = {
  before(done) {
    // serve --listen 13370 ./test-app
    serverPid = spawn(path.resolve('node_modules/.bin/serve'), ['--listen', serverPort, '--no-request-logging', __dirname], {
      cwd: process.cwd(),
      stdio: 'inherit'
    }).pid;

    waitOn({
      resources: [`http://localhost:${serverPort}`]
    }).then(() => {
      setTimeout(done, 500);
    });

  },

  after() {
    if (serverPid) {
      process.kill(serverPid);
    }
  }
};
