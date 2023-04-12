const MockServer = require('./mockserver.js');

let server;
module.exports = {
  start(done) {
    server = MockServer.init();
    server.on('listening', function () {
      done();
    });
  },

  stop(done) {
    if (!server) {
      done();

      return;
    }

    server.close(function () {
      done();
    });
  },

  createServer(opts = {}) {
    return MockServer.initAsync(opts);
  },

  cookieFound(name = 'test_cookie', value = '123456', {times = 0} = {}) {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/cookie/${name}`,
      method: 'GET',
      response: {
        sessionId: '1352110219202',
        status: 0,
        value: {
          name: name,
          value: value,
          path: '/',
          domain: 'example.org',
          secure: false
        }
      },
      times
    }, times === 0);
  },

  cookieNotFound(name = 'other_cookie', {times = 0} = {}) {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/cookie/${name}`,
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        value: {
          error: 'no such cookie',
          message: 'no such cookie',
          stacktrace: ''
        }
      }),
      statusCode: 404,
      times
    }, times === 0);
  },

  cookiesFound({times = 0} = {}) {
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
      },
      times
    }, times === 0);
  },

  cookiesNotFound({times = 0} = {}) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: []
      }),
      times
    }, times === 0);
  },

  cookiesSocketDelay({times = 0} = {}) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'GET',
      socketDelay: 200,
      response: '',
      times
    }, times === 0);
  },

  deleteCookie() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie/other_cookie',
      method: 'DELETE',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0
      })
    }, true);
  },

  deleteCookies() {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/cookie',
      method: 'DELETE',
      response: JSON.stringify({
        sessionId: '1352110219202',
        status: 0,
        value: null
      })
    }, true);
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
    }, true);
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

  element({ 
    using = 'css selector', 
    value = '#container',
    response = {
      value: [{
        'element-6066-11e4-a52e-4f735466cecf': '5cc459b8-36a8-3042-8b4a-258883ea642b'
      }]
    }
  }) {
    MockServer.addMock({
      url: '/wd/hub/session/13521-10219-202/elements',
      method: 'POST',
      postdata: JSON.stringify({using, value}),

      response: JSON.stringify(response)
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

  /**
   * @deprecated
   * @param elementId
   * @param text
   */
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

  clearElement(elementId = '0') {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/clear`,
      method: 'POST',
      response: JSON.stringify({
        value: null
      })
    });
  },

  executeSync(response, {times = 0} = {}) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify(response),
      times
    });

    return this;
  },

  visible(elementId = '0', value = true, {times = 0} = {}) {
    MockServer.addMock({
      url: '/wd/hub/session/1352110219202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value
      }),
      times
    });

    return this;
  },

  w3cVisible(value = true) {
    MockServer.addMock({
      url: '/session/13521-10219-202/execute/sync',
      method: 'POST',
      response: JSON.stringify({
        value
      })
    }, true);
  }, 

  findElements({using = 'css selector', value = '#container', response = null, times = 0}) {
    const mockOpts = {
      url: '/session/13521-10219-202/elements',
      method: 'POST',
      postdata: JSON.stringify({using, value}),
      response: JSON.stringify(response)
    };

    if (times > 0) {
      mockOpts.times = times;
    }

    MockServer.addMock(mockOpts, times === 0);

    return this;
  },

  getElementText({elementId, responseText, sessionId = '13521-10219-202'}) {
    MockServer.addMock({
      url: `/session/${sessionId}/element/${elementId}/text`,
      method: 'GET',
      response: JSON.stringify({
        value: responseText
      })
    });

    return this;
  },

  findElementFromParent({elementId, sessionId = '13521-10219-202', response}) {
    MockServer.addMock({
      url: `/session/${sessionId}/element/${elementId}/element`,
      method: 'POST',
      response: JSON.stringify(response)
    });

    return this;
  },

  clickElement({elementId, sessionId = '13521-10219-202'}) {
    MockServer.addMock({
      url: `/session/${sessionId}/element/${elementId}/click`,
      method: 'POST',
      response: JSON.stringify({
        value: null
      })
    });

    return this;
  },

  elementProperty(elementId, property, response) {
    MockServer.addMock({
      url: `/wd/hub/session/1352110219202/element/${elementId}/property/${property}`,
      method: 'GET',
      response: JSON.stringify(response)
    });

    return this;
  },

  setElementValue({
    sessionId = '13521-10219-202',
    elementId,
    text,
    times = 0,
    response = null,
    statusCode = 200
  }) {
    MockServer.addMock({
      url: `/session/${sessionId}/element/${elementId}/value`,
      method: 'POST',
      postdata: JSON.stringify({
        text,
        value: text.split('')
      }),
      response: response || {
        value: null
      },
      statusCode
    }, times === 0);

    return this;
  },

  frame({
    sessionId = '13521-10219-202',
    elementId = '5cc459b8-36a8-3042-8b4a-258883ea642b',
    text,
    times = 0,
    response = null,
    statusCode = 200
  } = {}) {
    MockServer.addMock({
      url: `/session/${sessionId}/frame`,
      method: 'POST',
      postdata: JSON.stringify({
        id: {
          'element-6066-11e4-a52e-4f735466cecf': elementId,
          ELEMENT: elementId
        }
      }),
      response: response || {
        value: null
      },
      statusCode
    }, times === 0);

    return this;
  },

  createFirefoxSession({
    persist = false,
    sessionId = '13521-10219-202',
    headless = true,
    deleteSession = true,
    url = '/wd/hub/session'
  }) {
    const browserName = 'firefox';
    const headlessOpt = headless ? '-headless' : '';
    const options = {
      ['moz:firefoxOptions']: {
        args: [headlessOpt]
      }
    };

    MockServer.addMock({
      url,
      statusCode: 201,
      method: 'POST',
      postdata: JSON.stringify({
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName, ...options}}
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
  },

  createChromeSession({
    persist = false,
    sessionId = '13521-10219-202',
    headless = true,
    deleteSession = true,
    url = '/wd/hub/session'
  }) {
    const browserName = 'chrome';
    const headlessOpt = headless ? 'headless=new' : '';
    const options = {
      ['goog:chromeOptions']: {}
    };

    if (headlessOpt) {
      options['goog:chromeOptions'].args = [headlessOpt];
    }

    MockServer.addMock({
      url,
      statusCode: 201,
      method: 'POST',
      postdata: JSON.stringify({
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName, ...options}}
      }),

      response: JSON.stringify({
        value: {
          sessionId,
          capabilities: {
            acceptInsecureCerts: false,
            browserName: 'chrome',
            browserVersion: '90'
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
  },

  createNewW3CSession({
    testName = '',
    browserName = 'firefox',
    sessionId = '13521-10219-202',
    persist = false,
    deleteSession = true,
    postdata = null
  } = {}) {
    MockServer.addMock({
      url: '/session',
      statusCode: 201,
      method: 'POST',
      postdata: JSON.stringify(postdata || {
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName}}
      }),

      response: JSON.stringify({
        value: {
          sessionId,
          capabilities: {
            acceptInsecureCerts: false,
            browserName,
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

    return this;
  },

  navigateTo({url, persist = false, sessionId = '13521-10219-202'}) {
    MockServer.addMock({
      url: `/session/${sessionId}/url`,
      method: 'POST',
      postdata: JSON.stringify({
        url
      }),
      response: {
        value: null
      }
    }, !persist);

    return this;
  }
};
