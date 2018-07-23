module.exports = {
  '@disabled': true,

  'Show getting Nightwatch features using index' : function (client) {

    client.url('http://nightwatchjs.org');

    var featuresPage = client.page.nightwatchFeatures();

    featuresPage
      .assert.containsText('@featuresHeading', 'Main Features')
      .getFeatureCount(function (result) {

        client.assert.equal(result.status, 0, 'status counting features');
        var totalFeatures = result.value;
        var lastFeatureIndex = totalFeatures - 1;

        featuresPage.getText({selector: '@features', index: lastFeatureIndex}, function (result) {
          client.assert.equal(result.status, 0, 'status finding last feature text');
          client.assert.equal(result.value, 'Continous integration support', 'text of last feature');
        });

      });
      
    client.end();
  }
};
