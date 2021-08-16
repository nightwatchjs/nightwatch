const Selenium = require('../selenium-webdriver/selenium');
const { Logger } = require('../../utils');
const { httpRequest } = require('../../../lib/http/httpUtils');

class Browserstack extends Selenium {
  static get ApiUrl() {
    return 'api.browserstack.com';
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

  constructor(nightwatchInstance, browserName) {
    super(nightwatchInstance, browserName);

    this.adaptSettings();
    this.verifySettings();

    this.nightwatchInstance.on('nightwatch:session.create', (data) => {
      this.sessionId = data.sessionId;
      this.getBuildId().then(buildId => {
        if (buildId) {
          this.buildId = buildId;
        }
      });
    });

  }

  adaptSettings() {
    this.settings.webdriver.start_process = false;
    this.settings.webdriver.port = Number(this.settings.webdriver.port);

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
      // eslint-disable-next-line no-console
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
      const url = `https://${this.username}:${this.accessKey}@${Browserstack.ApiUrl}/automate/builds.json`
      const builds = await httpRequest(url);
      const currentBuild = builds.find((item) => {
        return item.automation_build.name === this.build;
      });

      return currentBuild && currentBuild.automation_build.hashed_id;
    } catch (err) {
      Logger.error(err);
    }
  }

  async testSuiteFinished(failures) {
    try {
      // eslint-disable-next-line no-console
      console.log('\n  ' + 'See more info, video, & screenshots on Browserstack:\n' +
        '  ' + Logger.colors.light_cyan(`https://automate.browserstack.com/builds/${this.buildId}/sessions/${this.sessionId}`));

      const body = JSON.stringify({ status: failures ? 'failed' : 'passed', reason: ''});
      const params = {
        host: Browserstack.ApiUrl,
        auth: `${this.username}:${this.accessKey}`,
        method: 'PUT',
        port: 443,
        path: `/automate/sessions/${this.sessionId}.json`,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
          }
      }
      await httpRequest(params, body);
      this.sessionId = null;

      return true;
    } catch (err) {
      Logger.error(err);

      return false;
    }
  }
}

module.exports = Browserstack;
