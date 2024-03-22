const path = require('path');
const MockServer = require('../../../lib/mockserver.js');
const Mocks = require('../../../lib/command-mocks.js');
const common = require('../../../common.js');
const {settings} = common;
const NightwatchClient = common.require('index.js');

describe('angular demo tests', function() {
  beforeEach(function(done) {
    this.server = MockServer.init();
    this.server.on('listening', () => {
      done();
    });
  });

  afterEach(function(done) {
    this.server.close(function() {
      done();
    });
  });

  it('run test with global element()', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/angular-test/angularTodoListWithElementGlobal.js');
    setupMocks({testSuiteName: 'angularjs homepage todo list - with element global'});

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: null,
      output: false,
      globals
    }));
  });

  it('run test with global element() - async', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/angular-test/angularTodoListWithElementGlobalAsync.js');
    setupMocks({testSuiteName: 'angularjs homepage todo list - with element global async'});

    const globals = {
      waitForConditionPollInterval: 50,
      waitForConditionTimeout: 100,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: null,
      output: false,
      globals
    }));
  });

  it('run test with classic apis', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/angular-test/angularTodoListWithClassicApis.js');
    setupMocks({testSuiteName: 'angularjs homepage todo list - with classic apis'});

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: null,
      output: false,
      globals
    }));
  });

  it('run test with global element() and stale element error', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/angular-test/angularTodoListWithElementGlobalAndError.js');
    Mocks
      .createNewW3CSession({
        postdata: {
          capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'chrome', 'goog:chromeOptions': {}}}
        }
      })
      .findElements({
        value: '[ng-model="todoList.todoText"]', response: {
          value: [
            {
              'element-6066-11e4-a52e-4f735466cecf': '1666be97-5c43-4064-b145-bd5676a9a361'
            }
          ]
        }
      })
      .findElements({
        value: '[ng-model="todoList.todoText"]', response: {
          value: [
            {
              'element-6066-11e4-a52e-4f735466cecf': '1666be97-5c43-4064-b145-bd5676a9a361'
            }
          ]
        }
      })
      .setElementValue({
        elementId: '1666be97-5c43-4064-b145-bd5676a9a361',
        text: 'what is nightwatch?'
      })
      .setElementValue({
        elementId: '1666be97-5c43-4064-b145-bd5676a9a361',
        text: 'what is nightwatch?',
        response: {
          value: {
            error: 'stale element reference',
            message: 'stale element reference: element is not attached to the page document\n' +
              '  (Session info: headless chrome=95.0.4638.69)',
            stacktrace: ''
          }
        },
        statusCode: 404
      })
      .setElementValue({
        elementId: '1666be97-5c43-4064-b145-bd5676a9a361',
        text: 'what is nightwatch?'
      });

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: null,
      output: false,
      globals
    }));
  });

  it('run test with global element() and stale element error and retry success', function() {
    const testsPath = path.join(__dirname, '../../../apidemos/angular-test/angularTodoListWithElementGlobalAndError.js');
    Mocks
      .createNewW3CSession({
        postdata: {
          capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'chrome', 'goog:chromeOptions': {}}}
        }
      })
      .findElements({
        value: '[ng-model="todoList.todoText"]', response: {
          value: [
            {
              'element-6066-11e4-a52e-4f735466cecf': '1666be97-5c43-4064-b145-bd5676a9a361'
            }
          ]
        }
      })
      .setElementValue({
        elementId: '1666be97-5c43-4064-b145-bd5676a9a361',
        text: 'what is nightwatch?'
      })
      .setElementValue({
        elementId: '1666be97-5c43-4064-b145-bd5676a9a361',
        text: 'what is nightwatch?',
        response: {
          value: {
            error: 'stale element reference',
            message: 'stale element reference: element is not attached to the page document\n' +
              '  (Session info: headless chrome=95.0.4638.69)',
            stacktrace: ''
          }
        },
        statusCode: 404
      })
      .findElements({
        value: '[ng-model="todoList.todoText"]', response: {
          value: [
            {
              'element-6066-11e4-a52e-4f735466cecf': '1666be97-5c43-4064-b145-bd5676a9a360'
            }
          ]
        }
      })
      .setElementValue({
        elementId: '1666be97-5c43-4064-b145-bd5676a9a360',
        text: 'what is nightwatch?'
      });

    const globals = {
      waitForConditionPollInterval: 50,

      reporter(results) {
        if (results.lastError) {
          throw results.lastError;
        }
      }
    };

    return NightwatchClient.runTests(testsPath, settings({
      desiredCapabilities: {
        browserName: 'chrome'
      },
      selenium_host: null,
      output: false,
      globals
    }));
  });
});

