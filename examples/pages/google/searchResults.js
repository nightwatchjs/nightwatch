const util = require('util');
const menuXpath = '//div[contains(@class, "hdtb-mitem")][contains(., "%s")]';

const menuCommands = {
  productIsSelected: function (product, callback) {
    var self = this;

    return this.getAttribute(product, 'class', function (result) {
      const isSelected = result.value.indexOf('hdtb-msel') > -1;
      callback.call(self, isSelected);
    });
  }
};

module.exports = {
  elements: {
    results: {selector: '#rso'}
  },
  sections: {
    menu: {
      selector: '#hdtb-msb',
      commands: [menuCommands],
      elements: {
        all: {
          selector: util.format(menuXpath, 'All'),
          locateStrategy: 'xpath',
          index: 0
        },
        video: {
          selector: util.format(menuXpath, 'Videos'),
          locateStrategy: 'xpath',
          index: 0
        },
        images: {
          selector: util.format(menuXpath, 'Images'),
          locateStrategy: 'xpath',
          index: 0
        },
        news: {
          selector: util.format(menuXpath, 'News'),
          locateStrategy: 'xpath',
          index: 0
        }
      }
    }
  }
};
