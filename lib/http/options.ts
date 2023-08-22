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
  private Settings: SettingsMap;

  constructor() {
    this.Settings = {};
  }

  get settings(): SettingsMap {
    return this.Settings;
  }

  updateSetting(key: string, value: string | number | boolean | Keep_Alive | Credentials) {
    this.Settings[key] = value;
    
    return this;
  }

  setPort(port: number) {
    this.updateSetting(Settings.SELENIUM_PORT, port);

    return this;
  }

  setHost(value: string) {
    this.updateSetting(Settings.SELENIUM_HOST, value);

    return this;
  }

  useSSL(value: boolean) {
    this.updateSetting(Settings.USE_SSL, value);

    return this;
  }

  setKeepAlive(value: Keep_Alive) {
    this.updateSetting(Settings.KEEP_ALIVE, value);

    return this;
  }

  setCredentials(credentials: Credentials) {
    this.updateSetting(Settings.CREDENTIALS, credentials);

    return this;
  }

  setProxy(proxy: string) {
    this.updateSetting(Settings.PROXY, proxy);

    return this;
  }

  setDefaultPathPrefix(path: string) {
    this.updateSetting(Settings.DEFAULT_PATH, path);

    return this;
  }

  setTimeout(timeout: number) {
    this.updateSetting(Settings.TIMEOUT, timeout);

    return this;
  }

  setRetryAttempts(retryAttempts: number) {
    this.updateSetting(Settings.RETRY_ATTEMPTS, retryAttempts);

    return this;
  }

  setInternalServerRetryIntervel(retryInterval: number) {
    this.updateSetting(Settings.INTERNAL_SERVER_ERROR_RETRY_INTERVAL, retryInterval);

    return this;
  }
}

export = {
  global: new HttpOptions(),
  HttpOptions
};
