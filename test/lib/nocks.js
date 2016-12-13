var nock = require('nock');

module.exports = {
  createSession : function() {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          javascriptEnabled: true,
          browserName: "firefox",
          version: "TEST",
          platform: "TEST"
        }
      });
    return this;
  },

  deleteSession : function() {
    nock('/wd/hub/session/1352110219202')
      .delete()
      .reply(200, {});
    return this;
  },

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

  elementFoundXpath : function() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {"using":"xpath","value":"//weblogin"} )
      .reply(200, {
        status: 0,
        state: 'success',
        value: [ { ELEMENT: '0' } ]
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

  enabled : function (times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/enabled')

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId : '1352110219202',
      value: true,
      state : 'success'
    });
    return this;
  },

  notEnabled : function (times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/enabled')

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId : '1352110219202',
      value: false,
      state : 'success'
    });
    return this;
  },

  selected : function () {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/selected')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: true,
        state : 'success'
      });
    return this;
  },

  notSelected : function (times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/selected')

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId : '1352110219202',
      value: false,
      state : 'success'
    });
    return this;
  },

  visible : function () {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/displayed')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: true,
        state : 'success'
      });
    return this;
  },

  notVisible : function (times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/displayed')

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId : '1352110219202',
      value: false,
      state : 'success'
    });
    return this;
  },

  value : function (value, times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/attribute/value')

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

  text : function (value, times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/text')

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

  name : function (value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/name')
      .reply(200, {
        status: 0,
        sessionId : '1352110219202',
        value: value,
        state : 'success'
      });
    return this;
  },

  cleanAll : function() {
    nock.cleanAll();
    return this;
  }
};
