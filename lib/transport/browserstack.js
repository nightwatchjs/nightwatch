const request = require('request-promise');
const Selenium3 = require('./selenium3.js');
const {Logger} = require('../utils');

class Browserstack extends Selenium3 {
  static get ApiUrl() {
    return 'https://api.browserstack.com/automate';
  }

  get accessKey() {
    return this.settings.desiredCapabilities['browserstack.key'];
  }

  get username() {
    return this.settings.desiredCapabilities['browserstack.user'];
  }

  get build() {
    return this.settings.desiredCapabilities.build;
  }

  constructor(nightwatchInstance) {
    super(nightwatchInstance);

    this.adaptSettings();
    this.verifySettings();

    this.nightwatchInstance.on('nightwatch:session.create', (data) => {
      this.sessionId = data.sessionId;
      this.getBuildId().then(buildId => {
        if (buildId) {
          this.buildId = buildId;
        }
      })
    });

  }

  adaptSettings() {
    this.settings.webdriver.start_process = false;
    this.settings.webdriver.port = Number(this.settings.webdriver.port);
    if (this.settings.webdriver.port === 443) {
      this.settings.webdriver.ssl = true;
    }

    if (!this.accessKey && process.env.BROWSERSTACK_KEY) {
      this.settings.desiredCapabilities['browserstack.key'] = process.env.BROWSERSTACK_KEY;
    }

    if (!this.username && process.env.BROWSERSTACK_USER) {
      this.settings.desiredCapabilities['browserstack.user'] = process.env.BROWSERSTACK_USER;
    }

    if (!this.build) {
      this.settings.desiredCapabilities.build = 'nightwatch-test-build';
    }
  }

  verifySettings() {
    if (this.settings.webdriver.port !== 443) {
      console.warn(Logger.colors.brown('Using insecure HTTP connection on port 80. Consider using SSL by ' +
        'setting port to 443 in your Nightwatch configuration.'));
    }

    if (!this.accessKey) {
      throw new Error('BrowserStack access key is not set. Verify that "browserstack.key" capability is set correctly or ' +
        'set BROWSERSTACK_KEY environment variable (.env files are supported).');
    }

    if (!this.username) {
      throw new Error('BrowserStack username is not set. Verify that "browserstack.user" capability is set correctly or ' +
        'set BROWSERSTACK_USER environment variable (.env files are supported).');
    }
  }

  async getBuildId() {
    try {
      const builds = await request(`${Browserstack.ApiUrl}/builds.json`, {
        json: true,
        auth: {
          user: this.username,
          pass: this.accessKey,
          sendImmediately: false
        }
      });

      const currentBuild = builds.find((item) => {
        return item.automation_build.name === this.build;
      });

      return currentBuild && currentBuild.automation_build.hashed_id;
    } catch (err) {
      console.error(err);
    }
  }

  async testSuiteFinished(failures) {
    try {
      console.log('\n  ' + 'See more info, video, & screenshots on Browserstack:\n' +
        '  ' + Logger.colors.light_cyan(`https://automate.browserstack.com/builds/${this.buildId}/sessions/${this.sessionId}`));

      await request(`${Browserstack.ApiUrl}/sessions/${this.sessionId}.json`, {
        json: true,
        method: 'PUT',
        body: {
          status: failures ? 'failed' : 'passed',
          reason: ''
        },
        auth: {
          user: this.username,
          pass: this.accessKey,
          sendImmediately: false
        }
      });

      this.sessionId = null;

      return true;
    } catch (err) {
      Logger.error(err);

      return false;
    }
  }
}

module.exports = Browserstack;
