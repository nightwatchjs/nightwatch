const BaseCommandLoader = require('./_base-loader.js');
const Page = require('../page-object/page.js');

class PageObjectLoader extends BaseCommandLoader {
  static unflatten(target, namespace, value) {
    const key = namespace.shift();
    if (key) {
      target[key] = target[key] || {};
      value = target[key];

      return PageObjectLoader.unflatten(target[key], namespace, value);
    }

    return value;
  }

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
      const parent = this.api.page;
      let namespace;
      if (Array.isArray(this.namespace) && this.namespace.length > 0) {
        namespace = PageObjectLoader.unflatten(parent, this.namespace.slice());
      }

      this.module.name = this.commandName;
      this.nightwatchInstance.setApiMethod(this.commandName, namespace || 'page', this.pageObjectDefinition.bind(this));
    }
  }
}

module.exports = PageObjectLoader;
