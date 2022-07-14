const stripAnsi = require('strip-ansi');
const Selenium = require('./selenium.js');
const {Logger} = require('../../utils');

class Browserstack extends Selenium {
  static get ApiUrl() {
    return 'https://api.browserstack.com/automate';
  }

  get accessKey() {
    return this.bstackOptions.accessKey;
  }

  get username() {
    return this.bstackOptions.userName;
  }

  get build() {
    return this.bstackOptions.buildName;
  }

  get local() {
    return this.bstackOptions.local;
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

    const {desiredCapabilities} = this.settings;
    //checking for legacy-ways for providing config
    this.bstackOptions = {
      userName: desiredCapabilities['browserstack.user'], 
      accessKey: desiredCapabilities['browserstack.key'], 
      buildName: desiredCapabilities.build, 
      local: desiredCapabilities['browserstack.local']
    };

    Object.assign(this.bstackOptions, this.settings.desiredCapabilities['bstack:options']);


    if (!this.accessKey && process.env.BROWSERSTACK_KEY) {
      this.bstackOptions.accessKey = process.env.BROWSERSTACK_KEY;
    }

    if (!this.username && process.env.BROWSERSTACK_USER) {
      this.bstackOptions.userName = process.env.BROWSERSTACK_USER;
    }

    if (!this.build) {
      this.bstackOptions.buildName = 'nightwatch-test-build';
    }

    if (this.local) {
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

  async sendReasonToBrowserstack(isFailure = false, reason = '') {
    reason = stripAnsi(reason);
    await this.sendHttpRequest({
      url: `${Browserstack.ApiUrl}/sessions/${this.sessionId}.json`,
      method: 'PUT',
      use_ssl: true,
      data: {
        status: isFailure ? 'failed' : 'passed',
        reason
      },
      auth: {
        user: this.username,
        pass: this.accessKey
      }
    });

  }

  async testSuiteFinished(failures) {
    
    try {
      const reason = failures instanceof Error ? `${failures.name}: ${failures.message}` : '';
      await this.sendReasonToBrowserstack(!!failures, reason);
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
