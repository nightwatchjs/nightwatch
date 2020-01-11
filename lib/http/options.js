const Settings = {
  SELENIUM_HOST: 'host',
  SELENIUM_PORT: 'port',
  CREDENTIALS: 'credentials',
  PROXY: 'proxy',
  USE_SSL: 'use_ssl',
  KEEP_ALIVE: 'keep_alive',
  DEFAULT_PATH: 'default_path',
  TIMEOUT: 'timeout',
  RETRY_ATTEMPTS: 'retry_attempts'
};

class HttpOptions {
  constructor() {
    this.__settings__ = {};
  }

  get settings () {
    return this.__settings__;
  }

  updateSetting(key, value) {
    this.__settings__[key] = value;

    return this;
  }

  setPort(port) {
    this.updateSetting(Settings.SELENIUM_PORT, port);
  }

  setHost(value) {
    this.updateSetting(Settings.SELENIUM_HOST, value);
  }

  useSSL(value) {
    this.updateSetting(Settings.USE_SSL, value);
  }

  setKeepAlive(value) {
    this.updateSetting(Settings.KEEP_ALIVE, value);
  }

  setCredentials(credentials) {
    this.updateSetting(Settings.CREDENTIALS, credentials);
  }

  setProxy(proxy) {
    this.updateSetting(Settings.PROXY, proxy);
  }

  setDefaultPathPrefix(path) {
    this.updateSetting(Settings.DEFAULT_PATH, path);
  }

  setTimeout(timeout) {
    this.updateSetting(Settings.TIMEOUT, timeout);
  }

  setRetryAttempts(retryAttempts) {
    this.updateSetting(Settings.RETRY_ATTEMPTS, retryAttempts);
  }
}

module.exports = {
  global: new HttpOptions(),
  HttpOptions
};
