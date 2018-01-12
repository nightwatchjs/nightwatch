const BaseCommandLoader = require('./_base-loader.js');
const Page = require('../page-object/page.js');

class PageObjectLoader extends BaseCommandLoader {

  loadApi(pageObject) {
    const ApiLoader = require('./api.js');
    let apiLoader = new ApiLoader(this.nightwatchInstance);

    apiLoader.loadAssertions(pageObject)
      .loadCustomAssertions(pageObject);

    if (this.nightwatchInstance.startSessionEnabled) {
      apiLoader.loadElementCommands(pageObject)
        .loadExpectAssertions(pageObject);

      pageObject.expect.section = pageObject.expect.element;
    }

    return pageObject;
  }

  pageObjectDefinition() {
    return new Page(this.module, this.loadApi.bind(this), this.nightwatchInstance);
  }

  define() {
    if (this.module) {
      this.module.name = this.commandName;
      this.nightwatchInstance.setApiMethod(this.commandName, 'page', this.pageObjectDefinition.bind(this));
    }
  }
}

module.exports = PageObjectLoader;