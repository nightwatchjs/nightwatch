module.exports = class Session {
  static get WEB_ELEMENT_ID () {
    return 'element-6066-11e4-a52e-4f735466cecf';
  }

  static serializeCapabilities(caps) {
    const ret = {};
    for (const key of caps.keys()) {
      const cap = caps.get(key);
      if (cap !== undefined && cap !== null) {
        ret[key] = cap;
      }
    }

    return ret;
  }

  constructor(driver) {
    this.driver = driver;
  }

  async exported() {
    const session = await this.driver.getSession();
    const sessionId = await session.getId();
    const sessionCapabilities = await session.getCapabilities();
    const platform = sessionCapabilities.getPlatform() || sessionCapabilities.get('platform') || '';
    const platformVersion = sessionCapabilities.get('platformVersion') || '';
    const browserName = sessionCapabilities.getBrowserName();
    const browserVersion = sessionCapabilities.getBrowserVersion() || sessionCapabilities.get('version') || '';
    const appId = sessionCapabilities.get('appPackage') || sessionCapabilities.get('bundleId') || '';

    const executor = await this.driver.getExecutor();
    const elementKey = executor.w3c ? Session.WEB_ELEMENT_ID : 'ELEMENT';

    return {
      sessionId,
      elementKey,
      sessionInfo: {
        platform,
        platformVersion,
        browserName,
        browserVersion,
        appId
      },
      capabilities: Session.serializeCapabilities(sessionCapabilities)
    };
  }
};
