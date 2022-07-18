const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
 
class Version {
  constructor(full) {
    this.full = full;
    this.major = full.split('.')[0];
    this.minor = full.split('.')[1];
    this.patch = full.split('.').slice(2).join('.');
  }
}

const VERSION = new Version(
  require(__dirname + '/../../package.json').version
);
 
module.exports = {
  Version,
  VERSION
};