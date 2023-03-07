module.exports = class CustomPause {
  static get namespacedAliases() {
    return ['sampleNamespace.customPause', 'fantasticNamespace.subNamespace.fantasticPause'];
  }

  command(timeout) {
    if (typeof timeout !== 'number') {
      throw new Error('First argument should be a number.');
    }

    this.pause(200);
  }
};
