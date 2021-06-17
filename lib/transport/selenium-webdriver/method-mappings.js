const {until, WebElement} = require('selenium-webdriver');
const SeleniumWebdriver = require('./');
const Transport = require('../');
const {Logger, isString} = require('../../utils');

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
  }

  constructor(transport) {
    this.transport = transport;
  }

  get methods() {
    return {
      ///////////////////////////////////////////////////////////
      // Session related
      ///////////////////////////////////////////////////////////
      sessionAction(action) {
        switch (action) {
          case 'DELETE':
            return this.driver.quit();

          default:
            return this.driver.getSession();
        }
      },

      getSessions: '/sessions',
      getStatus: '/status',

      session: {
        ///////////////////////////////////////////////////////////
        // Timeouts
        ///////////////////////////////////////////////////////////
        async setTimeoutType(type, value) {
          await this.driver.manage().setTimeouts({
            [type]: value
          });

          return {
            value: null
          };
        },

        async setTimeoutsAsyncScript(value) {
          await this.driver.manage().setTimeouts({script: value});

          return  {
            value: null
          };
        },

        async setTimeoutsImplicitWait(value) {
          await this.driver.manage().setTimeouts({implicit: value});

          return  {
            value: null
          };
        },

        getTimeouts: '/timeouts',

        ///////////////////////////////////////////////////////////
        // Session log
        ///////////////////////////////////////////////////////////
        async getSessionLogTypes() {
          const value =  await this.driver.manage().logs().getAvailableLogTypes();

          return {
            value
          };
        },

        async getLogContents(type) {
          const value = await this.driver.manage().logs().get(type);

          return {
            value
          };
        },

        ///////////////////////////////////////////////////////////
        // Navigation
        ///////////////////////////////////////////////////////////
        async navigateTo(url) {
          await this.driver.navigate().to(url);

          return {
            value: null
          };
        },

        getCurrentUrl: '/url',
        navigateBack() {
          return TransportActions.post({
            path: '/back'
          });
        },
        navigateForward() {
          return TransportActions.post({
            path: '/forward'
          });
        },
        pageRefresh() {
          return TransportActions.post({
            path: '/refresh'
          });
        },
        getPageTitle: '/title',

        ///////////////////////////////////////////////////////////
        // Windows
        ///////////////////////////////////////////////////////////
        async switchToWindow(handle) {
          await this.driver.switchTo().window(handle);

          return {
            value: null
          };
        },

        async closeWindow() {
          await this.driver.close();

          return {
            value: null
          };
        },

        async getWindowHandle() {
          const value = await this.driver.getWindowHandle();

          return {
            value
          };
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

          return {
            value: null
          };
        },

        async minimizeWindow() {
          await this.driver.manage().window().minimize();

          return {
            value: null
          };
        },

        async fullscreenWindow() {
          await this.driver.manage().window().fullscreen();

          return {
            value: null
          };
        },

        async openNewWindow() {
          // return TransportActions.post('/window/new');
          await this.driver.switchTo().newWindow('window');

          return {
            value: null
          };
        },

        //Kept windowHandle as params for backward comptability.
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
          const {width, height} = await this.driver.manage().window().getRect();

          return {
            value: {
              width,
              height
            }
          };
        },

        //Kept windowHandle as params for backward comptability.
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

          await this.driver.manage().switchToFrame({
            id: frameId
          });

          return {
            value: null
          };
        },

        async switchToParentFrame() {
          await this.driver.manage().switchToParentFrame();

          return {
            value: null
          };
        },

        ///////////////////////////////////////////////////////////
        // Elements
        ///////////////////////////////////////////////////////////
        async locateSingleElement(element) {
          const locator = SeleniumWebdriver.createLocator(element);
          //const {waitForConditionTimeout, waitForConditionPollInterval}

          const webElement = await this.driver.wait(until.elementLocated(locator));
          const elementId = await webElement.getId();

          return {
            value: elementId,
            webElement
          };
        },

        async locateMultipleElements(element) {
          const locator = SeleniumWebdriver.createLocator(element);
          const resultValue = await this.driver.findElements(locator);
          const resultProcessed = await Promise.all(resultValue.map(async webElement => {
            const elementId = await webElement.getId();

            return {[Transport.WEB_ELEMENT_ID]: elementId};
          }));

          return {
            value: resultProcessed
          };
        },

        elementIdEquals(id, otherId) {
          return `/element/${id}/equals/${otherId}`;
        },

        async locateSingleElementByElementId({id, value}) {
          const locator = SeleniumWebdriver.createLocator(value);
          const element = await this.getWebElement(id);

          const webElement = await element.findElement(locator);

          const elementId = await webElement.getId();

          return {
            value: webElement,
            elementId
          };
        },

        async locateMultipleElementsByElementId({id, using, value}) {
          const locator = SeleniumWebdriver.createLocator(value);
          const element = await this.getWebElement(id);
          const resultValue = await element.findElements(locator);

          const resultProcessed = await Promise.all(resultValue.map(async webElement => {
            const elementId = await webElement.getId();

            return {[Transport.WEB_ELEMENT_ID]: elementId};
          }));

          return {
            value: resultProcessed
          };
        },

        getActiveElement() {
          return TransportActions.post('/element/active');
        },

        async getElementAttribute(webElement, attributeName) {
          const element = this.getWebElement(webElement);
          const elementValue = await element.getAttribute(attributeName);

          return {
            value: elementValue
          };
        },

        async getElementCSSValue(id, cssPropertyName) {
          const element = this.getWebElement(id);
          const elementCssValue = await element.getCssValue(cssPropertyName);

          return {
            value: elementCssValue
          };
        },

        async getElementProperty(webElement, propertyName) {
          const element = this.getWebElement(webElement);
          const elementValue = await element.getAttribute(propertyName);

          return {
            value: elementValue
          };
        },

        async getElementTagName(id) {
          const element = this.getWebElement(id);
          const elementTagName = await element.getTagName();

          return {
            value: elementTagName
          };
        },

        async getElementSize(id) {
          const element = this.getWebElement(id);
          const elementSize = await element.getRect();

          return {
            value: elementSize
          };
        },

        async getElementText(id) {
          const element = this.getWebElement(id);
          const elementText = await element.getText();

          return {
            value: elementText
          };
        },

        // the value param is compulsory
        async getElementValue(webElement, value) {
          const element = this.getWebElement(webElement);
          const elementValue = await element.getAttribute(value);

          return {
            value: elementValue
          };
        },

        async getElementLocation(id) {
          const element = this.getWebElement(id);
          const {x, y} = await element.getRect();

          return {
            value: {
              x,
              y
            }
          };
        },

        isElementLocationInView(id) {
          return `/element/${id}/location_in_view`;
        },

        async isElementDisplayed(webElement) {
          try {
            const element = this.getWebElement(webElement);
            const value = await element.isDisplayed();

            return {
              value
            };
          } catch (error) {
            Logger.error(error);

            return {
              error,
              status: -1
            };
          }
        },

        async isElementEnabled(webElement) {
          try {
            const element = this.getWebElement(webElement);
            const value = await element.isEnabled();

            return {
              value
            };
          } catch (error) {
            Logger.error(error);

            return {
              error,
              status: -1
            };
          }
        },

        async isElementSelected(webElement) {
          try {
            const element = this.getWebElement(webElement);
            const value = await element.isSelected();

            return {
              value
            };
          } catch (error) {
            Logger.error(error);

            return {
              error,
              status: -1
            };
          }
        },

        async clearElementValue(webElement) {
          const element = this.getWebElement(webElement);
          await element.clear();

          return {
            value: null
          };
        },

        async setElementValue(webElement, value) {
          if (Array.isArray(value)) {
            value = value.join('');
          } else {
            value = String(value);
          }

          try {
            const element = this.getWebElement(webElement);
            await element.sendKeys(value);

            return {
              value: null
            };
          } catch (error) {
            Logger.error(error);

            return {
              error,
              status: -1
            };
          }
        },

        async clickElement(webElement) {
          try {
            const element = this.getWebElement(webElement);
            await element.click();

            return {
              value: null
            };
          } catch (error) {
            Logger.error(error);

            return {
              error,
              status: -1
            };
          }
        },

        async elementSubmit(webElement) {
          try {
            const element = this.getWebElement(webElement);
            await element.submit();

            return {
              value: null
            };
          } catch (error) {
            Logger.error(error);

            return {
              error,
              status: -1
            };
          }
        },

        sendKeys(keys) {
          return TransportActions.post({
            path: '/keys',
            data: {
              value: keys
            }
          });
        },

        ///////////////////////////////////////////////////////////
        // Document Handling
        ///////////////////////////////////////////////////////////
        getPageSource: '/source',

        async executeScript(script, args) {
          const value = await this.driver.executeScript(script, args);

          return {
            value
          };
        },

        executeScriptAsync(fn, args) {
          return TransportActions.post({
            path: '/execute_async',
            data: {
              script: fn,
              args: args
            }
          });
        },

        ///////////////////////////////////////////////////////////
        // Cookies
        ///////////////////////////////////////////////////////////

        async setCookieString(cookie) {
          await this.driver.manage().addCookie(cookie);

          return {
            value: null
          };
        },

        async deleteCookie(cookieName) {
          await this.driver.manage().deleteCookie(cookieName);

          return {
            value: null
          };
        },

        async deleteAllCookies() {
          await this.driver.manage().deleteAllCookies();

          return {
            value: null
          };
        },

        async getCookieString() {
          const value = await this.driver.manage().getCookies();

          return {
            value
          };
        },

        ///////////////////////////////////////////////////////////
        // User Actions
        ///////////////////////////////////////////////////////////
        doubleClick() {
          return TransportActions.post('/doubleclick');
        },

        mouseButtonClick(buttonIndex) {
          return TransportActions.post({
            path: '/click',
            data: {
              button: buttonIndex
            }
          });
        },

        mouseButtonUp(buttonIndex) {
          return TransportActions.post({
            path: '/buttonup',
            data: {
              button: buttonIndex
            }
          });
        },

        mouseButtonDown(buttonIndex) {
          return TransportActions.post({
            path: '/buttondown',
            data: {
              button: buttonIndex
            }
          });
        },

        moveTo(id, xoffset, yoffset) {
          const data = {};

          if (typeof id == 'string') {
            data.element = id;
          }

          if (typeof xoffset == 'number') {
            data.xoffset = xoffset;
          }

          if (typeof yoffset == 'number') {
            data.yoffset = yoffset;
          }

          return TransportActions.post({
            path: '/moveto',
            data
          });
        },

        ///////////////////////////////////////////////////////////
        // User Prompts
        ///////////////////////////////////////////////////////////
        async acceptAlert() {
          await this.driver.switchTo().alert().accept();

          return {
            value: null
          };
        },

        async dismissAlert() {
          await this.driver.switchTo().alert().dismiss();

          return {
            value: null
          };
        },

        async getAlertText() {
          const value = await this.driver.switchTo().alert().getText();

          return {
            value
          };
        },

        async setAlertText(keys) {
          const alert = await this.driver.switchTo().alert();
          await alert.sendKeys(keys);
          const value = await alert.accept();

          return {
            value
          };
        },

        ///////////////////////////////////////////////////////////
        // Screen
        ///////////////////////////////////////////////////////////
        getScreenshot(logBase64Data) {
          return Promise.resolve('');

          return {
            path: '/screenshot',
            addtOpts: {
              suppressBase64Data: !logBase64Data
            }
          };
        },

        getScreenOrientation: '/orientation',

        setScreenOrientation(orientation) {
          return TransportActions.post({
            path: '/orientation',
            data: {
              orientation: orientation
            }
          });
        },

        getAvailableContexts: '/contexts',

        getCurrentContext: '/context',

        setCurrentContext(context) {
          return TransportActions.post({
            path: '/context',
            data: {
              name: context
            }
          });
        },

        ///////////////////////////////////////////////////////////////////////////
        // Selenium Webdriver
        ///////////////////////////////////////////////////////////////////////////
        async wait(conditionFn, timeMs) {
          await this.driver.wait(conditionFn(), timeMs);

          return {
            value: null
          };
        }
      }
    };
  }
};
