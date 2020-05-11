const {Screenshots, Logger} = require('../utils');
let __nightwatchInstance = null;

class ScreenshotsService {
  static saveScreenshot(fileName, callback) {
    if(__nightwatchInstance) {
      __nightwatchInstance.transportActions.getScreenshot(
        __nightwatchInstance.settings.log_screenshot_data,
        (result) => {
          Screenshots.writeScreenshotToFile(fileName, result.value, (err) => {
            if (err) {
              Logger.error(`Couldn't save screenshot to "${fileName}":`);
              Logger.error(err);
            }
          });
          callback(result);
        }
      );  
    }
  }
}


module.exports.ScreenshotsService = ScreenshotsService;

/**
   * @method set current nightwatch client instance to provide the service
   * @param {NightwatchClient} instance current nightwatch client instanse
   */
module.exports.setNightwatchInstance =   function setNightwatchInstance(instance) {
  const previousInstance = __nightwatchInstance;
  __nightwatchInstance = instance;

  return function restoreNightwatchInstance() {
    __nightwatchInstance = previousInstance;
  };
};