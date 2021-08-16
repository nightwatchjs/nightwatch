const {WebElement} = require('selenium-webdriver');
const SeleniumWebdriver = require('./');
const {isString} = require('../../utils');

module.exports = class MethodMappings {
  get driver() {
    return this.transport.driver;
  }

  get settings() {
    return this.transport.settings;
  }

  getWebElement(webElementOrString) {
    if (webElementOrString instanceof WebElement) {
      return webElementOrString;
    }

    if (isString(webElementOrString)) {
      return new WebElement(this.driver, webElementOrString);
    }

    throw new Error(`Unknown element: ${webElementOrString}`);
  }

  constructor(transport) {
    this.transport = transport;
  }

  get methods() {
    return {
      ///////////////////////////////////////////////////////////
      // Session related
      ///////////////////////////////////////////////////////////
      async sessionAction(action) {
        switch (action) {
          case 'DELETE': {
            await this.driver.quit();

            return {
              state: 'success',
              value: null
            };
          }


          default:
            return this.driver.getSession();
        }
      },

      getSessions() {
        return '/sessions';
      },

      getStatus() {
        return '/status';
      },

      session: {
        ///////////////////////////////////////////////////////////
        // Timeouts
        ///////////////////////////////////////////////////////////
        async setTimeoutType(type, value) {
          await this.driver.manage().setTimeouts({
            [type]: value
          });

          return null;
        },

        async setTimeoutsAsyncScript(value) {
          await this.driver.manage().setTimeouts({script: value});

          return null;
        },

        async setTimeoutsImplicitWait(value) {
          await this.driver.manage().setTimeouts({implicit: value});

          return null;
        },

        getTimeouts() {
          return this.driver.manage().getTimeouts();
        },

        ///////////////////////////////////////////////////////////
        // Session log
        ///////////////////////////////////////////////////////////
        async getSessionLogTypes() {
          const value = await this.driver.manage().logs().getAvailableLogTypes();

          return {
            value
          };
        },

        async getLogContents(type) {
          const value = await this.driver.manage().logs().get(type);

          return {
            value: value.map(item => {
              return {
                level: {
                  value: item.level.value,
                  name: item.level.name
                },
                type: item.type,
                timestamp: item.timestamp,
                message: item.message
              };
            })
          };
        },

        ///////////////////////////////////////////////////////////
        // Navigation
        ///////////////////////////////////////////////////////////
        async navigateTo(url) {
          await this.driver.navigate().to(url);

          return null;
        },

        async getCurrentUrl() {
          const url = await this.driver.getCurrentUrl();

          return url;
        },

        async navigateBack() {
          await this.driver.navigate().back();

          return null;
        },

        async navigateForward() {
          await this.driver.navigate().forward();

          return null;
        },

        async pageRefresh() {
          await this.driver.navigate().refresh();

          return null;
        },

        async getPageTitle() {
          const title = await this.driver.getTitle();

          return title;
        },

        ///////////////////////////////////////////////////////////
        // Windows
        ///////////////////////////////////////////////////////////
        async switchToWindow(handleOrName) {
          await this.driver.switchTo().window(handleOrName);

          return null;
        },

        async closeWindow() {
          return this.driver.close();
        },

        /**
         * @returns {string}
         */
        async getWindowHandle() {
          const value = await this.driver.getWindowHandle();

          return value;
        },

        async getAllWindowHandles() {
          const value = await this.driver.getAllWindowHandles();

          return {
            value
          };
        },

        async getWindowPosition() {
          const {x, y} = await this.driver.manage().window().getRect();

          return {
            value: {
              x,
              y
            }
          };
        },

        async maximizeWindow(windowHandle) {
          await this.driver.manage().window().maximize();

          return null;
        },

        async minimizeWindow() {
          await this.driver.manage().window().minimize();

          return null;
        },

        async fullscreenWindow() {
          await this.driver.manage().window().fullscreen();

          return null;
        },

        async openNewWindow(type = 'tab') {
          await this.driver.switchTo().newWindow(type);

          return null;
        },

        async setWindowPosition(windowHandle, x, y) {
          await this.driver.manage().window().setRect({
            x,
            y
          });

          return {
            value: null
          };
        },

        async getWindowSize() {
          const value = await this.driver.manage().window().getRect();

          return {
            value
          };
        },

        //Kept windowHandle as params for backward compatibility.
        async setWindowSize(windowHandle, width, height) {
          await this.driver.manage().window().setRect({
            width,
            height
          });

          return {
            value: null
          };
        },

        async getWindowRect() {
          const value = await this.driver.manage().window().getRect();

          return {
            value
          };
        },

        async setWindowRect(data) {
          await this.driver.manage().window().setRect(data);

          return {
            value: null
          };
        },
        ///////////////////////////////////////////////////////////
        // Frames
        ///////////////////////////////////////////////////////////
        async switchToFrame(frameId) {
          if (frameId === undefined) {
            frameId = null;
          }

          await this.driver.switchTo().frame(frameId);

          return {
            value: null
          };
        },

        async switchToParentFrame() {
          await this.driver.switchTo().parentFrame();

          return {
            value: null
          };
        },

        ///////////////////////////////////////////////////////////
        // Elements
        ///////////////////////////////////////////////////////////
        async locateSingleElement(element) {
          const locator = SeleniumWebdriver.createLocator(element);
          const webElement = await this.driver.findElement(locator);
          const elementId = await webElement.getId();

          const {elementKey} = this.transport;

          return {
            value: {[elementKey]: elementId}
          };
        },

        async locateMultipleElements(element) {
          const locator = SeleniumWebdriver.createLocator(element);
          const resultValue = await this.driver.findElements(locator);

          if (Array.isArray(resultValue) && resultValue.length === 0) {
            return {
              status: 0,
              value: [],
              error: `unable to locate element using ${locator.using}`
            };
          }

          const {elementKey} = this.transport;
          const value = await Promise.all(resultValue.map(async webElement => {
            const elementId = await webElement.getId();

            return {[elementKey]: elementId};
          }));

          return value;
        },


        elementIdEquals(id, otherId) {
          return `/element/${id}/equals/${otherId}`;
        },

        async locateSingleElementByElementId({id, value}) {
          const locator = SeleniumWebdriver.createLocator(value);
          const element = await this.getWebElement(id);
          const webElement = await element.findElement(locator);
          const elementId = await webElement.getId();

          const {elementKey} = this.transport;

          return {
            value: {[elementKey]: elementId},
            status: 0,
            elementId
          };
        },

        async locateMultipleElementsByElementId({id, using, value}) {
          const locator = SeleniumWebdriver.createLocator(value);
          const element = await this.getWebElement(id);
          const resultValue = await element.findElements(locator);

          const {elementKey} = this.transport;
          const resultProcessed = await Promise.all(resultValue.map(async webElement => {
            const elementId = await webElement.getId();

            return {[elementKey]: elementId};
          }));

          return resultProcessed;
        },

        async getActiveElement() {
          const webElement = await this.driver.switchTo().activeElement();
          const elementId = await webElement.getId();

          return elementId;
        },

        async getElementAttribute(webElement, attributeName) {
          const element = this.getWebElement(webElement);
          const attrValue = await element.getAttribute(attributeName);

          return {
            value: attrValue
          };
        },

        async getElementAccessibleName(webElement) {
          const element = this.getWebElement(webElement);
          const elementAccessibleName = await element.getAccessibleName();

          return elementAccessibleName;
        },

        async getElementAriaRole(webElement) {
          const element = this.getWebElement(webElement);
          const elementAriaRole = await element.getAriaRole();

          return elementAriaRole;
        },

        async takeElementScreenshot(webElement, scroll) {
          const element = this.getWebElement(webElement);
          const screenshotData = await element.takeScreenshot(scroll);

          return screenshotData;
        },

        async getElementCSSValue(id, cssPropertyName) {
          const element = this.getWebElement(id);
          const elementCssValue = await element.getCssValue(cssPropertyName);

          return elementCssValue;
        },

        async getElementProperty(webElement, propertyName) {
          const element = this.getWebElement(webElement);
          const elementValue = await element.getProperty(propertyName);

          return {
            value: elementValue
          };
        },

        async getElementTagName(id) {
          const element = this.getWebElement(id);
          const elementTagName = await element.getTagName();

          return elementTagName;
        },

        async getElementRect(id) {
          const element = this.getWebElement(id);

          try {
            const value = await element.getRect();

            return {
              value
            };
          } catch (error) {
            error.message = `Unable to get element rect because of: ${error.message}`;

            return {
              error,
              status: -1,
              value: null
            };
          }
        },

        async getElementText(id) {
          const element = this.getWebElement(id);
          const elementText = await element.getText();

          return elementText;
        },

        // the value param is compulsory
        async getElementValue(webElement, value) {
          const element = this.getWebElement(webElement);
          const elementValue = await element.getAttribute(value);

          return elementValue;
        },

        isElementLocationInView(id) {
          return `/element/${id}/location_in_view`;
        },

        isElementDisplayed(webElement) {
          const element = this.getWebElement(webElement);

          // WebElement's created outside won't use the /displayed endpoint
          //const value = element.isDisplayed();

          return {
            path: async function() {
              const elementId = await element.getId();

              return `/element/${elementId}/displayed`;
            }
          };
        },

        async isElementEnabled(webElement) {
          const element = this.getWebElement(webElement);
          const value = await element.isEnabled();

          return value;
        },

        async isElementSelected(webElement) {
          const element = this.getWebElement(webElement);
          const value = await element.isSelected();

          return value;
        },

        async clearElementValue(webElement) {
          const element = this.getWebElement(webElement);
          await element.clear();

          return null;
        },

        setElementValueRedacted(...args) {
          // FIXME: redact password in verbose HTTP logs, it's only redacted in the command logs
          return this.methods.session.setElementValue.call(this, ...args);
        },

        async setElementValue(webElement, value) {
          if (Array.isArray(value)) {
            value = value.join('');
          } else {
            value = String(value);
          }

          const element = this.getWebElement(webElement);

          // clear Element value
          await element.clear();
          await element.sendKeys(value);

          return null;
        },

        async clickElement(webElement) {
          const element = this.getWebElement(webElement);
          await element.click();

          return null;
        },

        async elementSubmit(webElement) {
          const element = this.getWebElement(webElement);
          await element.submit();

          return null;
        },

        sendKeys(keys) {
          return {
            method: 'POST',
            path: '/keys',
            data: {
              value: keys
            }
          };
        },

        ///////////////////////////////////////////////////////////
        // Document Handling
        ///////////////////////////////////////////////////////////
        async getPageSource() {
          const value = await this.driver.getPageSource();

          return value;
        },

        async executeScript(script, args) {
          const value = await this.driver.executeScript(script, args);

          return {
            value
          };
        },

        async executeScriptAsync(fn, args) {
          const value = await this.driver.executeAsyncScript(fn, args);

          return {
            value
          };
        },

        ///////////////////////////////////////////////////////////
        // Cookies
        ///////////////////////////////////////////////////////////
        async addCookie(cookie) {
          await this.driver.manage().addCookie(cookie);

          return null;
        },

        async deleteCookie(cookieName) {
          await this.driver.manage().deleteCookie(cookieName);

          return null;
        },

        async deleteAllCookies() {
          await this.driver.manage().deleteAllCookies();

          return null;
        },

        getCookies() {
          return this.driver.manage().getCookies();
        },

        async getCookie(name) {
          const result = await this.driver.manage().getCookie(name);

          return result;
        },

        ///////////////////////////////////////////////////////////
        // User Actions
        ///////////////////////////////////////////////////////////
        /**
         * @deprecated
         */
        doubleClick() {
          return {
            path: '/doubleclick',
            method: 'POST'
          };
        },

        /**
         * @deprecated
         */
        mouseButtonClick(buttonIndex) {
          return {
            method: 'POST',
            path: '/click',
            data: {
              button: buttonIndex
            }
          };
        },

        mouseButtonUp(buttonIndex) {
          return {
            method: 'POST',
            path: '/buttonup',
            data: {
              button: buttonIndex
            }
          };
        },

        mouseButtonDown(buttonIndex) {
          return {
            method: 'POST',
            path: '/buttondown',
            data: {
              button: buttonIndex
            }
          };
        },

        /**
         *
         * @param {object} options
         * @param {number} duration
         * @param {object} origin
         * @param {number} xOffset
         * @param {number} yOffset
         */
        async moveTo(options, duration, origin, xOffset, yOffset) {
          await this.driver.actions(options).move({duration, origin, xOffset, yOffset});

          return null;
        },

        ///////////////////////////////////////////////////////////
        // User Prompts
        ///////////////////////////////////////////////////////////
        async acceptAlert() {
          await this.driver.switchTo().alert().accept();

          return null;
        },

        async dismissAlert() {
          await this.driver.switchTo().alert().dismiss();

          return null;
        },

        getAlertText() {
          return this.driver.switchTo().alert().getText();
        },

        async setAlertText(keys) {
          await this.driver.switchTo().alert().sendKeys(keys);

          return null;
        },

        ///////////////////////////////////////////////////////////
        // Screen
        ///////////////////////////////////////////////////////////
        async getScreenshot(logBase64Data) {
          const data = await this.driver.takeScreenshot();

          return {
            value: data,
            status: 0,
            suppressBase64Data: !logBase64Data
          };
        },

        getScreenOrientation() {
          return '/orientation';
        },

        setScreenOrientation(orientation) {
          return {
            method: 'POST',
            path: '/orientation',
            data: {
              orientation
            }
          };
        },

        getAvailableContexts() {
          return '/contexts';
        },

        getCurrentContext() {
          return '/context';
        },

        setCurrentContext(context) {
          return {
            method: 'POST',
            path: '/context',
            data: {
              name: context
            }
          };
        },

        ///////////////////////////////////////////////////////////////////////////
        // Selenium Webdriver
        ///////////////////////////////////////////////////////////////////////////
        async wait(conditionFn, timeMs) {
          // TODO: make .wait() behave like an alias to .pause() if first argument is number
          await this.driver.wait(conditionFn(), timeMs);

          return {
            value: null
          };
        }
      }
    };
  }
};
