
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

/**
 * See: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
 */
class AnalyticsCollector {  
  constructor() {
    // in case settings are not updated, disable analytics
    this.settings = {
      analytics: {
        enabled: false
      }
    };

    this.queueLength = 0;
    this.parameters = {};
    this.logger = Logger;
    
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
    
    // update queueLength from log file
    // this is done here because the log file might be at a different location and the constructor will not know that
    try {
      const stat = fs.statSync(this.getLogFileLocation());
      this.queueLength = stat.size; // the actual value doesn't matter
    } catch (e) {;}
  }

  updateLogger(logger) {
    this.logger = logger;
  }

  event(name, parameters = {}) {
    parameters.callLocation = getCallLocation();
    this.addToQueue(name, parameters);
  }
 

  exception(modulePath, errorMessage, stackTrace) {
    this.addToQueue('nw_exception', {
      modulePath,
      errorMessage, 
      stackTrace
    });
  }

  async flush() {
    if (!this.settings.analytics.enabled) {
      return;
    }

    const pending = this.queueLength;
  
    if (!pending) {
      return;
    }

    try {
      const logfile = this.getLogFileLocation();

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

      await this.send(payload);
    } catch (error) {
      // Failure to report analytics shouldn't crash the system.
      this.logger.error('Analytics flush error:', error);
    }
  }
 
  addToQueue(eventType, parameters) {
    if (!this.settings.analytics.enabled) {
      return;
    }

    this.logAnalyticsEvents({name: eventType, params: parameters});

    // periodically flush
    if (this.queueLength > 20) {
      this.flush();
    }
  }

  async send(data) {
    if (!this.settings.analytics.enabled) {
      return;
    }

    this.logger.info('Analytics send event:', data);

    const path = `/mp/collect?api_secret=${this.settings.analytics.apiKey}&measurement_id=${this.settings.analytics.trackingId}`;

    const serverUrl = new URL(this.settings.analytics.serverUrl);
    const serverPort = serverUrl.port || this.settings.analytics.serverPort;

    const request = new HttpRequest({
      host: serverUrl.hostname,
      port: serverPort,
      method: 'POST',
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
        .on('error', (result, response) => {
          new Error(`Analytics reporting failed with status code: ${response.statusCode}.`);
          reject(result);
        })
        .send();
    });
  }
 
  async logAnalyticsEvents(data) {
    const logfile = this.getLogFileLocation();

    const hasAnalyticsLog = fileExistsSync(logfile);
    const writeFn = hasAnalyticsLog ? fs.appendFile : fs.writeFile;


    return new Promise((resolve, reject) => {
      writeFn(logfile, JSON.stringify(data), function (err) {
        if (err) {
          this.logger.error('Failed to log analytics data');
        } 
        resolve();
      });
    });
  }

  promptUser() {
    if (!this.settings.analytics.enabled) {
      // eslint-disable-next-line no-console
      console.log('Do you want to send anonymous analytics data?');

      // TODO: read and set user preference. 
    }
  }

  /**
   * Fetch client_id from .nightwatchrc file, generate and save one if not present.
   * @returns stored/generated client_id for the client.
   */
  syncClientId() {
    // use default nightwatch.json file if we haven't received another value
    const homedir = require('os').homedir();
    const rcfilePath = path.join(homedir, '.nightwatchrc');
    const hasRCFile = fileExistsSync(rcfilePath);

    let client_id = this.parameters['client_id'];
    if (!hasRCFile) {
      fs.writeFileSync(rcfilePath, JSON.stringify({client_id}), {encoding: 'utf-8'});
    }

    try {
      const rcFileContent = JSON.parse(fs.readFileSync(rcfilePath, 'utf8'));
      client_id = rcFileContent.client_id || client_id;
    } catch (err) {;}

    this.parameters['client_id'] = client_id;
  }

  getLogFileLocation() {
    const log_path = this.settings.analytics.log_path || './log/analytics';

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