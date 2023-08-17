const __RECURSION__ = 'recursion'

enum Strategies {
  ID = 'id',
  CSS_SELECTOR = 'css selector',
  LINK_TEXT = 'link text',
  PARTIAL_LINK_TEXT = 'partial link text',
  TAG_NAME = 'tag name',
  XPATH = 'xpath',
  NAME = 'name',
  CLASS_NAME = 'class name',
  // Appium-specific strategies
  ACCESSIBILITY_ID = 'accessibility id',
  ANDROID_UIAUTOMATOR = '-android uiautomator',
  IOS_PREDICATE_STRING = '-ios predicate string',
  IOS_CLASS_CHAIN = '-ios class chain'
}

type StrategiesType = keyof typeof Strategies;

class LocateStrategy {
  static get Strategies() {
    return Strategies;
  }

  static isValid(strategy: string): boolean {
    return Object.keys(LocateStrategy.Strategies).some(key => {
      return String(strategy).toLocaleLowerCase() === LocateStrategy.Strategies[key as StrategiesType];
    });
  }

  static getList(): string {
    return Object.keys(LocateStrategy.Strategies).map(k => LocateStrategy.Strategies[k as StrategiesType]).join(', ');
  }

  static get XPATH(): Strategies.XPATH {
    return LocateStrategy.Strategies.XPATH;
  }

  static get CSS_SELECTOR(): Strategies.CSS_SELECTOR {
    return LocateStrategy.Strategies.CSS_SELECTOR;
  }

  static getDefault(): Strategies.CSS_SELECTOR {
    return LocateStrategy.CSS_SELECTOR;
  }

  static get Recursion(): typeof __RECURSION__ {
    return __RECURSION__;
  }
}

export  = LocateStrategy;