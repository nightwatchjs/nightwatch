const BaseCommandLoader = require('./_base-loader.js');
const Page = require('../page-object/page.js');

class PageObjectLoader extends BaseCommandLoader {
  get loadSubDirectories() {
    return true;
  }

  loadApi(pageObject) {
    const ApiLoader = require('./api.js');
    let apiLoader = new ApiLoader(this.nightwatchInstance);

    apiLoader
      .loadStaticAssertions(pageObject)
      .loadAssertions(pageObject)
      .loadCustomAssertions(pageObject);

    if (this.nightwatchInstance.startSessionEnabled) {
      apiLoader
        .loadClientCommands(pageObject)
        .loadElementCommands(pageObject)
        .loadCustomCommands(pageObject)
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
      let parent = this.api.page;
      let namespace;
      if (this.namespace) {
        namespace = parent[this.namespace] = parent[this.namespace] || {};
      }

      this.module.name = this.commandName;
      this.nightwatchInstance.setApiMethod(this.commandName, namespace || 'page', this.pageObjectDefinition.bind(this));
    }
  }
}

module.exports = PageObjectLoader;