const setupMocks = function({testSuiteName} = {}) {
  Mocks
    .createNewW3CSession({
      postdata: {
        capabilities: {firstMatch: [{}], alwaysMatch: {browserName: 'chrome', 'goog:chromeOptions': {}}}
      }
    })
    .navigateTo({url: 'http://localhost'})
    .navigateTo({url: 'https://angularjs.org'})
    .findElements({
      value: '[ng-model="todoList.todoText"]', response: {
        value: [
          {
            'element-6066-11e4-a52e-4f735466cecf': '1666be97-5c43-4064-b145-bd5676a9a361'
          }
        ]
      }
    })
    .setElementValue({
      elementId: '1666be97-5c43-4064-b145-bd5676a9a361',
      text: 'what is nightwatch?'
    })
    .findElements({
      value: '[value="add"]', response: {
        value: [
          {
            'element-6066-11e4-a52e-4f735466cecf': '7ef31e53-de68-4420-903e-465e6a3ff351'
          }
        ]
      }
    })
    .clickElement({
      elementId: '7ef31e53-de68-4420-903e-465e6a3ff351'
    })
    .findElements({
      times: 2, value: '[ng-repeat="todo in todoList.todos"]', response: {
        value: [
          {
            'element-6066-11e4-a52e-4f735466cecf': 'a1c2de89-42c2-4f6c-84fa-f6a656034838'
          },
          {
            'element-6066-11e4-a52e-4f735466cecf': 'aac4752d-6245-4a79-921a-127ee752eca0'
          },
          {
            'element-6066-11e4-a52e-4f735466cecf': '0cf4c839-a829-4a64-a01b-30047fd44397'
          }
        ]
      }
    })
    .getElementText({
      elementId: '0cf4c839-a829-4a64-a01b-30047fd44397',
      responseText: 'what is nightwatch?'
    })
    .findElementFromParent({
      elementId: '0cf4c839-a829-4a64-a01b-30047fd44397',
      response: {
        value: {
          'element-6066-11e4-a52e-4f735466cecf': '3ee091d4-0cce-4481-aabb-f5bef32a7bd9'
        }
      }
    })
    .findElements({
      times: 2, value: '[ng-repeat="todo in todoList.todos"] input', response: {
        value: [
          {
            'element-6066-11e4-a52e-4f735466cecf': '3ee091d4-0cce-4481-aabb-f5bef32a7bd1'
          },
          {
            'element-6066-11e4-a52e-4f735466cecf': '3ee091d4-0cce-4481-aabb-f5bef32a7bd9'
          },
          {
            'element-6066-11e4-a52e-4f735466cecf': '3ee091d4-0cce-4481-aabb-f5bef32a7bd0'
          }
        ]
      }
    })
    .clickElement({
      elementId: '3ee091d4-0cce-4481-aabb-f5bef32a7bd9'
    })
    .clickElement({
      elementId: '3ee091d4-0cce-4481-aabb-f5bef32a7bd0'
    })
    .findElements({
      value: '*[module=todoApp] li .done-true', response: {
        value: [
          {
            'element-6066-11e4-a52e-4f735466cecf': '6b23e23b-b083-4c58-ac63-90d44c47e9ae'
          },
          {
            'element-6066-11e4-a52e-4f735466cecf': 'aeb0ace1-296a-4258-9aab-38e6a3160288'
          }
        ]
      }
    });
};
