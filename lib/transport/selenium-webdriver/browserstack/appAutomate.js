const path = require('path');
const Utils = require('../../../utils');
const BrowserStack = require('./browserstack.js');

const {Logger} = Utils;

class AppAutomate extends BrowserStack {
  get ApiUrl() {
    return `https://api.browserstack.com/${this.productNamespace}`;
  }

  get productNamespace() {
    return 'app-automate';
  }

  async createSessionOptions() {
    this.extractAppiumOptions();

    const options = this.desiredCapabilities;
    if (options && (options.appUploadUrl || options.appUploadPath)) {
      await this.uploadAppToBrowserStack(options);
    }

    return options;
  }

  async uploadAppToBrowserStack(options) {
    const {appUploadPath, appUploadUrl} = options;

    const multiPartFormData = {};
    if (appUploadPath) {
      multiPartFormData['file'] = {
        filePath: path.resolve(appUploadPath)
      };
    } else if (appUploadUrl) {
      multiPartFormData['url'] = {
        data: appUploadUrl
      };
    }

    if (options['appium:app'] && !options['appium:app'].startsWith('bs://')) {
      multiPartFormData['custom_id'] = {
        data: options['appium:app']
      };
    }

    // eslint-disable-next-line no-console
    console.log(Logger.colors.stack_trace(`Uploading app to BrowserStack from '${appUploadPath || appUploadUrl}'...`));

    try {
      const response = await this.sendHttpRequest({
        url: 'https://api-cloud.browserstack.com/app-automate/upload',
        method: 'POST',
        use_ssl: true,
        port: 443,
        auth: {
          user: this.username,
          pass: this.accessKey
        },
        multiPartFormData
      });

      if (response.error) {
        const errMessage = 'App upload to BrowserStack failed. Original error: ' + response.error;

        throw new Error(errMessage);
      }

      if (!response.app_url) {
        const errMessage = 'App upload was unsuccessful. Got response: ' + response;

        throw new Error(errMessage);
      }

      // eslint-disable-next-line no-console
      console.log(Logger.colors.green(Utils.symbols.ok), Logger.colors.stack_trace('App upload successful!'), '\n');

      if (!response.custom_id) {
        // custom_id not being used
        options['appium:app'] = response.app_url;

        // to display url when test suite is finished
        this.uploadedAppUrl = response.app_url;
      }
    } catch (err) {
      err.help = [];

      if (appUploadPath) {
        err.help.push('Check if you have entered correct file path in \'appUploadPath\' desired capability.');
      } else if (appUploadUrl) {
        err.help.push('Check if you have entered correct publicly available file URL in \'appUploadUrl\' desired capability.');
      }

      if (err.message.includes('BROWSERSTACK_INVALID_CUSTOM_ID')) {
        err.help.push('Check if \'appium:app\' or \'appium:options\' > app desired capability is correctly set to BrowserStack app url or required custom ID.');
      }

      err.help.push(
        'See BrowserStack app-upload docs for more details: https://www.browserstack.com/docs/app-automate/api-reference/appium/apps#upload-an-app',
        'More details on setting custom ID for app: https://www.browserstack.com/docs/app-automate/appium/upload-app-define-custom-id'
      );

      Logger.error(err);

      throw err;
    }
  }

  createDriver({options}) {
    return this.createAppiumDriver({options});
  }
}

module.exports = AppAutomate;
