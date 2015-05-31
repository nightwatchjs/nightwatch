var util = require('util');

var menuXpath = '//div[contains(@class, "hdtb-mitem")][contains(., %s)]';

var menuCommands = {
  productIsSelected: function(product, callback) {
    var self = this;
    return this.getAttribute(product, 'class', function(result) {
      var isSelected = result.value.indexOf('hdtb-msel') > -1;
      callback.call(self, isSelected);
     });
  }
};

module.exports = {
  elements: {
    results: { selector: '#ires' }
  },
  sections: {
    menu: {
      selector: '#hdtb-msb',
      commands: [menuCommands],
      elements: {
        web: { selector: util.format(menuXpath, 'Web'), locateStrategy: 'xpath' },
        video: { selector: util.format(menuXpath, 'Video'), locateStrategy: 'xpath' },
        images: { selector: util.format(menuXpath, 'Images'), locateStrategy: 'xpath' },
        shopping: { selector: util.format(menuXpath, 'Shopping'), locateStrategy: 'xpath' }
      }
    }
  }
};