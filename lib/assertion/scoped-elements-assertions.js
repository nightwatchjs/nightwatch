class ScopedElementsAssertions {
  constructor(scopedElements, { negated, nightwatchInstance }) {
    this.negated = negated;
    this.scopedElements = scopedElements;
    this.nightwatchInstance = nightwatchInstance;
  }

  #assert(callback) {
    const assert = this.nightwatchInstance.api.assert;

    callback(
      this.negated ? assert.not : assert,
      this.scopedElements.webElements
    );

    return this.scopedElements;
  }

  get not() {
    return new ScopedElementsAssertions(this.scopedElements, {
      negated: true,
      nightwatchInstance: this.nightwatchInstance
    });
  }
}

exports.ScopedElementsAssertions = ScopedElementsAssertions;
