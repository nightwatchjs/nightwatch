const BaseCommandLoader = require('./_base-loader.js');
const Page = require('../page-object/page.js');

class PageObjectLoader extends BaseCommandLoader {
  define(loaderFn) {
    if (this.module) {
      this.module.name = this.commandName;
      this.pageObjectDefinition = new Page(this.module, loaderFn, this.nightwatchInstance);
      this.nightwatchInstance.setApiMethod(this.commandName, 'page', this.pageObjectDefinition);
    }
  }
}

module.exports = PageObjectLoader;