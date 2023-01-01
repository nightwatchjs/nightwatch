const lodashMerge = require('lodash.merge');
const BaseLoader = require('./_base-loader.js');
const Page = require('../../page-object');

let __page_object_cache = null;

class PageObjectLoader extends BaseLoader {
  get loadSubDirectories() {
    return true;
  }

  get pageObjectCache() {
    return __page_object_cache;
  }

  static loadApiCommands(nightwatchInstance) {
    __page_object_cache = {};

    const ApiLoader = require('../index.js');
    const StaticApis = require('./static.js');

    const apiLoader = new ApiLoader(nightwatchInstance);
    const staticApis = new StaticApis(nightwatchInstance);

    staticApis.loadStaticAssertions(__page_object_cache);
    staticApis.loadStaticExpect(__page_object_cache);

    if (nightwatchInstance.startSessionEnabled) {
      return apiLoader.loadCustomCommands(__page_object_cache)
        .then(() => apiLoader.loadCustomAssertions(__page_object_cache))
        .then(() => apiLoader.loadApiCommandsSync(__page_object_cache))
        .then(() => apiLoader.loadPlugins(__page_object_cache))
        .then(() => {
          // TODO: possibly load .ensure assertions as well

          __page_object_cache.expect.section = __page_object_cache.expect.element;
        });
    }

    return Promise.resolve();
  }

  loadApi(pageObject) {
    const result = lodashMerge(pageObject, this.pageObjectCache);

    return result;
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
        namespace = BaseLoader.unflattenNamespace(parent, this.namespace.slice());
      }

      try {
        this.module.name = this.commandName;
        // eslint-disable-next-line
      } catch (err) {}

      this.nightwatchInstance.setApiMethod(this.commandName, namespace || 'page', this.pageObjectDefinition.bind(this));
    }
  }
}

module.exports = PageObjectLoader;
