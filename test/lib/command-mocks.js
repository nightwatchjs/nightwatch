const MockServer = require('./mockserver.js');

module.exports = {
  cookiesFound() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: {
        sessionId: '1352110219202',
        status: 0,
        value: [{
          name: 'test_cookie',
          value: '123456',
          path: '/',
          domain: 'example.org',
          secure: false
        }]
      }
    }, null, true);
  },

  cookiesNotFound() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: []
      })
    });
  },

  cookiesSocketDelay() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      socketDelay: 200,
      response: ''
    }, true);
  },


  deleteCookie() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie/other_cookie',
      method: 'DELETE',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    });
  },

  addCookie() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'POST',
      postdata: JSON.stringify(
        {
          cookie: {
            name: 'other_cookie',
            value: '123456',
            secure: false,
            httpOnly: false
          }
        }
      ),
      response: JSON.stringify({
        value: null
      })
    });
  },

  elementSelected(element='0') {
    MockServer.addMock({
      'url': `/wd/hub/session/1352110219202/element/${element}/selected`,
      method: 'GET',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        value: true,
        status: 0
      })
    });
  },

  maximizeWindow() {
    MockServer.addMock({
      'url': '/wd/hub/session/1352110219202/window/current/maximize',
      'response': JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);
  }
};

