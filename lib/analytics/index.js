const os = require('os');
const https = require('https');
const uuid = require('uuid');
const {Logger, VERSION} = require('../utils');

/**
 * See: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide
 */
class AnalyticsCollector {  
  constructor(settings) {
    this.settings = settings;

    this.trackingEventsQueue = [];
    this.parameters = {};
    
    // API Version
    // this.parameters['v'] = '4';

    // User ID
    this.parameters['client_id'] = uuid.v4();

    // Tracking
    this.parameters['user_id'] = _buildUserAgentString();
  }


  event(name, parameters = {}) {
    this.addToQueue(name, parameters);
  }
 

  timing(utc, utv, utt, options = {}) {
    const {label: utl, metrics, dimensions} = options;
    this.addToQueue('timing', {utc, utv, utt, utl, metrics, dimensions});
  }
 
  exception(exf, exd, options = {}) {
    const {metrics, dimensions} = options;
    this.addToQueue('exception', {exf, exd, metrics, dimensions});
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

    const payload = {
      ...this.parameters,
      events: pendingTrackingEvents
    };

    try {
      await this.send(payload);
    } catch (error) {
      // Failure to report analytics shouldn't crash the CLI.
      Logger.error('Analytics send error:', error);
    }
  }
 
   
  addToQueue(eventType, parameters) {
    this.trackingEventsQueue.push({name: eventType, params: parameters});
  }

  async send(data) {
    Logger.info('Analytics send event:', data);
    
    return new Promise((resolve, reject) => {
      const path = `/mp/${data.length > 1? 'batch': 'collect'}?api_secret=xI6FfBHNSuCKSyPqQ6O59A&measurement_id=${this.settings.analytics.trackingId}`; 
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

  static get NightwatchAnalyticsDimensions()  {
    return {
      CpuCount: 1,
      CpuSpeed: 2,
      RamInGigabytes: 3,
      NodeVersion: 4,
      BuildErrors: 20
    };
  };

  // TODO: add nightwatch specific metrics here
  static get NightWatchAnalyticsMetrics() {
    return {
      NgComponentCount: 1,
      UNUSED_2: 2,
      UNUSED_3: 3,
      UNUSED_4: 4,
      BuildTime: 5,
      NgOnInitCount: 6,
      InitialChunkSize: 7,
      TotalChunkCount: 8,
      TotalChunkSize: 9,
      LazyChunkCount: 10,
      LazyChunkSize: 11,
      AssetCount: 12,
      AssetSize: 13,
      PolyfillSize: 14,
      CssSize: 15
    };
  };
}

// These are just approximations of UA strings. We just try to fool Google Analytics to give us the
// data we want.
// See https://developers.whatismybrowser.com/useragents/
const osVersionMap = {
  darwin: {
    '1.3.1': '10_0_4',
    '1.4.1': '10_1_0',
    '5.1': '10_1_1',
    '5.2': '10_1_5',
    '6.0.1': '10_2',
    '6.8': '10_2_8',
    '7.0': '10_3_0',
    '7.9': '10_3_9',
    '8.0': '10_4_0',
    '8.11': '10_4_11',
    '9.0': '10_5_0',
    '9.8': '10_5_8',
    '10.0': '10_6_0',
    '10.8': '10_6_8'
    // We stop here because we try to math out the version for anything greater than 10, and it
    // works. Those versions are standardized using a calculation now.
  },
  win32: {
    '6.3.9600': 'Windows 8.1',
    '6.2.9200': 'Windows 8',
    '6.1.7601': 'Windows 7 SP1',
    '6.1.7600': 'Windows 7',
    '6.0.6002': 'Windows Vista SP2',
    '6.0.6000': 'Windows Vista',
    '5.1.2600': 'Windows XP'
  }
};
 
/**
 * Build a fake User Agent string. This gets sent to Analytics so it shows the proper OS version.
 */
function _buildUserAgentString() {
  switch (os.platform()) {
    case 'darwin': {
      let v = osVersionMap.darwin[os.release()];

      if (!v) {
        // Remove 4 to tie Darwin version to OSX version, add other info.
        const x = parseFloat(os.release());
        if (x > 10) {
          v = '10_' + (x - 4).toString().replace('.', '_');
        }
      }

      const cpuModel = os.cpus()[0].model.match(/^[a-z]+/i);
      const cpu = cpuModel ? cpuModel[0] : os.cpus()[0].model;

      return `(Macintosh; ${cpu} Mac OS X ${v || os.release()})`;
    }

    case 'win32':
      return `(Windows NT ${os.release()})`;

    case 'linux':
      return `(X11; Linux i686; ${os.release()}; ${os.cpus()[0].model})`;

    default:
      return os.platform() + ' ' + os.release();
  }
}


module.exports = AnalyticsCollector;