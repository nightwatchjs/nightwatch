const stripAnsi = require('strip-ansi');
const Automate = require('./automate.js');

class AutomateTurboScale extends Automate {
  get buildUrl() {
    return `https://${this.productNamespace}.browserstack.com/dashboard`;
  }

  get ApiUrl() {
    return 'https://api.browserstack.com/automate-turboscale/v1';
  }

  get productNamespace() {
    return 'grid';
  }

  async getBuildId() {
    try {
      let offset = 0;
      var currentBuild;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const builds = await this.sendHttpRequest({
          url: `${this.ApiUrl}/builds?status=running&limit=20&offset=${offset}`,
          method: 'GET',
          use_ssl: true,
          port: 443,
          auth: {
            user: this.username,
            pass: this.accessKey
          }
        });
        const buildData = builds.builds;
        if (!buildData || buildData.length === 0) {
          break;
        }
        currentBuild  = buildData.find((item) => {
          return item.automation_build.name === this.build;
        });
        if (currentBuild) {
          break;
        }
        offset += 20;
      }

      return currentBuild && currentBuild.hashed_id;
    } catch (err) {
      console.error(err);
    }
  }

  async sendReasonToBrowserstack(isFailure = false, reason = '') {
    const sessionDetails = await this.sendHttpRequest({
      url: `${this.ApiUrl}/sessions/${this.sessionId}`,
      method: 'GET',
      use_ssl: true,
      port: 443,
      auth: {
        user: this.username,
        pass: this.accessKey
      }
    });

    const status = sessionDetails?.status;
    if (['passed', 'failed'].includes(status)) {
      // status has already been set by user
      return;
    }

    reason = stripAnsi(reason);
    await this.sendHttpRequest({
      url: `${this.ApiUrl}/sessions/${this.sessionId}`,
      method: 'PATCH',
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
}

module.exports = AutomateTurboScale;
