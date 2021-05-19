const {logging} = require('selenium-webdriver');
const {Logger} = require('../../utils');

module.exports = {
  setupVerboseLogging({isSelenium = false}) {
    const logger = logging.getLogger('webdriver.http');
    logger.setLevel(logging.Level.FINER);
    logger.addHandler(function(entry) {
      const {message, level, timestamp} = entry;
      try {

        const lines = message.split('\n');
        const containsData = lines.length > 1;

        if (containsData) {
          lines.shift();
          const header = lines.shift();
          const requestMethod = header.split(' ')[0];

          const accept = lines.shift();
          const separator = lines.shift();
          const requestData = lines.shift();
          const responseHeaders = [];

          let line = lines.shift();

          while (line !== '') {
            responseHeaders.push(line);
            line = lines.shift();
          }

          let responseData;
          if (isSelenium) {
            responseData = lines.join('');
          } else {
            responseData = lines.shift();
          }

          try {
            responseData = JSON.parse(responseData);
            if (isSelenium && responseData.value && responseData.value.stacktrace) {
              const causedBy = responseData.value.stacktrace.split('\n').filter(line => line.startsWith('Caused by:'));
              const errorMsg = causedBy
                .map(line => line.replace(/Caused by: java\.lang\.[a-zA-Z.]+:*/, ''))
                .reduce((prev, line) => {
                  if (line) {
                    prev.push(line);
                  }

                  return prev;
                }, [])
                .join('\n');

              responseData.value.message = responseData.value.message || '';
              responseData.value.message += `\n${errorMsg}`;

              delete responseData.value.stacktrace;
            }
            if (isSelenium && responseData.value && responseData.value.stackTrace) {
              delete responseData.value.stackTrace;
            }
          } catch (err) {
            Logger.error(err);
            responseData = {};
          }

          let requestDataLog = [''];
          let responseHeadersLog = [''];
          let responseToken = '';
          if (Logger.showRequestData()) {
            requestDataLog = ['   Request data:', JSON.parse(requestData), '\n'];
          }

          if (Logger.showResponseHeaders()) {
            responseHeadersLog = ['  Response headers:', responseHeaders];
            responseToken = '\n   Response data:';
          }
          const delimiter = '–––––––––––––––––––––––––––––––––––––––';
          Logger.info(`Request ${Logger.colors.light_cyan(header)}`, ...requestDataLog, ...responseHeadersLog, responseToken, responseData, Logger.colors.light_cyan(` ${delimiter}`));

        }
      } catch (handleErr) {
        Logger.error(handleErr);
      }
    });
  }
}