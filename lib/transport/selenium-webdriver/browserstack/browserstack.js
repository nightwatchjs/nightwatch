const stripAnsi = require('strip-ansi');
const {Logger} = require('../../../utils');
const AppiumBaseServer = require('../appiumBase.js');
const defaultsDeep = require('lodash/defaultsDeep');


class Browserstack extends AppiumBaseServer {
  bStackOptions() {
    return this.settings.desiredCapabilities['bstack:options'];
  }

  get accessKey() {
    return this.bStackOptions().accessKey;
  }

  get username() {
    return this.bStackOptions().userName;
  }

  get build() {
    return this.bStackOptions().buildName;
  }

  get local() {
    return this.bStackOptions().local;
  }

  constructor(nightwatchInstance, browserName) {
    super(nightwatchInstance, browserName);

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

    // checking for legacy-ways for providing config
    this.settings.desiredCapabilities['bstack:options'] = defaultsDeep(this.settings.desiredCapabilities['bstack:options'], {
      userName: desiredCapabilities['browserstack.user'],
      accessKey: desiredCapabilities['browserstack.key'],
      buildName: desiredCapabilities.build || desiredCapabilities.buildName,
      local: desiredCapabilities['browserstack.local'],
      sessionName: desiredCapabilities['name']
    });

    if (!this.accessKey && process.env.BROWSERSTACK_KEY) {
      this.settings.desiredCapabilities['bstack:options'].accessKey = process.env.BROWSERSTACK_KEY;
    }

    if (!this.username && process.env.BROWSERSTACK_USER) {
      this.settings.desiredCapabilities['bstack:options'].userName = process.env.BROWSERSTACK_USER;
    }

    if (!this.build) {
      this.settings.desiredCapabilities['bstack:options'].buildName = 'nightwatch-test-build';
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

  createSession({argv, moduleKey}) {
    this.adaptSettings();
    this.verifySettings();

    return super.createSession({argv, moduleKey});
  }

  async getBuildId() {
    try {
      const builds = await this.sendHttpRequest({
        url: `${this.ApiUrl}/builds.json?status=running`,
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
    const sessionDetails = await this.sendHttpRequest({
      url: `${this.ApiUrl}/sessions/${this.sessionId}.json`,
      method: 'GET',
      use_ssl: true,
      auth: {
        user: this.username,
        pass: this.accessKey
      }
    });

    const status = sessionDetails?.automation_session?.status;
    if (['passed', 'failed'].includes(status)) {
      // status has already been set by user
      return;
    }

    reason = stripAnsi(reason);
    await this.sendHttpRequest({
      url: `${this.ApiUrl}/sessions/${this.sessionId}.json`,
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

  async sessionFinished(reason, err) {
    super.sessionFinished(reason);
    await this.testSuiteFinished(err);
  }

  async testSuiteFinished(err) {
    try {
      if (this.sessionId) {
        const reason = err instanceof Error ? `${err.name}: ${err.message}` : '';
        await this.sendReasonToBrowserstack(!!err, reason);
        // eslint-disable-next-line no-console
        console.log('\n  ' + 'See more info, video, & screenshots on Browserstack:\n' +
          '  ' + Logger.colors.light_cyan(`https://${this.productNamespace}.browserstack.com/builds/${this.buildId}/sessions/${this.sessionId}`));
      }

      if (this.uploadedAppUrl) {
        // App was uploaded to BrowserStack and custom_id not being used
        // eslint-disable-next-line no-console
        console.log('\n  ' + Logger.colors.light_cyan(
          `Please set 'appium:app' capability to '${this.uploadedAppUrl}' to avoid uploading the app again in future runs.`
        ) + '\n');
      }

      this.sessionId = null;

      return true;
    } catch (err) {
      Logger.error(err);

      return false;
    }
  }
}

module.exports = Browserstack;
