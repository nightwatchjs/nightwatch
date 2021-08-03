
module.exports = {

  demoTest: async function (client) {
   
    await client.verify.elementPresent({
      selector: '#badElement',
      timeout: 15,
      retryInterval: 15
    })
      .verify.elementPresent('#weblogin');

    client.end();
  }
};
