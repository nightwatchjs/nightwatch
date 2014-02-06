

module.exports = {
  // "Test Superdry home": function(client) {
  //   client
  //     .url('http://www.superdry.com')
  //     .waitForPageToBeMobified()
  //     .assert.title('Superdry - Jackets, T Shirts, Hoodies, Shorts, Mens & Womens Clothing - Superdry')
  //     .end();
  // },

  "Test Superdry pikabu": function(client) {
    client
      .url('http://www.superdry.com')
      .waitForPageToBeMobified()
      .click('.x-menu')
      .assert.visible('.x-menu-content')
      .end();
  }
};