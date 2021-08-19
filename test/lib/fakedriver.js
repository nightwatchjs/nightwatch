const {WebElement} = require('selenium-webdriver');

const CommandsExecutor = {
  findChildElement(args, assertion) {
    assertion({args, command: 'findChildElement'});

    return fakeWebElement(TEST_CHILD_ELEMENT_ID);
  },

  findChildElements(args, assertion) {
    assertion({args, command: 'findChildElements'});

    return [fakeWebElement(TEST_CHILD_ELEMENT_ID)];
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
  },

  submitElement(webElement, assertion) {
    assertion({webElement, command: 'submit'});

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

const fakeSeleniumElement =  function(driver, elementId) {
  driver.execute =  function(command) {
    const commandName = command.getName();
    const params = command.getParameters();

    let result = CommandsExecutor[commandName](params, function(){});
    if (!(result instanceof Promise)) {
      result = Promise.resolve(result);
    }

    return result;
  };

  return new WebElement(driver, elementId);
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
        command: 'execute',
        script,
        args
      });

      return args;
    },
    executeAsyncScript(script, args) {
      assertion({
        command: 'executeAsync',
        script,
        args
      });

      return args;
    },
    takeScreenshot() {
      assertion({
        command: 'screenshot'
      });

      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    },
    getTitle() {
      assertion({
        command: 'title'
      });

      return 'nightwatch';
    },

    getWindowHandle() {
      assertion({
        command: 'windowHandle'
      });

      return 'CDwindow-BE13CA812F066254342F4FEB180D14ED';
    },
    getAllWindowHandles() {
      assertion({
        command: 'windowHandles'
      });

      return ['CDwindow-BE13CA812F066254342F4FEB180D14ED'];
    },
    close() {
      assertion({
        command: 'window'
      });

      return null;
    }
  };
};

const createWaitCommandMocks = function (assertion, args) {
  return {
    async wait(condn) {
      assertion({
        description: condn.description(), result: await condn.fn({
          getCurrentUrl() {
            return Promise.resolve(...args);
          },
          getTitle() {
            return Promise.resolve(...args);
          },
          findElements(locator) {
            const element = fakeWebElement(TEST_ELEMENT_ID);

            return Promise.resolve([
              element
            ]);
          },

          switchTo() {
            return {
              frame() {
                return Promise.resolve(null);
              },
              alert() {
                return Promise.resolve({
                  accept() {
                    return null;
                  },
                  dismiss() {
                    return null;
                  },
                  getText() {
                    return Promise.resolve('alert text');
                  },
                  sendKeys(value) {
                    return null;
                  }
                });
              }
            };
          }
        })
      });

      return Promise.resolve();
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
            },
            minimize() {
              assertion({
                command: 'minimizeWindow'
              });

              return null;
            },
            maximize() {
              assertion({
                command: 'windowMaximize'
              });

              return null;
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
        },

        setTimeouts(data) {
          assertion({data, command: 'timeouts'});

          return null;
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
          assertion({url, command: 'url'});

          return null;
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
      assertion({command: 'url'});

      return 'http://localhost';
    }
  };
};

module.exports = {
  fakeWebElement,
  fakeSeleniumElement,
  create(assertion, mockDriverOverrides, args) {
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
          },
          window(handleOrName) {
            assertion({
              command: 'window',
              name: handleOrName
            });

            return null;
          },
          newWindow(type){
            assertion({
              command: 'openNewWindow',
              type
            });

            return null;
          }
        };
      }
    };

    Object.assign(driver, createElementCommandMocks(assertion));
    Object.assign(driver, createNavigateCommandMocks(assertion));
    Object.assign(driver, createManageCommandMocks(assertion));
    Object.assign(driver, createGenericCommandMocks(assertion));
    Object.assign(driver, createWaitCommandMocks(assertion, args));
    Object.assign(driver, mockDriverOverrides);

    return driver;
  },
  createChromeDriver(assertion, mockDriverOverrides) {
    const chromeDriver = {
      launchApp(id) {
        assertion({id, command: 'launchApp'});

        return Promise.resolve(null);
      }
    };

    Object.assign(chromeDriver, mockDriverOverrides);

    return chromeDriver;
  }
};
