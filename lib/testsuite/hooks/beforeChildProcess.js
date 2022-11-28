const BaseHook = require('./_basehook.js');

class BeforeChildProcess extends BaseHook {
  constructor(context, addtOpts) {
    super(BaseHook.beforeChildProcess, context, addtOpts);
  }
}

module.exports = BeforeChildProcess;
