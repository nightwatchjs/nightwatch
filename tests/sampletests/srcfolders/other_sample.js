module.exports = {
  desiredCapabilities : {
    name : 'test-srcFolders'
  },
  srcFoldersTest : function (client) {
    client.globals.test.equals(client.options.desiredCapabilities.name, 'test-srcFolders');
  }
};
