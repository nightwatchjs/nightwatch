const BaseHook = require('./_basehook.js');

class AfterParallel extends BaseHook {
  constructor(context, addtOpts) {
    super(BaseHook.afterParallel, context, addtOpts);
  }
}

module.exports = AfterParallel;
