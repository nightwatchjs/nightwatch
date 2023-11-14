const Settings = {
  SELENIUM_HOST: 'host',
  SELENIUM_PORT: 'port',
  CREDENTIALS: 'credentials',
  PROXY: 'proxy',
  USE_SSL: 'use_ssl',
  KEEP_ALIVE: 'keep_alive',
  DEFAULT_PATH: 'default_path',
  TIMEOUT: 'timeout',
  RETRY_ATTEMPTS: 'retry_attempts',
  INTERNAL_SERVER_ERROR_RETRY_INTERVAL: 'internal_server_error_retry_interval'
};

class HttpOptions {
  #settings;

  get settings() {
    return this.#settings;
  }

  constructor() {
    this.#settings = {};
  }

  #updateSetting(key, value) {
    this.#settings[key] = value;

    return this;
  }

  setPort(port) {
    this.#updateSetting(Settings.SELENIUM_PORT, port);
  }

  setHost(value) {
    this.#updateSetting(Settings.SELENIUM_HOST, value);
  }

  useSSL(value) {
    this.#updateSetting(Settings.USE_SSL, value);
  }

  setKeepAlive(value) {
    this.#updateSetting(Settings.KEEP_ALIVE, value);
  }

  setCredentials(credentials) {
    this.#updateSetting(Settings.CREDENTIALS, credentials);
  }

  setProxy(proxy) {
    this.#updateSetting(Settings.PROXY, proxy);
  }

  setDefaultPathPrefix(path) {
    this.#updateSetting(Settings.DEFAULT_PATH, path);
  }

  setTimeout(timeout) {
    this.#updateSetting(Settings.TIMEOUT, timeout);
  }

  setRetryAttempts(retryAttempts) {
    this.#updateSetting(Settings.RETRY_ATTEMPTS, retryAttempts);
  }

  setInternalServerRetryIntervel(retryInterval) {
    this.#updateSetting(Settings.INTERNAL_SERVER_ERROR_RETRY_INTERVAL, retryInterval);
  }
}

module.exports = {
  global: new HttpOptions(),
  HttpOptions
};
