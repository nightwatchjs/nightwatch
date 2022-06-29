const util = require('utilWhichDoesnotexist.js');

module.exports = {
  demoTest: function (client) {

    var resultMs = util.formatElapsedTime(999);
    client.assert.equal(resultMs, '999ms');
  },

  after: function (client) {
    client.end();
  }
};
