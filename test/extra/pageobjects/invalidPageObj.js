module.exports = {
  sections: {
    testSection: {
      selector: '.section',
      sections: {
        testSubSection: { selector: '//[@class="el1"]', locateStrategy: 'xpath' }
      }
    }
  }
};