module.exports = class CdpConnection {
  static async getConnection(driver, reset=false) {
    if (!reset && this._connection) {
      return this._connection;
    }

    return this._connection = await driver.createCDPConnection('page');
  }

  static resetConnection() {
    this._connection = undefined;
  }
};