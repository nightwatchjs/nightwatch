enum Settings {
  SELENIUM_HOST = 'host',
  SELENIUM_PORT = 'port',
  CREDENTIALS = 'credentials',
  PROXY = 'proxy',
  USE_SSL = 'use_ssl',
  KEEP_ALIVE = 'keep_alive',
  DEFAULT_PATH = 'default_path',
  TIMEOUT = 'timeout',
  RETRY_ATTEMPTS = 'retry_attempts',
  INTERNAL_SERVER_ERROR_RETRY_INTERVAL = 'internal_server_error_retry_interval'
}  

interface KeepAlive {
  keepAliveMsecs: number;
  enabled: boolean;
}


class HttpOptions {
  #settings: {[key: string]: unknown};

  constructor() {
    this.#settings = {};
  }

  get settings() {
    return this.#settings;
  }

  #updateSetting(key: string, value: unknown) {
    this.#settings[key] = value;
    
    return this;
  }

  setPort(port: number) {
    this.#updateSetting(Settings.SELENIUM_PORT, port);
  }

  setHost(value: string) {
    this.#updateSetting(Settings.SELENIUM_HOST, value);
  }

  useSSL(value: boolean) {
    this.#updateSetting(Settings.USE_SSL, value);
  }

  setKeepAlive(value: KeepAlive | boolean) {
    this.#updateSetting(Settings.KEEP_ALIVE, value);
  }

  setCredentials(credentials: {username: string, key: string}) {
    this.#updateSetting(Settings.CREDENTIALS, credentials);
  }

  setProxy(proxy: string) {
    this.#updateSetting(Settings.PROXY, proxy);
  }

  setDefaultPathPrefix(path: string) {
    this.#updateSetting(Settings.DEFAULT_PATH, path);
  }

  setTimeout(timeout: number) {
    this.#updateSetting(Settings.TIMEOUT, timeout);
  }

  setRetryAttempts(retryAttempts: number) {
    this.#updateSetting(Settings.RETRY_ATTEMPTS, retryAttempts);
  }

  setInternalServerRetryIntervel(retryInterval: number) {
    this.#updateSetting(Settings.INTERNAL_SERVER_ERROR_RETRY_INTERVAL, retryInterval);
  }
}

export = {
  global: new HttpOptions(),
  HttpOptions
};
