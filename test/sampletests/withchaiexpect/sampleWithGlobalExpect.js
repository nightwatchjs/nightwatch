module.exports = {
  demoTest: async function (client) {
    const result = await client.url('http://localhost')
      .elements('css selector', '#weblogin');

    expect(result).to.have.length(1);
    expect(null).to.be.null;
  },

  demoTestWithError: function () {
    expect('#weblogin').to.be.present;
  }

};
