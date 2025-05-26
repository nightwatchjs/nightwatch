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

  get buildsListingApiUrl() {
    // https://www.browserstack.com/docs/automate-turboscale/api-reference/build#get-build-list
    return `${this.ApiUrl}/builds`;
  }

  findBuildHashId(buildsResponse) {
    const builds = buildsResponse?.builds;
    if (!builds || builds.length === 0) {
      return false;
    }

    const currentBuild = builds.find((item) => item.name === this.build);
    if (currentBuild) {
      return currentBuild.hashed_id;
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
