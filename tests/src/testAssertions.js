module.exports = {
  setUp: function (callback) {
    this.client = require('../nightwatch.js').init({}, callback);

    callback();
  },

  'Testing assertions loaded' : function(test) {
    var assertModule = require('assert');
    var prop;
    for (prop in assertModule) {
      test.ok(prop in this.client.api.assert);
    }
    for (prop in assertModule) {
      test.ok(prop in this.client.api.verify);
    }
    test.ok('elementPresent' in this.client.api.assert);
    test.ok('elementPresent' in this.client.api.verify);

    test.ok('elementNotPresent' in this.client.api.assert);
    test.ok('elementNotPresent' in this.client.api.verify);

    test.ok('containsText' in this.client.api.assert);
    test.ok('containsText' in this.client.api.verify);

    test.ok('attributeEquals' in this.client.api.assert);
    test.ok('attributeEquals' in this.client.api.verify);

    test.ok('cssClassPresent' in this.client.api.assert);
    test.ok('cssClassPresent' in this.client.api.verify);

    test.ok('cssClassNotPresent' in this.client.api.assert);
    test.ok('cssClassNotPresent' in this.client.api.verify);

    test.ok('cssProperty' in this.client.api.assert);
    test.ok('cssProperty' in this.client.api.verify);

    test.ok('valueContains' in this.client.api.assert);
    test.ok('valueContains' in this.client.api.verify);

    test.ok('visible' in this.client.api.assert);
    test.ok('visible' in this.client.api.verify);

    test.ok('hidden' in this.client.api.assert);
    test.ok('hidden' in this.client.api.verify);

    test.ok('title' in this.client.api.assert);
    test.ok('title' in this.client.api.verify);

    test.done();
  },

  tearDown : function(callback) {
    // clean up
    this.client = null;
    callback();
  }
};
