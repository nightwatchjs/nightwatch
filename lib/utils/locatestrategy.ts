const __RECURSION__: string = 'recursion';

class LocateStrategy {
  static get Strategies(): {[key: string]: string} {
    return {
      ID: 'id',
      CSS_SELECTOR: 'css selector',
      LINK_TEXT: 'link text',
      PARTIAL_LINK_TEXT: 'partial link text',
      TAG_NAME: 'tag name',
      XPATH: 'xpath',
      NAME: 'name',
      CLASS_NAME: 'class name',
      // Appium-specific strategies
      ACCESSIBILITY_ID: 'accessibility id',
      ANDROID_UIAUTOMATOR: '-android uiautomator',
      IOS_PREDICATE_STRING: '-ios predicate string',
      IOS_CLASS_CHAIN: '-ios class chain'
    };
  }

  static isValid(strategy: string): boolean {
    return Object.keys(LocateStrategy.Strategies).some(key => {
      return String(strategy).toLocaleLowerCase() === LocateStrategy.Strategies[key];
    });
  }

  static getList(): string {
    return Object.keys(LocateStrategy.Strategies).map(k => LocateStrategy.Strategies[k]).join(', ');
  }

  static get XPATH(): string {
    return LocateStrategy.Strategies.XPATH;
  }

  static get CSS_SELECTOR(): string {
    return LocateStrategy.Strategies.CSS_SELECTOR;
  }

  static getDefault(): string {
    return LocateStrategy.CSS_SELECTOR;
  }

  static get Recursion(): string {
    return __RECURSION__;
  }
}

export = LocateStrategy;