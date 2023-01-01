class Cdp {
  async getConnection(driver, reset=false) {
    if (!reset && this._connection) {
      return this._connection;
    }

    return this._connection = await driver.createCDPConnection('page');
  }

  resetConnection() {
    this._connection = undefined;
  }
}

module.exports = new Cdp();
