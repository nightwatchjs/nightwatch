
/** Parts of the code are taken from angular-cli code base which is governed by the following license:
 * https://angular.io/license
 */

const os = require('os');
const https = require('https');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const {Logger, VERSION, fileExistsSync} = require('../utils');
/**
 * See: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
 */
class AnalyticsCollector {  
  constructor(settings) {
    this.settings = settings;

    this.trackingEventsQueue = [];
    this.parameters = {};
    
    // This idendifies unique users and helps us separate out sessions.
    this.parameters['client_id'] = this.getClientId();

    // Prevents google from indexing the events for ad targeting.
    this.parameters['non_personalized_ads'] = true;

    // User properties
    this.parameters['user_propertie'] = {
      ua: buildUserAgentString(),
      lang: getLanguage(),
      nw_version: VERSION.full,
      node_version: `node ${process.version}`
    };
  }

  event(name, parameters = {}) {
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
    const pending = this.trackingEventsQueue.length;
  
    if (!pending) {
      return;
    }

    // The below is needed so that if flush is called multiple times,
    // we don't report the same event multiple times.
    const pendingTrackingEvents = this.trackingEventsQueue;
    this.trackingEventsQueue = [];
    
    // time is expected in micro seconds.
    const timestamp_micros = new Date().getTime() * 1000;

    const payload = {
      ...this.parameters,
      timestamp_micros,
      events: pendingTrackingEvents
    };

    try {
      await this.send(payload);
    } catch (error) {
      // Failure to report analytics shouldn't crash the system.
      Logger.error('Analytics send error:', error);
    }
  }
 
   
  addToQueue(eventType, parameters) {
    this.trackingEventsQueue.push({name: eventType, params: parameters});
  }

  async send(data) {
    Logger.info('Analytics send event:', data);
    
    return new Promise((resolve, reject) => {

      const path = `/mp/collect?api_secret=${this.settings.analytics.apiSecret}&measurement_id=${this.settings.analytics.trackingId}`;

      const request = https.request(
        {
          host: this.settings.analytics.serverUrl,
          port: this.settings.analytics.serverPort,
          method: 'POST',
          path
        },
        (response) => {
          if (response.statusCode !== 204) {
            reject(
              new Error(`Analytics reporting failed with status code: ${response.statusCode}.`)
            );

            return;
          }
        }
      );

      request.on('error', (err) => {
        reject(err);
      });


      request.write(JSON.stringify(data));
      request.end(resolve);
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
  getClientId() {
    // use default nightwatch.json file if we haven't received another value
    const homedir = require('os').homedir();
    const rcfilePath = path.resolve(homedir, '.nightwatchrc');
    const hasRCFile = fileExistsSync(rcfilePath);

    let client_id = uuid.v4();
    if (!hasRCFile) {
      fs.writeFileSync(rcfilePath, JSON.stringify({client_id}), {encoding: 'utf-8'});
    }

    try {
      const rcFileContent = JSON.parse(fs.readFileSync(rcfilePath, 'utf8'));
      client_id = rcFileContent.client_id || client_id;
    } catch (err) {;}

    return client_id;
  }

  /**
    * Creates the dimension and metrics variables to add to the queue.
    */
  customVariables(options) {
    const additionals = {};
    const {dimensions, metrics} = options;
    
    if (dimensions) {
      dimensions.forEach((v, i) => (additionals[`cd${i}`] = v));
    }

    if (metrics) {
      metrics.forEach((v, i) => (additionals[`cm${i}`] = v));
    }

    return additionals;
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


module.exports = AnalyticsCollector;