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

  static get debugMode() {
    return this._debugMode;
  }

  static set debugMode(value) {
    this._debugMode = value;
  }
}

module.exports = Debuggability;
