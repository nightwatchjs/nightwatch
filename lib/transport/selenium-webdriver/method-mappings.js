const {WebElement, WebDriver, Origin, By, until, Condition, Key} = require('selenium-webdriver');
const {ShadowRoot} = require('selenium-webdriver/lib/webdriver');
const {Locator} = require('../../element');
const NightwatchLocator = require('../../element/locator-factory.js');
const {isString} = require('../../utils');
const fs = require('fs');
const cdp = require('./cdp.js');

module.exports = class MethodMappings {
  get driver() {
    return this.transport.driver;
  }

  get settings() {
    return this.transport.settings;
  }

  getWebElement(webElementOrString) {
    if (webElementOrString && (webElementOrString.webElement instanceof WebElement)) {
      webElementOrString = webElementOrString.webElement;
    }

    if (webElementOrString instanceof WebElement) {
      return webElementOrString;
    }

    if (isString(webElementOrString)) {
      return new WebElement(this.driver, webElementOrString);
    }

    throw new Error(`Unknown element: ${webElementOrString}`);
  }

  async runScriptForElement(scriptFn, webElementOrId) {
    const element = this.getWebElement(webElementOrId);
    const parentElementId = await element.getId();
    const {elementKey} = this.transport;

    return this.driver.executeScript(scriptFn, {[elementKey]: parentElementId});
  }

  async getElementByJs(scriptFn, webElementOrId) {
    try {
      const result = await this.runScriptForElement(scriptFn, webElementOrId);

      if (!result) {
        return {
          value: null,
          status: 0
        };
      }

      const {elementKey} = this.transport;
      const elementId = await result.getId();

      const returnValue = {
        value: {
          [elementKey]: elementId
        },
        status: 0,
        elementId
      };

      Object.assign(returnValue.value, {
        get getId() {
          return function () {
            return elementId;
          };
        }
      });

      return returnValue;
    } catch (error) {
      if (error.name === 'NoSuchElementError') {
        return {
          status: 0,
          value: null
        };
      }

      throw error;
    }
  }

  constructor(transport) {
    this.transport = transport;
  }

  executeFn(fn, name, args) {
    if (!Array.isArray(args)) {
      args = [args];
    }

    return this.driver[name](fn, ...args);
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
        async switchToWindow(windowHandle) {
          await this.driver.switchTo().window(windowHandle);

          return null;
        },

        async closeWindow() {
          await this.driver.close();

          return null;
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

        async maximizeWindow() {
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

        async setWindowPosition(x, y) {
          await this.driver.manage().window().setRect({
            x,
            y
          });

          return {
            value: null
          };
        },

        async getWindowSize(windowHandle) {
          const value = await this.driver.manage().window().getRect();

          // For backward compatibility
          if (windowHandle !== undefined) {
            return {
              value
            };
          }

          const {width, height} = value;

          return {
            value: {
              width,
              height
            }
          };
        },

        async setWindowSize(width, height) {
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
          const locator = NightwatchLocator.create(element, this.transport.api.isAppiumClient());
          const webElement = await this.driver.findElement(locator);
          const elementId = await webElement.getId();

          const {elementKey} = this.transport;

          return {
            value: {[elementKey]: elementId}
          };
        },

        async locateMultipleElements(element) {
          const locator = NightwatchLocator.create(element, this.transport.api.isAppiumClient());
          const resultValue = await this.driver.findElements(locator);

          if (Array.isArray(resultValue) && resultValue.length === 0) {
            return {
              status: -1,
              value: [],
              error: 'no such element',
              message: `Unable to locate element: ${locator.value} using ${locator.using}`
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

        async locateSingleElementByElementId({id, using, value}) {
          const locator = Locator.create({using, value});
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
          const locator = Locator.create({using, value});
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

        getElementAttribute(webElementOrId, attributeName) {
          if (this.transport.api.isAppiumClient()) {
            return `/element/${webElementOrId}/attribute/${attributeName}`;
          }

          const element = this.getWebElement(webElementOrId);

          return element.getAttribute(attributeName);
        },

        async getElementAccessibleName(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          const elementAccessibleName = await element.getAccessibleName();

          return elementAccessibleName;
        },

        async getElementAriaRole(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          const elementAriaRole = await element.getAriaRole();

          return elementAriaRole;
        },

        async takeElementScreenshot(webElementOrId, scroll) {
          const element = this.getWebElement(webElementOrId);
          const screenshotData = await element.takeScreenshot(scroll);

          return screenshotData;
        },

        async getElementCSSValue(webElementOrId, cssPropertyName) {
          const element = this.getWebElement(webElementOrId);
          const elementCssValue = await element.getCssValue(cssPropertyName);

          return elementCssValue;
        },

        async getElementProperty(webElementOrId, propertyName) {
          const element = this.getWebElement(webElementOrId);
          const elementValue = await element.getProperty(propertyName);

          return {
            value: elementValue
          };
        },

        async isElementActive(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          const elementId = await element.getId();

          const currentActiveElementId = await this.methods.session.getActiveElement.call(this);

          return elementId === currentActiveElementId;
        },

        async setElementProperty(webElementOrId, name, value) {
          const element = this.getWebElement(webElementOrId);

          await this.driver.executeScript(function (element, name, value) {
            element[name] = value;
          }, element, name, value);
        },

        async setElementAttribute(webElement, attrName, value) {
          const element = this.getWebElement(webElement);

          // eslint-disable-next-line
          /* istanbul ignore next */const fn = function (e, a, v) { try { if (e && typeof e.setAttribute == 'function') { e.setAttribute(a, v); } return true; } catch (err) { return { error: err.message, message: err.name + ': ' + err.message }; } };
          const elementId = await element.getId();

          const result = await this.driver.executeScript('var passedArgs = Array.prototype.slice.call(arguments,0); ' +
            'return (' + fn.toString() + ').apply(window, passedArgs);', {[this.transport.elementKey]: elementId}, attrName, value);

          return result;
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
        async getElementValue(webElementOrId, value) {
          const element = this.getWebElement(webElementOrId);
          const elementValue = await element.getAttribute(value);

          return elementValue;
        },

        isElementLocationInView(id) {
          return `/element/${id}/location_in_view`;
        },

        isElementDisplayed(webElementOrId) {
          if (this.transport.api.isAppiumClient()) {
            return `/element/${webElementOrId}/displayed`;
          }

          const element = this.getWebElement(webElementOrId);

          return element.isDisplayed();
        },

        async isElementEnabled(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          const value = await element.isEnabled();

          return value;
        },

        async isElementSelected(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          const value = await element.isSelected();

          return value;
        },

        async isElementPresent(webElement) {
          // webElement would be a Promise in case of new Element API.
          const element = await webElement;

          return element instanceof WebElement || element instanceof ShadowRoot;
        },

        async clearElementValue(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          await element.clear();

          try {
            const value = await element.getProperty('value');
            if (isString(value) && value.length > 0) {
              const backArr = Array(value.length).fill(Key.BACK_SPACE);
              await element.sendKeys(...backArr);
            }
          } catch {
            // silent catch
          }

          return null;
        },

        setElementValueRedacted(webElementOrId, value) {
          const modifiedValue = [Key.NULL].concat(value);

          return this.methods.session.setElementValue.call(this, webElementOrId, modifiedValue);
        },

        async checkElement(webElementOrId) {
          const element = await this.getWebElement(webElementOrId);
          const elementType = await element.getAttribute('type');
          const checkableTypes = ['checkbox', 'radio'];

          if (!checkableTypes.includes(elementType)) {
            throw new Error('must be an input element with type attribute \'checkbox\' or \'radio\'');
          }

          const value = await element.isSelected();

          if (!value) {
            await element.click();
          }

          return null;
        },

        async uncheckElement(webElementOrId) {
          const element = await this.getWebElement(webElementOrId);
          const elementType = await element.getAttribute('type');
          const checkableTypes = ['checkbox', 'radio'];

          if (!checkableTypes.includes(elementType)) {
            throw new Error('must be an input element with type attribute \'checkbox\' or \'radio\'');
          }

          const value = await element.isSelected();

          if (value) {
            await element.click();
          }

          return null;
        },

        async setElementValue(webElementOrId, value) {
          if (Array.isArray(value)) {
            value = value.join('');
          } else {
            value = String(value);
          }

          const element = this.getWebElement(webElementOrId);

          // clear Element value
          try {
            await this.methods.session.clearElementValue.call(this, webElementOrId);
          } catch (err) {
            if (err.name !== 'InvalidElementStateError') {
              throw err;
            }
          }
          await element.sendKeys(value);

          return null;
        },

        async sendKeysToElement(webElementOrId, value) {
          if (Array.isArray(value)) {
            if (value.includes(undefined) || value.includes(null)) {
              throw TypeError('each key must be a number or string; got ' + value);
            }
            value = value.join('');
          }

          const element = this.getWebElement(webElementOrId);

          await element.sendKeys(value);

          return null;
        },

        async uploadFile(webElementOrId, filepath) {
          const remote = require('selenium-webdriver/remote');
          this.driver.setFileDetector(new remote.FileDetector());

          const element = this.getWebElement(webElementOrId);
          await element.sendKeys(filepath);

          return {
            value: null
          };
        },

        async clickElement(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          await element.click();

          return null;
        },

        async clickElementWithJS(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          await this.driver.executeScript('arguments[0].click();', element);

          return null;
        },

        async elementSubmit(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
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

        async getFirstElementChild(webElementOrId) {
          return await this.getElementByJs(function (element) {
            return element && element.firstElementChild;
          }, webElementOrId);
        },

        /**
         * @param {WebElement} webElement
         */
        inspectInDevTools(webElement, content = 'Element') {
          return this.driver.executeScript(function (element, content) {
            // eslint-disable-next-line no-console
            console.log(content + ':', element);
          }, webElement, content);
        },

        async getLastElementChild(webElementOrId) {
          return await this.getElementByJs(function (element) {
            return element && element.lastElementChild;
          }, webElementOrId);
        },

        async getNextSibling(webElementOrId) {
          return await this.getElementByJs(function (element) {
            return element && element.nextElementSibling;
          }, webElementOrId);
        },

        async getPreviousSibling(webElementOrId) {
          return await this.getElementByJs(function (element) {
            return element && element.previousElementSibling;
          }, webElementOrId);
        },

        async getShadowRoot(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          const shadowRoot = await element.getShadowRoot();

          return shadowRoot;
        },

        async elementHasDescendants(webElementOrId) {
          const count = await this.runScriptForElement(function (element) {
            return element ? element.childElementCount : null;
          }, webElementOrId);

          if (count === null) {
            throw new Error('No such element: ' + webElementOrId);
          }

          return count > 0;
        },

        ///////////////////////////////////////////////////////////
        // Document Handling
        ///////////////////////////////////////////////////////////
        async getPageSource() {
          const value = await this.driver.getPageSource();

          return value;
        },

        async executeScript(script, args) {
          const value = await this.executeFn(script, 'executeScript', args);

          return {
            value
          };
        },

        async executeAsyncScript(fn, args) {
          const value = await this.executeFn(fn, 'executeAsyncScript', args);

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
          try {
            const result = await this.driver.manage().getCookie(name);

            return {
              value: result
            };
          } catch (err) {
            if (err.name === 'NoSuchCookieError') {
              return null;
            }

            throw err;
          }
        },

        ///////////////////////////////////////////////////////////
        // User Actions
        ///////////////////////////////////////////////////////////
        async doubleClick(webElement) {
          if (webElement) {
            webElement = this.getWebElement(webElement);
          }
          await this.driver.actions({async: true}).doubleClick(webElement).perform();

          return null;
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
         * @param {string|WebElement|null} origin
         * @param {number} x
         * @param {number} y
         * @param {object} [options]
         * @param {number} [duration]
         */

        async moveTo(origin, x, y, duration, options = {}) {
          switch (origin) {
            case Origin.POINTER:
              break;
            case Origin.VIEWPORT:
              break;

            default:
              origin = this.getWebElement(origin);
          }

          const moveOptions = {origin, x, y};
          if (typeof duration != 'undefined') {
            moveOptions.duration = duration;
          }

          await this.driver.actions(options).move(moveOptions).perform();

          return null;
        },

        async dragElement(source, destination) {
          source = this.getWebElement(source);

          //destination could be webElementId or {x,y} offset
          if (typeof destination === 'string') {
            destination = this.getWebElement(destination);
          }

          await this.driver.actions({async: true}).dragAndDrop(source, destination).perform();

          return null;
        },

        async contextClick(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          await this.driver.actions({async: true}).contextClick(element).perform();

          return null;
        },

        async pressAndHold(webElementOrId) {

          const element = this.getWebElement(webElementOrId);
          await this.driver.actions({async: true}).move({origin: element}).press().perform();

          return null;
        },

        async release(webElementOrId) {
          await this.driver.actions({async: true}).release().perform();

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

        ///////////////////////////////////////////////////////////
        // Appium
        ///////////////////////////////////////////////////////////

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

        startActivity(opts) {
          return {
            method: 'POST',
            path: '/appium/device/start_activity',
            data: opts
          };
        },

        getCurrentActivity() {
          return '/appium/device/current_activity';
        },

        getCurrentPackage() {
          return '/appium/device/current_package';
        },

        getDeviceGeolocation() {
          return '/location';
        },

        setDeviceGeolocation(location) {
          return {
            method: 'POST',
            path: '/location',
            data: {location}
          };
        },

        pressDeviceKeyCode(opts) {
          return {
            method: 'POST',
            path: '/appium/device/press_keycode',
            data: opts
          };
        },

        longPressDeviceKeyCode(opts) {
          return {
            method: 'POST',
            path: '/appium/device/long_press_keycode',
            data: opts
          };
        },

        hideDeviceKeyboard(opts) {
          return {
            method: 'POST',
            path: '/appium/device/hide_keyboard',
            data: opts
          };
        },

        isDeviceKeyboardShown() {
          return '/appium/device/is_keyboard_shown';
        },

        resetApp() {
          return {
            method: 'POST',
            path: '/appium/app/reset'
          };
        },

        ///////////////////////////////////////////////////////////////////////////
        // Selenium Webdriver
        ///////////////////////////////////////////////////////////////////////////
        async wait(conditionFn, timeMs, message, retryInterval) {
          const driver = new WebDriver(Promise.resolve());
          await driver.wait(conditionFn instanceof Condition ? conditionFn : conditionFn(), timeMs, message, retryInterval);

          return {
            value: null
          };
        },


        async setNetworkConditions(spec) {
          await this.driver.setNetworkConditions(spec);

          return {
            value: null
          };
        },

        waitUntilElementsLocated({condition, timeout, retryInterval}) {
          return this.driver.wait(until.elementsLocated(condition), timeout, null, retryInterval);
        },

        ///////////////////////////////////////////////////////////////////////////
        // BiDi apis
        ///////////////////////////////////////////////////////////////////////////

        async registerAuth(username, password) {
          const cdpConnection = await cdp.getConnection(this.driver, true);
          await this.driver.register(username, password, cdpConnection);

          return {
            value: null
          };
        },

        async startLogsCapture(userCallback) {
          const cdpConnection = await cdp.getConnection(this.driver);
          await this.driver.onLogEvent(cdpConnection, userCallback);

          return {
            value: null
          };
        },

        async catchJsExceptions(userCallback) {
          const cdpConnection = await cdp.getConnection(this.driver);
          await this.driver.onLogException(cdpConnection, userCallback);

          return {
            value: null
          };
        },

        ///////////////////////////////////////////////////////////////////////////
        // CDP commands
        ///////////////////////////////////////////////////////////////////////////

        async setGeolocation(coordinates) {
          const cdpConnection = await cdp.getConnection(this.driver);

          await cdpConnection.execute(
            'Emulation.setGeolocationOverride',
            coordinates
          );

          return {
            value: null
          };
        },

        async clearGeolocation() {
          const cdpConnection = await cdp.getConnection(this.driver);

          await cdpConnection.execute(
            'Emulation.clearGeolocationOverride',
            {}
          );

          return {
            value: null
          };
        },

        async setDeviceMetrics(metrics) {
          const cdpConnection = await cdp.getConnection(this.driver);

          await cdpConnection.execute(
            'Emulation.setDeviceMetricsOverride',
            metrics
          );

          return {
            value: null
          };
        },

        async interceptNetworkCalls(userCallback) {
          const cdpConnection = await cdp.getConnection(this.driver);

          cdpConnection._wsConnection.on('message', (message) => {
            const params = JSON.parse(message);
            if (params.method === 'Network.requestWillBeSent') {
              const requestParams = params['params'];

              userCallback(requestParams);
            }
          });

          await cdpConnection.execute(
            'Network.enable',
            {}
          );

          return {
            value: null
          };
        },

        async mockNetworkResponse(urlToIntercept, response) {
          const cdpConnection = await cdp.getConnection(this.driver);

          const {status = 200, headers: headersObject, body: bodyPlain = ''} = response;
          const headers = [];
          if (headersObject) {
            for (const [name, value] of Object.entries(headersObject)) {
              headers.push({name, value});
            }
          }
          // Convert body to base64
          const bodyBase64 = Buffer.from(bodyPlain, 'utf-8').toString('base64');

          cdp.addNetworkMock(urlToIntercept, {status, headers, body: bodyBase64});

          // Add event listener only the first time.
          if (Object.keys(cdp.networkMocks).length === 1) {
            cdpConnection._wsConnection.on('message', (message) => {
              const params = JSON.parse(message);
              if (params.method === 'Fetch.requestPaused') {
                const requestPausedParams = params['params'];
                const requestUrl = requestPausedParams.request.url;

                const networkMocks = cdp.networkMocks;
                if (Object.keys(networkMocks).includes(requestUrl)) {
                  const mockResponse = networkMocks[requestUrl];
                  cdpConnection.execute('Fetch.fulfillRequest', {
                    requestId: requestPausedParams['requestId'],
                    responseCode: mockResponse.status,
                    responseHeaders: mockResponse.headers,
                    body: mockResponse.body
                  });
                } else {
                  cdpConnection.execute('Fetch.continueRequest', {
                    requestId: requestPausedParams['requestId']
                  });
                }
              }
            });
          }

          await cdpConnection.execute(
            'Fetch.enable',
            {}
          );
          await cdpConnection.execute(
            'Network.setCacheDisabled',
            {cacheDisabled: true}
          );

          return {
            value: null
          };
        },

        async takeHeapSnapshot(heapSnapshotLocation) {
          const cdpConnection = await cdp.getConnection(this.driver);

          const chunks = [];
          cdpConnection._wsConnection.on('message', (message) => {
            const params = JSON.parse(message);
            if (params.method === 'HeapProfiler.addHeapSnapshotChunk') {
              const chunk = params['params']['chunk'];

              chunks.push(chunk);
            }
          });

          await cdpConnection.execute(
            'HeapProfiler.enable',
            {}
          );

          await cdpConnection.execute(
            'HeapProfiler.takeHeapSnapshot',
            {}
          );

          let prevChunks = [];

          return new Promise((resolve) => {
            const intervalId = setInterval(() => {
              if (prevChunks.length !== 0 && prevChunks.length === chunks.length) {
                resolveAndClearInterval();
              }
              prevChunks = [...chunks];
            }, 100);

            const resolveAndClearInterval = () => {
              clearInterval(intervalId);

              const heapSnapshot = chunks.join('');
              if (heapSnapshotLocation) {
                fs.writeFileSync(heapSnapshotLocation, heapSnapshot);
              }

              resolve({value: heapSnapshot});
            };
          });
        },

        async enablePerformanceMetrics(enable) {
          // Disable the metrics once even before enabling it.
          await this.driver.sendAndGetDevToolsCommand('Performance.disable');

          if (enable) {
            await this.driver.sendAndGetDevToolsCommand('Performance.enable');
          }

          return {
            value: null
          };
        },

        async getPerformanceMetrics() {
          const {metrics: metricsReturned} = await this.driver.sendAndGetDevToolsCommand('Performance.getMetrics');

          const metrics = {};
          for (const metric of metricsReturned) {
            metrics[metric.name] = metric.value;
          }

          return {
            value: metrics
          };
        }

      }
    };
  }
};
