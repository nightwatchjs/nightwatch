var featuresCommands = {
  getFeatureCount: function(callback) {
    this.api.elements(null, this.elements.features, function (result) {
      if (result.status === 0) {
        var countResult = {
          status: 0,
          value: result.value.length
        }
        callback.call(this, countResult);
      } else {
        callback.call(this, result);
      }
    }.bind(this));
    return this;
  }
};

module.exports = {
  commands : [featuresCommands],
  elements : {
    featuresHeading : {
      selector : '#index-container h2',
      index: 1
    },
    features : '#index-container .features h3'
  }
};
