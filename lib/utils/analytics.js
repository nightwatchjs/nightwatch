
/** Parts of the code are taken from angular-cli code base which is governed by the following license:
 * https://angular.io/license
 */

const os = require('os');
const HttpRequest = require('../http/request.js');
const uuid = require('uuid');
const fs = require('fs').promises;

const path = require('path');
const {execSync} = require('child_process');
const {Logger, VERSION, fileExists} = require('./');

const GA_SERVER_URL = 'https://www.google-analytics.com';
const GA_SERVER_PORT = '443';
const GA_API_KEY = 'XuPojOTwQ6yTO758EV4hBg';
const GA_TRACKING_ID = 'G-DEKPKZSLXS';

const defaultSettings = {
  enabled: false,
  log_path: './logs/analytics',
  client_id: uuid.v4()
};

const RESERVED_EVENT_NAMES = ['ad_activeview', 'ad_click', 'ad_exposure', 'ad_impression', 'ad_query', 'adunit_exposure',
  'app_clear_data', 'app_install', 'app_update', 'app_remove', 'error', 'first_open', 'first_visit', 'in_app_purchase',
  'notification_dismiss', 'notification_foreground', 'notification_open', 'notification_receive', 'os_update',
  'screen_view', 'session_start', 'user_engagement'];

const ALLOWED_ERRORS = ['Error', 'SyntaxError', 'TypeError', 'ReferenceError'];

const RESERVED_EVENT_PARAMETERS = ['firebase_conversion'];

const MAX_PARAMETERS_LENGTH = 40;

const SYSTEM_LANGUAGE = getLanguage();

/**
 * See: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
 */
class AnalyticsCollector {  
  constructor() {
    this.queueLength = 0;
    this.parameters = {};
    this.logger = Logger;

    // This identifies unique users and helps us separate out sessions.
    this.parameters['client_id'] = uuid.v4();

    // Prevents google from indexing the events for ad targeting.
    this.parameters['non_personalized_ads'] = true;
  }

  initialize() {
    if (this.initialized) {return this.initialized}

    this.initialized = new Promise((resolve) => {
      // update queueLength
      fs.stat(this.__getLogFileLocation())
        .then((length) => {
          this.queueLength = length.size / 400; // the actual value doesn't matter
          resolve();
        })
        .catch((err)=>{
          // ignore error
          resolve();
        });
    });

    return this.initialized;
  }

  updateSettings(settings) {
    this.settings = settings;

    if (!this.settings.usage_analytics) {
      this.settings.usage_analytics = defaultSettings;
    }

    // update client_id
    this.parameters['client_id'] = this.settings.usage_analytics.client_id;
  }

  updateLogger(logger) {
    this.logger = logger;
  }

  async event(name, parameters = {}) {
    if (!this.settings.usage_analytics.enabled) {
      return;
    }

    await this.initialize();

    // Not all shape of events are supported.
    this.__validateEvent(name, parameters);

    // Add event timestamp.
    parameters['event_time'] = new Date().getTime() * 1000;

    // Add environment information.
    parameters['env_os'] = buildUserAgentString();
    parameters['env_lang'] = SYSTEM_LANGUAGE;
    parameters['env_nw_version'] = VERSION.full;
    parameters['env_node_version'] = `node ${process.version}`;

    // Add call location.
    parameters.callLocation = getCallLocation();

    return await this.__addToQueue(name, parameters);
  }
 
  async exception(error) {
    await this.initialize();

    if (!error) {
      return;
    }

    if (!ALLOWED_ERRORS.includes(error.name)) {
      error.name = 'CustomError';
    }

    try {
      const parameters = {
        env_nw_version: VERSION.full,
        env_node_version: `node ${process.version}`,
        errorName: error.name,
        errorMessage: error.message
      };
  
      this.__validateEvent('nw_exception', parameters);
  
      return await this.__addToQueue('nw_exception', parameters);
    } catch (e) {
      // Ignore
    }
  }

