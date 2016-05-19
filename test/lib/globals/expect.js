var Nocks = require('../nocks.js');
var Globals = require('../globals.js');
var Nightwatch = require('../nightwatch.js');

module.exports = {
  beforeEach: function (done) {
    Globals.interceptStartFn();
    Nocks.cleanAll().createSession();
    Nightwatch.init({
    }, function () {
      done();
    });
    this.client = Nightwatch.client();
  },

  afterEach : function() {
    Nocks.deleteSession();
    Globals.restoreStartFn();
  }
};