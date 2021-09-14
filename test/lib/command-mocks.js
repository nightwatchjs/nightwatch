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

  elementSelected(elementId = '0') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/selected`,
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        value: true,
        status: 0
      })
    }, true);
  },

  elementNotSelected(elementId = '0') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/selected`,
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        value: false,
        status: 0
      })
    }, true);
  },

  maximizeWindow() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/window/current/maximize',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);
  },

  elementText(elementId = '0', text = 'sample text') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/text`,
      method: 'GET',
      response: JSON.stringify({
        sessiondId: '1352110219202',
        status: 0,
        value: text
      })
    });
  },

  tagName(elementId = '0', tagName = 'div') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/name`,
      method: 'GET',
      response: JSON.stringify({
        value: tagName
      })
    });
  },

  visible(elementId = '0', value = true, {times = 0} = {}) {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/displayed`,
      method: 'GET',
      response: JSON.stringify({
        value
      }),
      times
    });
  },

  createNewW3CSession({
    testName = '',
    browserName = 'firefox',
    sessionId = '13521-10219-202',
    persist = false,
    deleteSession = true
  }) {
    MockServer.addMock({
      url: '/session',
      statusCode: 201,
      method: 'POST',
      postdata: JSON.stringify({
        desiredCapabilities: {browserName, name: testName},
        capabilities: {alwaysMatch: {browserName}}
      }),

      response: JSON.stringify({
        value: {
          sessionId,
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'firefox',
            browserVersion: '65.0.1'
          }
        }
      })
    }, !persist);

    if (!deleteSession) {
      return;
    }

    MockServer.addMock({
      url: `/session/${sessionId}`,
      method: 'DELETE',
      response: {
        value: null
      }
    }, !persist);
  }
};

