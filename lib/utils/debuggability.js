class Debuggability {
  static get stepOverAndPause() {
    return this._stepOverAndPause || false;
  }

  static set stepOverAndPause(value) {
    this._stepOverAndPause = value;
  }

  static reset() {
    this._stepOverAndPause = false;
  }
}

module.exports = Debuggability;