class Debuggability {
  private static _debugMode:boolean = false;
  private static _stepOverAndPause:boolean = false;

  static get stepOverAndPause():boolean {
    return this._stepOverAndPause || false;
  }

  static set stepOverAndPause(value:boolean) {
    this._stepOverAndPause = value;
  }
  
  static reset():void {
    this._stepOverAndPause = false;
  }

  static get debugMode():boolean {
    return this._debugMode;
  }

  static set debugMode(value:boolean) {
    this._debugMode = value;
  }
}

module.exports = Debuggability;
