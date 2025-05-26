const stripAnsi = require('strip-ansi');
const {Logger} = require('../../../utils');
const AppiumBaseServer = require('../appiumBase.js');
const defaultsDeep = require('lodash/defaultsDeep');


class Browserstack extends AppiumBaseServer {
  bStackOptions() {
    return this.settings.desiredCapabilities['bstack:options'];
  }

  get buildUrl() {
    return `https://${this.productNamespace}.browserstack.com`;
  }

  get buildsListingApiUrl() {
    // https://www.browserstack.com/docs/automate/api-reference/selenium/build#get-build-list
    return `${this.ApiUrl}/builds.json`;
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

  findBuildHashId(buildsResponse) {
    if (!buildsResponse || buildsResponse.length === 0) {
      return false;
    }

    const currentBuild = buildsResponse.find((item) => item.automation_build?.name === this.build);
    if (currentBuild) {
      return currentBuild.automation_build?.hashed_id;
    }
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
      let offset = 0;

      while (offset <= 100) {
        const builds = await this.sendHttpRequest({
          url: `${this.buildsListingApiUrl}?status=running&limit=20&offset=${offset}`,
          method: 'GET',
          use_ssl: true,
          port: 443,
          auth: {
            user: this.username,
            pass: this.accessKey
          }
        });

        const buildHashId = this.findBuildHashId(builds);
        if (buildHashId) {
          return buildHashId; // Return the matched hashed_id
        }
        if (buildHashId === false) {
          // No builds returned by API, exit the loop
          break;
        }

        offset += 20;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async sendReasonToBrowserstack(isFailure = false, reason = '') {
    const sessionDetails = await this.sendHttpRequest({
      url: `${this.ApiUrl}/sessions/${this.sessionId}.json`,
      method: 'GET',
      use_ssl: true,
      port: 443,
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
      port: 443,
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
          '  ' + Logger.colors.light_cyan(`${this.buildUrl}/builds/${this.buildId}/sessions/${this.sessionId}`));
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
