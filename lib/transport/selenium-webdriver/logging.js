/* istanbul ignore file */
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
            Logger.warn(err, responseData);
            responseData = {};
          }

          let requestDataLog = [''];
          let responseHeadersLog = [''];
          let responseToken = '';
          const requestDataSettings = Logger.showRequestData();
          const showRequestParamsLog = requestDataSettings === true || requestDataSettings.enabled === true;

          if (showRequestParamsLog) {
            let contents;
            try {
              contents = JSON.parse(requestData);

              if (requestDataSettings.trimLongScripts && contents.script && contents.script.length > 220) {
                contents.script = contents.script.substring(0, 200) + ' ...';
              }
            } catch (err) {
              contents = err;
            }

            requestDataLog = [`   ${Logger.underline('Request data:')}`, contents, '\n'];
          }

          if (Logger.showResponseHeaders()) {
            responseHeadersLog = [`  ${Logger.underline('Response headers:')}`, responseHeaders, '\n'];
          }

          if (showRequestParamsLog || Logger.showResponseHeaders()) {
            responseToken = ` ${Logger.underline('Response data:')}`;
          }

          const delimiter = '–––––––––––––––––––––––––––––––––––––––';
          Logger.info(`Request ${Logger.colors.light_cyan(header)}`, ...requestDataLog, ...responseHeadersLog, responseToken, responseData, Logger.colors.light_cyan(` ${delimiter}`));

        }
      } catch (handleErr) {
        Logger.error(handleErr);
      }
    });
  }
};
