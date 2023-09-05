class Cdp {
  async getConnection(driver, reset = false) {
    if (!reset && this._connection) {
      return this._connection;
    }

    return this._connection = await driver.createCDPConnection('page');
  }

  resetConnection() {
    this._connection = undefined;
    this._networkMocks = undefined;
  }

  get networkMocks() {
    if (this._networkMocks) {
      return this._networkMocks;
    }

    return this._networkMocks = {};
  }

  addNetworkMock(url, response) {
    this.networkMocks[url] = response;
  }
}

module.exports = new Cdp();
