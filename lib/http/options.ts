const __settings__ = {
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

interface SettingsMap {
  [key: string]: string | number | boolean | Keep_Alive | Credentials;
}

interface Keep_Alive {
  keepAliveMsecs: number;
  enabled: boolean;
}

interface Credentials {
  username: string;
  key: string;
}

class HttpOptions {
  private __settings__: SettingsMap;

  constructor() {
    this.__settings__ = {};
  }

  get settings(): SettingsMap {
    return this.__settings__;
  }

  updateSetting(key: string, value: string | number | boolean | Keep_Alive | Credentials) {
    this.__settings__[key] = value;
    
    return this;
  }

  setPort(port: number) {
    this.updateSetting(__settings__.SELENIUM_PORT, port);
  }

  setHost(value: string) {
    this.updateSetting(__settings__.SELENIUM_HOST, value);
  }

  useSSL(value: boolean) {
    this.updateSetting(__settings__.USE_SSL, value);
  }

  setKeepAlive(value: Keep_Alive) {
    this.updateSetting(__settings__.KEEP_ALIVE, value);
  }

  setCredentials(credentials: Credentials) {
    this.updateSetting(__settings__.CREDENTIALS, credentials);
  }

  setProxy(proxy: string) {
    this.updateSetting(__settings__.PROXY, proxy);
  }

  setDefaultPathPrefix(path: string) {
    this.updateSetting(__settings__.DEFAULT_PATH, path);
  }

  setTimeout(timeout: number) {
    this.updateSetting(__settings__.TIMEOUT, timeout);
  }

  setRetryAttempts(retryAttempts: number) {
    this.updateSetting(__settings__.RETRY_ATTEMPTS, retryAttempts);
  }

  setInternalServerRetryIntervel(retryInterval: number) {
    this.updateSetting(__settings__.INTERNAL_SERVER_ERROR_RETRY_INTERVAL, retryInterval);
  }
}

export = {
  global: new HttpOptions(),
  HttpOptions
};
