const {WebElement} = require('selenium-webdriver');
const SeleniumWebdriver = require('./');
const {Logger, isString} = require('../../utils');
const HttpRequest = require('../../http/request');

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

          return {
            value: null
          };
        },

        async setTimeoutsAsyncScript(value) {
          await this.driver.manage().setTimeouts({script: value});

          return {
            value: null
          };
        },

        async setTimeoutsImplicitWait(value) {
          await this.driver.manage().setTimeouts({implicit: value});

          return {
            value: null
          };
        },

        async getTimeouts() {
          const timeout = await this.driver.manage().getTimeouts();

          return {
            value: timeout
          };
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
            value
          };
        },

        ///////////////////////////////////////////////////////////
        // Navigation
        ///////////////////////////////////////////////////////////
        async navigateTo(url) {
          await this.driver.navigate().to(url);

          return null;
        },

        getCurrentUrl() {
          return this.driver.getCurrentUrl();
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

          return {
            value: null
          };
        },

        async getPageTitle() {
          const value = await this.driver.getTitle();

          return {
            value
          };
        },

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
          return this.driver.close();
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

        async openNewWindow(type = 'tab') {
          await this.driver.switchTo().newWindow(type);

          return {
            value: null
          };
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

          return {
            value: elementId,
            webElement
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

          return {
            value: webElement,
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
          const elementValue = await element.getAttribute(attributeName);

          return elementValue;
        },

        async getElementAccessibleName(webElement) {
          const element = this.getWebElement(webElement);
          const elementAccessibleName = await element.getAccessibleName();

          return {
            value: elementAccessibleName
          };
        },

        async getElementAriaRole(webElement) {
          const element = this.getWebElement(webElement);
          const elementAccessibleName = await element.getAriaRole();

          return {
            value: elementAccessibleName
          };
        },

        async takeElementScreenshot(webElement, scroll) {
          const element = this.getWebElement(webElement);
          const screenshotData = await element.takeScreenshot(scroll);

          return {
            value: screenshotData
          };
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

          return {
            value: elementTagName
          };
        },

        async getElementRect(id) {
          const element = this.getWebElement(id);
          const value = await element.getRect();

          return {
            value,
            status: 0
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
          // global._redactParams = true;

          HttpRequest.globalSettings = Object.assign({}, HttpRequest.globalSettings, {redactParams: true});

          return this.methods.session.setElementValue.call(this, ...args);
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
            return {
              error,
              status: -1
            };
          }
        },

        async clickElement(webElement) {
          const element = this.getWebElement(webElement);
          await element.click();

          return null;
        },

        async elementSubmit(webElement) {
          try {
            const element = this.getWebElement(webElement);
            await element.submit();

            return {
              value: null
            };
          } catch (error) {
            return {
              error,
              status: -1
            };
          }
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

          return {
            value
          };
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

        async getCookies() {
          const value = await this.driver.manage().getCookies();

          return {
            value
          };
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

          return {
            value: null
          };
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
          await this.driver.wait(conditionFn(), timeMs);

          return {
            value: null
          };
        }
      }
    };
  }
};
