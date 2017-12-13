/* jshint expr: true */
module.exports = {
  tags: ['google'],
  'Demo test Google' : function (client) {
    client
      .url('http://google.no')
      .pause(1000);

    client.expect.element('body').to.be.present;

    client.expect.element('#lst-ib').to.have.css('display');

    client.expect.element('body').to.have.attribute('class').which.contains('vasq');
    client.expect.element('body').to.have.attribute('class').which.matches(/vasq$/);
    client.expect.element('body').to.have.attribute('class').before(1000);

    client.expect.element('#lst-ib').to.be.enabled;

    //client.expect.element('#hplogo').text.to.match(/Norge/).before(1000);

    client.setValue('#lst-ib', 'Norway').pause(500);
    client.expect.element('#lst-ib').to.have.value.equal('Norway');
    client.expect.element('#lst-ib').to.be.an('input');
    client.expect.element('#lst-ib').to.be.not.selected;
    client.expect.element('#lst-ib').to.be.visible;

    client.end();
  }
};
