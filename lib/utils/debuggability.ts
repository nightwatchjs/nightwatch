class Debuggability {
  static #debugMode: boolean;
  static #stepOverAndPause: boolean;

  static get stepOverAndPause(): boolean {
    return this.#stepOverAndPause || false;
  }

  static set stepOverAndPause(value: boolean) {
    this.#stepOverAndPause = value;
  }
  
  static reset(): void {
    this.#stepOverAndPause = false;
  }

  static get debugMode(): boolean {
    return this.#debugMode;
  }

  static set debugMode(value: boolean) {
    this.#debugMode = value;
  }
}

export = Debuggability;
