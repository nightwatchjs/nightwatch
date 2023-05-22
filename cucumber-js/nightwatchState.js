class NightwatchState {

  setClient(client){
    this.client = client;
  }

  setBrowser(browser) {
    this.browser = browser;
  }
}

module.exports = new NightwatchState();
