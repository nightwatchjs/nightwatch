class ElementsAssertions {
  constructor(scopedElements, {negated, nightwatchInstance}) {
    this.negated = negated;
    this.scopedElements = scopedElements;
    this.nightwatchInstance = nightwatchInstance;
  }

  get not() {
    return new ElementsAssertions(this.scopedElements, {
      negated: true,
      nightwatchInstance: this.nightwatchInstance
    });
  }
}

module.exports.ScopedElementsAssertions = ElementsAssertions;