  async __flush() {
    if (!this.settings.usage_analytics.enabled) {
      return;
    }

    const pending = this.queueLength > 0;
  
    if (!pending) {
      return;
    }

    try {
      const logfile = this.__getLogFileLocation();

      const pendingLogs =  await fs.readFile(logfile, 'utf8');
      // The below is needed so that if flush is called multiple times,
      // we don't report the same event multiple times.
      await fs.truncate(logfile);
      this.queueLength = 0;

      const pendingLogsArray = pendingLogs.split('\n');
      pendingLogsArray.pop();
      const pendingTrackingEvents = pendingLogsArray.map(log => JSON.parse(log));

      // Time when the request is sent, expected in micro seconds.
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
 
  async __addToQueue(eventType, parameters) {
    if (!this.settings.usage_analytics.enabled) {
      return;
    }

    const writeLogPromise = await this.__logAnalyticsEvents({name: eventType, params: parameters});

    this.queueLength++;
    // periodically flush
    if (this.queueLength > 5) {
      await this.__flush();
    }

    return writeLogPromise;
  }

  async __send(data) {
    if (!this.settings.usage_analytics.enabled) {
      return;
    }

    this.logger.info('Analytics send event:', data);

    const path = this.__getGoogleAnalyticsPath();

    const serverUrl = new URL(this.settings.usage_analytics.serverUrl || GA_SERVER_URL) ;
    const serverPort = serverUrl.port || this.settings.usage_analytics.serverPort || GA_SERVER_PORT;

    const request = new HttpRequest({
      host: serverUrl.hostname,
      port: serverPort,
      method: 'POST',
      use_ssl: true,
      path,
      data
    });


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

  __getGoogleAnalyticsPath() {
    const apiKey = this.settings.usage_analytics.apiKey || GA_API_KEY;
    const trackingId = this.settings.usage_analytics.trackingId || GA_TRACKING_ID;

    return `/mp/collect?api_secret=${apiKey}&measurement_id=${trackingId}`;
  }
 
  async __logAnalyticsEvents(data) {
    const logfile = this.__getLogFileLocation();

    const hasAnalyticsLog = await fileExists(logfile);
    
    if (!hasAnalyticsLog) {
      await fs.mkdir(path.dirname(logfile), {recursive: true});
    } 

    const writeFn = hasAnalyticsLog ? fs.appendFile : fs.writeFile;

    try {
      await writeFn(logfile, JSON.stringify(data) + '\n');

    } catch (err) {
      this.logger.warn('Failed to log usage data:', err.message);
    }
  }

  __getLogFileLocation() {
    const log_path = this.settings.usage_analytics.log_path || './logs/analytics';

    return path.resolve(log_path, 'analytics.log');
  }

  __validateEvent(name, parameters) {

    Object.keys(parameters).forEach(key => {
      if (parameters[key] === undefined || parameters[key] === null) {
        parameters[key] = 'undefined';
      }
    });

    if (RESERVED_EVENT_NAMES.includes(name)) {
      throw Error(`Analytics event name ${name} is reserved.`);
    }
    
    Object.keys(parameters).forEach(key => {
      if (RESERVED_EVENT_PARAMETERS.includes(key)) {
        throw Error(`Parameter name ${key} is reserved.`);
      }

      if (typeof parameters[key] === 'object') {
        throw Error(`Parameter ${key} is an object. Only string and integer allowed.`);
      }
    });

    if (parameters.length > MAX_PARAMETERS_LENGTH) {
      throw Error(`Too many parameters. Maximum allowed is ${MAX_PARAMETERS_LENGTH}.`);
    }
  }
}

/**
 * Get a language code.
 */
function getLanguage() {
  return (process.env.LANG || // Default Unix env variable.
    process.env.LC_CTYPE || // For C libraries. Sometimes the above isn't set.
    process.env.LANGSPEC || // For Windows, sometimes this will be set (not always).
    getWindowsLanguageCode() ||
    '??');
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