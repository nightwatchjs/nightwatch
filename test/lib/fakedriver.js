const CommandsExecutor = {
  findChildElement(args, assertion) {
    assertion({args, command: 'findChildElement'});

    return fakeWebElement(TEST_CHILD_ELEMENT_ID);
  },

  findChildElements(args, assertion) {
    assertion({args, command: 'findChildElements'});

    return [
      fakeWebElement(TEST_CHILD_ELEMENT_ID)
    ];
  },

  clearElement(args, assertion) {
    assertion({args, command: 'clearElement'});

    return null;
  },

  isElementSelected(args, assertion) {
    assertion({args, command: 'isElementSelected'});

    return true;
  },

  isElementEnabled(args, assertion) {
    assertion({args, command: 'isElementEnabled'});

    return true;
  },

  isElementDisplayed(args, assertion) {
    assertion({args, command: 'isElementDisplayed'});

    return true;
  },

  getElementAttribute(args, assertion) {
    assertion({args, command: 'getElementAttribute'});

    return 'test_value';
  },


  getElementProperty(args, assertion) {
    assertion({args, command: 'getElementProperty'});

    return 'test_prop_value';
  },

  getElementTagName(args, assertion) {
    assertion({args, command: 'getElementTagName'});

    return 'div';
  },

  getElementText(args, assertion) {
    assertion({args, command: 'getElementText'});

    return 'text';
  },

  clickElement(args, assertion) {
    assertion({args, command: 'clickElement'});

    return null;
  },

  getElementRect(args, assertion) {
    assertion({args, command: 'getElementRect'});

    return {
      width: 100,
      height: 105,
      x: 10,
      y: 15
    };
  },

  getElementValueOfCssProperty(args, assertion) {
    assertion({args, command: 'getElementValueOfCssProperty'});

    return '';
  },

  sendKeysToElement(args, assertion) {
    assertion({args, command: 'sendKeysToElement'});

    return null;
  }
};

const fakeWebElement = function(elementId) {
  return {
    getId() {
      return Promise.resolve(elementId);
    }
  };
};

const TEST_ELEMENT_ID = '12345-6789';
const TEST_CHILD_ELEMENT_ID = '6789-192111';

const createElementCommandMocks = function(assertion) {
  return {
    findElement(locator) {
      assertion({locator, command: 'findElement'});

      return fakeWebElement(TEST_ELEMENT_ID);
    },

    findElements(locator) {
      assertion({locator, command: 'findElements'});

      const element = fakeWebElement(TEST_ELEMENT_ID);

      return [
        element
      ];
    }
  };
};

const createGenericCommandMocks = function(assertion) {
  return {
    getPageSource() {
      assertion({
        command: 'getPageSource'
      });

      return '<html><body></body></html>';
    },
    executeScript(script, args) {
      assertion({
        command: 'executeScript',
        script: script,
        args: args
      });

      return args;
    },
    executeAsyncScript(script, args) {
      assertion({
        command: 'executeAsyncScript',
        script: script,
        args: args
      });

      return args;
    },
    takeScreenshot() {
      assertion({
        command: 'screenshot'
      });

      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    }
  };
};

const createManageCommandMocks = function(assertion) {
  return {
    manage() {
      return {
        addCookie(cookie) {
          assertion(cookie);
        },
        deleteCookie(cookie) {
          assertion(cookie);
        },
        deleteAllCookies() {
          assertion({
            command: 'deleteAllCookies'
          });
        },
        getCookies() {
          assertion('cookie-test');

          return Promise.resolve();
        },

        window() {
          return {
            setRect(...args) {
              assertion({
                args
              });

              return Promise.resolve({value: null});
            },
            getRect(...args) {
              return Promise.resolve({
                x: 10,
                y: 10,
                width: 100,
                height: 100
              });
            }
          };
        },

        logs() {
          return {
            get(type) {
              assertion({
                command: 'sessionLog'
              });

              return [{ 
                level: 'WARNING',
                message: 'https://cdn-static.ecosia.org/manifest.json - Manifest: property \'start_url\' ignored, should be same origin as document.',
                source: 'other',
                timestamp: 1628690813925 
              }]; 
            },
            getAvailableLogTypes() {

              assertion({
                command: 'sessionLogTypes'
              });

              return ['browser', 'driver'];
            }
          };
        }
      };
    }
  };
};

const createNavigateCommandMocks = function(assertion) {
  return {
    navigate() {
      return {
        to(url) {
          assertion(url);
        },
        back() {
          assertion();
        },
        refresh() {
          assertion();
        },
        forward() {
          assertion();
        }
      };
    },
    getCurrentUrl() {
      assertion('http://localhost');

      return 'http://localhost';
    }
  };
};

module.exports = {
  fakeWebElement,
  create(assertion, mockDriverOverrides) {
    const driver = {
      execute(command) {
        const commandName = command.getName();
        const params = command.getParameters();

        let result = CommandsExecutor[commandName](params, assertion);
        if (!(result instanceof Promise)) {
          result = Promise.resolve(result);
        }

        return result;
      },
      switchTo() {
        return {
          activeElement() {
            assertion({command: 'activeElement'});

            return fakeWebElement(TEST_ELEMENT_ID);
          },
          alert() {
            return {
              accept() {
                assertion();

                return null;
              },
              dismiss() {
                assertion();

                return null;
              },
              getText() {
                assertion('alert text');

                return Promise.resolve('alert text');
              },
              sendKeys(value) {
                assertion(value);

                return null;
              }
            };
          },
          frame(frameId) {
            assertion(frameId);

            return null;
          },
          frameParent() {
            return null;
          }
        };
      }
    };

    Object.assign(driver, createElementCommandMocks(assertion));
    Object.assign(driver, createNavigateCommandMocks(assertion));
    Object.assign(driver, createManageCommandMocks(assertion));
    Object.assign(driver, createGenericCommandMocks(assertion));
    Object.assign(driver, mockDriverOverrides);

    return driver;
  }
};
