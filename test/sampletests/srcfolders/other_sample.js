var assert = require('assert');
module.exports = {
  desiredCapabilities : {
    name : 'test-srcFolders'
  },
  srcFoldersTest : function (client) {
    assert.equal(client.options.desiredCapabilities.name, 'test-srcFolders');
  }
};
