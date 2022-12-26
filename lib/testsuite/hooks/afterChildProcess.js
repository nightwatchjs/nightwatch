const BaseHook = require('./_basehook.js');

class AfterChildProcess extends BaseHook {
  constructor(context, addtOpts) {
    super(BaseHook.afterChildProcess, context, addtOpts);
  }
}

module.exports = AfterChildProcess;
