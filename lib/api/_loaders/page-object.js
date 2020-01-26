const BaseCommandLoader = require('./_base-loader.js');
const Page = require('../../page-object');

class PageObjectLoader extends BaseCommandLoader {
  get loadSubDirectories() {
    return true;
  }

  loadApi(pageObject) {
    const ApiLoader = require('../index.js');
    const StaticApis = require('./static.js');

    const apiLoader = new ApiLoader(this.nightwatchInstance);
    const staticApis = new StaticApis(this.nightwatchInstance);

    staticApis.loadStaticAssertions(pageObject);
    staticApis.loadStaticExpect(pageObject);

    if (this.nightwatchInstance.startSessionEnabled) {
      apiLoader.loadCustomCommandsSync(pageObject);
      apiLoader.loadCustomAssertionsSync(pageObject);
      apiLoader.loadApiCommandsSync(pageObject);

      pageObject.expect.section = pageObject.expect.element;
    }

    return pageObject;
  }

  createWrapper() {
    return this;
  }

  pageObjectDefinition() {
    return new Page(this.module, this.loadApi.bind(this), this.nightwatchInstance);
  }

  define() {
    if (this.module) {
      const parent = this.api.page;
      let namespace;
      if (Array.isArray(this.namespace) && this.namespace.length > 0) {
        namespace = BaseCommandLoader.unflattenNamespace(parent, this.namespace.slice());
      }

      this.module.name = this.commandName;
      this.nightwatchInstance.setApiMethod(this.commandName, namespace || 'page', this.pageObjectDefinition.bind(this));
    }
  }
}

module.exports = PageObjectLoader;
