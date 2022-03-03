const stripAnsi = require('strip-ansi');
const Selenium = require('./selenium.js');
const {Logger} = require('../../utils');

class Browserstack extends Selenium {
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

  constructor(nightwatchInstance, browserName) {
    super(nightwatchInstance, browserName);

    this.adaptSettings();
    this.verifySettings();
    this.useLocal = false;

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

    if (this.settings.desiredCapabilities['browserstack.local']) {
      this.useLocal = true;
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
      const builds = await this.sendHttpRequest({
        url: `${Browserstack.ApiUrl}/builds.json`,
        method: 'GET',
        use_ssl: true,
        auth: {
          user: this.username,
          pass: this.accessKey
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
      let reason = failures instanceof Error;
      if (reason) {
        reason = stripAnsi(`${failures.name}: ${failures.message}`);
      } else {
        reason = '';
      }

      await this.sendHttpRequest({
        url: `${Browserstack.ApiUrl}/sessions/${this.sessionId}.json`,
        method: 'PUT',
        use_ssl: true,
        data: {
          status: !!failures ? 'failed' : 'passed',
          reason
        },
        auth: {
          user: this.username,
          pass: this.accessKey
        }
      });

      // eslint-disable-next-line no-console
      console.log('\n  ' + 'See more info, video, & screenshots on Browserstack:\n' +
        '  ' + Logger.colors.light_cyan(`https://automate.browserstack.com/builds/${this.buildId}/sessions/${this.sessionId}`));

      this.sessionId = null;

      return true;
    } catch (err) {
      Logger.error(err);

      return false;
    }
  }
}

module.exports = Browserstack;
