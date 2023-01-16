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

  createSessionOptions() {
    this.extractAppiumOptions();

    return this.desiredCapabilities;
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
    console.log(`Uploading app to BrowserStack from '${appUploadPath || appUploadUrl}'...`);

    try {
      const response = await this.sendHttpRequest({
        url: 'https://api-cloud.browserstack.com/app-automate/upload',
        method: 'POST',
        use_ssl: true,
        auth: {
          user: this.username,
          pass: this.accessKey
        },
        multiPartFormData
      });

      if (response.error) {
        Logger.error(response.error);

        return;
      }

      // eslint-disable-next-line no-console
      console.log(Logger.colors.green(Utils.symbols.ok), 'App uploaded successfully:', response, '\n');
  
      if (response.app_url && !response.custom_id) {
        // custom_id not being used
        options['appium:app'] = response.app_url;

        // to display url when test suite is finished
        this.uploadedAppUrl = response.app_url;
      }
    } catch (err) {
      Logger.error(err);
    }
  }

  async createDriver({options}) {
    if (options && (options.appUploadUrl || options.appUploadPath)) {
      await this.uploadAppToBrowserStack(options);
    }

    return this.createAppiumDriver({options});
  }
}

module.exports = AppAutomate;
