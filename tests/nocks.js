var nock = require('nock');

module.exports = {
  elementFound : function() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
      });
    return this;
  },

  elementNotFound : function() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"css selector","value":"#weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });
    return this;
  },

  attributeValue : function (value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: value,
        state : 'success'
      });
    return this;
  },

  cssProperty : function (value, times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/css/display')

    if (times) {
      mock.times(times);
    }

      mock.reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: value,
        state : 'success'
      });
    return this;
  },

  cleanAll : function() {
    nock.cleanAll();
  }
};
