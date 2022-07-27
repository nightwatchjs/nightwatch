
/** Parts of the code are taken from angular-cli code base which is governed by the following license:
 * https://angular.io/license
 */

const os = require('os');
const HttpRequest = require('../http/request.js');
const uuid = require('uuid');
const fs = require('fs');

const path = require('path');
const {execSync} = require('child_process');
const {Logger, VERSION, fileExistsSync} = require('../utils');

const GA_SERVER_URL = 'https://www.google-analytics.com';
const GA_SERVER_PORT = '443';
const GA_API_KEY = '9xiYrxw1TlC-MlPayeCw5A';
const GA_TRACKING_ID = 'G-DEKPKZSLXS';

const defaultSettings = {
  enabled: false,
  log_path: './logs/analytics',
  client_id: uuid.v4()
};

/**
 * See: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
 */
class AnalyticsCollector {  
  constructor() {
    this.queueLength = 0;
    this.parameters = {};
    this.logger = Logger;
    this.initialized = false;

    // This identifies unique users and helps us separate out sessions.
    this.parameters['client_id'] = uuid.v4();

    // Prevents google from indexing the events for ad targeting.
    this.parameters['non_personalized_ads'] = true;

    // User properties
    this.parameters['user_properties'] = {
      ua: buildUserAgentString(),
      lang: getLanguage(),
      nw_version: VERSION.full,
      node_version: `node ${process.version}`
    };
  }

  updateSettings(settings) {
    this.settings = settings;

    if (!this.settings.usage_analytics) {
      this.settings.usage_analytics = defaultSettings;
    }

    // update client_id
    this.parameters['client_id'] = this.settings.usage_analytics.client_id;

    // update queueLength
    try {
      const stat = fs.statSync(this.__getLogFileLocation());
      this.queueLength = stat.size; // the actual value doesn't matter
    } catch (e) {
      // ignore
    }

    this.initialized = true;
  }

  updateLogger(logger) {
    this.logger = logger;
  }

  event(name, parameters = {}) {
    if (!this.initialized) {
      throw Error('AnalyticsCollector is not initialized');
    }

    parameters.callLocation = getCallLocation();
    this.__addToQueue(name, parameters);
  }
 
  exception(modulePath, errorMessage, stackTrace) {
    if (!this.initialized) {
      throw Error('AnalyticsCollector is not initialized');
    }
    
    this.__addToQueue('nw_exception', {
      modulePath,
      errorMessage, 
      stackTrace
    });
  }

  async __flush() {
    if (!this.settings.usage_analytics.enabled) {
      return;
    }

    const pending = this.queueLength;
  
    if (!pending) {
      return;
    }

    try {
      const logfile = this.__getLogFileLocation();

      // The below is needed so that if flush is called multiple times,
      // we don't report the same event multiple times.
      const pendingTrackingEvents = JSON.parse(fs.readFileSync(logfile, 'utf8'));
      fs.truncateSync(logfile);
      this.queueLength = 0;

      // time is expected in micro seconds.
      const timestamp_micros = new Date().getTime() * 1000;

      const payload = {
        ...this.parameters,
        timestamp_micros,
        events: pendingTrackingEvents
      };

      await this.__send(payload);
    } catch (error) {
      // Failure to report analytics shouldn't crash the system.
      this.logger.info('Analytics flush error:', error.message);
    }
  }
 
  __addToQueue(eventType, parameters) {
    if (!this.settings.usage_analytics.enabled) {
      return;
    }

    this.__logAnalyticsEvents({name: eventType, params: parameters});

    // periodically flush
    if (this.queueLength > 0) {
      this.__flush();
    }
  }

  async __send(data) {
    if (!this.settings.usage_analytics.enabled) {
      return;
    }

    this.logger.info('Analytics send event:', data);

    const apiKey = this.settings.usage_analytics.apiKey || GA_API_KEY;
    const trackingId = this.settings.usage_analytics.trackingId || GA_TRACKING_ID;

    const path = `/mp/collect?api_secret=${apiKey}&measurement_id=${trackingId}`;

    const serverUrl = new URL(this.settings.usage_analytics.serverUrl || GA_SERVER_URL) ;
    const serverPort = serverUrl.port || this.settings.usage_analytics.serverPort || GA_SERVER_PORT;

    const request = new HttpRequest({
      host: serverUrl.hostname,
      port: serverPort,
      method: 'POST',
      use_ssl: true,
      path
    });

    request.setData(JSON.stringify(data));

    return new Promise((resolve, reject) => {
      request
        .on('success', (result, response) => {
          if (response.statusCode !== 204) {
            reject(
              new Error(`Analytics reporting failed with status code: ${response.statusCode}.`)
            );
          } else {
            resolve(result);
          }
        })
        .on('error', (result) => {
          new Error(`Failed to send usage metric: ${result.code}.`);
          reject(result);
        })
        .send();
    });
  }
 
  async __logAnalyticsEvents(data) {
    const logfile = this.__getLogFileLocation();

    const hasAnalyticsLog = fileExistsSync(logfile);
    
    if (!hasAnalyticsLog) {
      fs.mkdirSync(path.dirname(logfile), {recursive: true});
    } 

    const writeFn = hasAnalyticsLog ? fs.appendFile : fs.writeFile;

    return new Promise((resolve, reject) => {
      const logger = this.logger;
      writeFn(logfile, JSON.stringify(data), function (err) {
        if (err) {
          logger.warn('Failed to log usage data:', err.message);
        } 
        resolve();
      });
    });
  }

  __getLogFileLocation() {
    const log_path = this.settings.usage_analytics.log_path || './log/analytics';

    return path.resolve(log_path, 'analytics.log');
  }
}

/**
 * Get a language code.
 */
function getLanguage() {
  // Note: Windows does not expose the configured language by default.
  return (
    process.env.LANG || // Default Unix env variable.
    process.env.LC_CTYPE || // For C libraries. Sometimes the above isn't set.
    process.env.LANGSPEC || // For Windows, sometimes this will be set (not always).
    getWindowsLanguageCode() ||
    '??'
  );
}

function getCallLocation() {
  const stackTrace = {};
  Error.captureStackTrace(stackTrace);

  return stackTrace.stack.split('\n')[3];
}
 
/**
 * Attempt to get the Windows Language Code string.
 */
function getWindowsLanguageCode() {
  if (!os.platform().startsWith('win')) {
    return undefined;
  }

  try {
    // This is true on Windows XP, 7, 8 and 10 AFAIK. Would return empty string or fail if it
    // doesn't work.
    return execSync('wmic.exe os get locale').toString().trim();
  } catch (err) {;}

  return undefined;
}

/**
 * Build a fake User Agent string. This gets sent to Analytics so it shows the proper OS version.
 */
function buildUserAgentString() {
  const cpus = os.cpus();
  const cpuModel = cpus.length > 1 ? cpus[0].model : 'NA';

  return `${os.platform()}/${os.release()}/${cpuModel}`;
}

// export singleton instance
module.exports = new AnalyticsCollector();;