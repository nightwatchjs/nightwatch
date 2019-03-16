const nock = require('nock');
const ElementNocks = require('./nockselements.js');

module.exports = {
  disabled: false,
  disable() {
    this.disabled = true;
    ElementNocks.disabled = true;
    nock.cleanAll();
    nock.restore();

    return this;
  },

  enable(force) {
    if (this.disabled || force) {
      nock.activate();
    }

    return this;
  },

  createSession() {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'firefox',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    return this;
  },

  deleteSession() {
    nock('/wd/hub/session/1352110219202')
      .delete()
      .reply(200, {});

    nock('http://localhost:10195')
      .delete('/wd/hub/session/1352110219202')
      .reply(204, '');
    return this;
  },

  url() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/url', {url: 'http://localhost'})
      .reply(200, {
        status: 0,
        state: 'success'
      });

    return this;
  },

  getUrl() {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/url')
      .reply(200, {
        status: 0,
        state: 'success',
        value: 'http://localhost'
      });

    return this;
  },

  elementFound() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {'using': 'css selector', 'value': '#weblogin'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: [{ELEMENT: '0'}]
      });

    return this;
  },

  elementNotFound() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {'using': 'css selector', 'value': '#weblogin'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });

    return this;
  },

  elementFoundXpath() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {'using': 'xpath', 'value': '//weblogin'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: [{ELEMENT: '0'}]
      });

    return this;
  },

  attributeValue(value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/attribute/class')
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: value,
        state: 'success'
      });

    return this;
  },

  cssProperty(value, times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/css/display');

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId: '1352110219202',
      value: value,
      state: 'success'
    });

    return this;
  },

  enabled(times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/enabled');

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId: '1352110219202',
      value: true,
      state: 'success'
    });

    return this;
  },

  notEnabled(times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/enabled');

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId: '1352110219202',
      value: false,
      state: 'success'
    });

    return this;
  },

  selected() {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/selected')
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: true,
        state: 'success'
      });

    return this;
  },

  notSelected(times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/selected');

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId: '1352110219202',
      value: false,
      state: 'success'
    });

    return this;
  },

  visible() {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/displayed')
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: true,
        state: 'success'
      });

    return this;
  },

  notVisible(times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/displayed');

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId: '1352110219202',
      value: false,
      state: 'success'
    });

    return this;
  },

  value(value, times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/attribute/value');

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId: '1352110219202',
      value: value,
      state: 'success'
    });

    return this;
  },

  text(value, times) {
    var mock = nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/text');

    if (times) {
      mock.times(times);
    }

    mock.reply(200, {
      status: 0,
      sessionId: '1352110219202',
      value: value,
      state: 'success'
    });

    return this;
  },

  name(value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/name')
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: value,
        state: 'success'
      });

    return this;
  },

  title(value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/title')
      .reply(200, {
        status: 0,
        state: 'success',
        value: value
      });

    return this;
  },

  active() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/element/active')
      .reply(200, {
        status: 0,
        state: 'success',
        value: {ELEMENT: '0'}
      });

    return this;
  },

  notActive() {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/element/active')
      .reply(200, {
        status: 0,
        state: 'success',
        value: {ELEMENT: 'other'}
      });

    return this;
  },

  height(value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/size')
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          height: value
        },
      });

    return this;
  },

  width(value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/size')
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          width: value
        },
      });

    return this;
  },

  xPosition(value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/location_in_view')
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          x: value
        },
      });

    return this;
  },

  yPosition(value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/element/0/location_in_view')
      .reply(200, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          y: value
        },
      });

    return this;
  },

  elementsFound(selector) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {'using': 'css selector', 'value': selector})
      .reply(200, {
        status: 0,
        state: 'success',
        value: [
          {ELEMENT: '0'},
          {ELEMENT: '1'},
          {ELEMENT: '2'},
          {ELEMENT: '3'}
        ]
      });

    return this;
  },

  elementsNotFound(selector) {
    nock('http://localhost:10195')
      .post('/wd/hub/session/1352110219202/elements', {'using': 'css selector', 'value': selector})
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });

    return this;
  },

  cookie(name, value) {
    nock('http://localhost:10195')
      .get('/wd/hub/session/1352110219202/cookie')
      .reply(200, {
        status: 0,
        state: 'success',
        value: [
          {
            domain: 'cookie-domain',
            name: name,
            value: value
          }
        ]
      });

    return this;
  },



  cleanAll() {
    nock.cleanAll();

    return this;
  }
};
