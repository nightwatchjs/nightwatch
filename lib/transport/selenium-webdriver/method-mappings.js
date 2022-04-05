const {WebElement, Origin, By} = require('selenium-webdriver');
const {Locator} = require('../../element');
const {isString} = require('../../utils');

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
          return function() {
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
          const locator = Locator.create(element);
          const webElement = await this.driver.findElement(locator);
          const elementId = await webElement.getId();

          const {elementKey} = this.transport;

          return {
            value: {[elementKey]: elementId}
          };
        },

        async locateMultipleElements(element) {
          const locator = Locator.create(element);
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

        getElementAttribute(id, attributeName) {
          return `/element/${id}/attribute/${attributeName}`;
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

        async setElementAttribute(webElement, attrName, value) {
          const element = this.getWebElement(webElement);

          // eslint-disable-next-line
          /* istanbul ignore next */const fn = function(e,a,v){try{if(e&&typeof e.setAttribute=='function'){e.setAttribute(a,v);}return true;}catch(err){return{error:err.message,message:err.name+': '+err.message};}};
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

        async isElementDisplayed(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          const result = await element.isDisplayed();

          return result;
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

        async clearElementValue(webElementOrId) {
          const element = this.getWebElement(webElementOrId);
          await element.clear();

          return null;
        },

        setElementValueRedacted(...args) {
          // FIXME: redact password in verbose HTTP logs, it's only redacted in the command logs
          return this.methods.session.setElementValue.call(this, ...args);
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
            await element.clear();
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
            value = value.join('');
          } else {
            value = String(value);
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
          return await this.getElementByJs(function(element) {
            return element && element.firstElementChild;
          }, webElementOrId);
        },

        async getLastElementChild(webElementOrId) {
          return await this.getElementByJs(function(element) {
            return element && element.lastElementChild;
          }, webElementOrId);
        },

        async getNextSibling(webElementOrId) {
          return await this.getElementByJs(function(element) {
            return element && element.nextElementSibling;
          }, webElementOrId);
        },

        async getPreviousSibling(webElementOrId) {
          return await this.getElementByJs(function(element) {
            return element && element.previousElementSibling;
          }, webElementOrId);
        },

        async getShadowRoot(webElementOrId) {
          return await this.getElementByJs(function(element) {
            return element && element.shadowRoot;
          }, webElementOrId);
        },

        async elementHasDescendants(webElementOrId) {
          const count = await this.runScriptForElement(function(element) {
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

        async executeScriptAsync(fn, args) {
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
          const result = await this.driver.manage().getCookie(name);

          return result;
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
         * @param {number} xOffset
         * @param {number} yOffset
         * @param {object} [options]
         * @param {number} [duration]
         */

        async moveTo(origin, x, y, duration, options = {}) {
          switch (origin) {
            case Origin.POINTER:
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
          source =  this.getWebElement(source);

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
        async wait(conditionFn, timeMs, message, retryInterval) {
          await this.driver.wait(conditionFn(), timeMs, message, retryInterval);

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

        ///////////////////////////////////////////////////////////////////////////
        // BiDi apis
        ///////////////////////////////////////////////////////////////////////////

        async registerAuth(username, password) {
          const pageCdpConnection = await this.driver.createCDPConnection('page');
          await this.driver.register(username, password, pageCdpConnection);

          return {
            value: null
          };
        }
        
      }
    };
  }
};
