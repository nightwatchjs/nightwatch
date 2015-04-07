var resultComponents = {
  // This allows us to easily share element components across multiple sections or pages
  results : { selector: '//*[@class="findList"]', locateStrategy: 'xpath' },
  photo: { selector: '//*[@class="primary_photo"]', locateStrategy: 'xpath' }
};

module.exports = {
  sections: {
    titles: { selector: '//*[@class="findSection"][contains(., "Titles")]',
              locateStrategy: 'xpath',
              elements: resultComponents
            },
    keywords : { selector: '//*[@class="findSection"][contains(., "Keywords")]',
                 locateStrategy: 'xpath',
                 elements: resultComponents
               }
  }
};