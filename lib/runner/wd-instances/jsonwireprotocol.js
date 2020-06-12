const http = require('http');
const BaseWDServer = require('./base-wd-server.js');
const {Logger} = require('../../utils');

class JsonWireProtocol extends BaseWDServer {
  checkForOpenSessions() {
    return new Promise((resolve, reject) => {
      if (this.exited) {
        return resolve(null);
      }

      let request = http.get({
        host: this.settings.host,
        port: this.settings.port,
        path: this.sessionsEndpoint
      }, response => {
        response.setEncoding('utf8');
        let rawData = '';

        response.on('data', chunk => {
          rawData += chunk;
        });

        response.on('end', () => {
          if (response.statusCode === 200) {
            try {
              let result = JSON.parse(rawData);
              resolve(result);
            } catch (err) {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });

      request.on('error', () => {
        resolve(null);
      });

      request.setTimeout(BaseWDServer.OPEN_SESSIONS_CHECK_TIMEOUT, () => {
        request.abort();
        resolve(null);
      });
    });
  }

  closeOpenSessions(sessions) {
    let promises = [];

    sessions.forEach(session => {
      promises.push(new Promise((resolve, reject) => {
        let request = http.request({
          method: 'DELETE',
          host: this.settings.host,
          port: this.settings.port,
          path: `${this.singleSessionEndpoint}/${session.id}`
        }, response => {
          response.setEncoding('utf8');
          let rawData = '';

          response.on('data', chunk => {
            rawData += chunk;
          });

          response.on('end', () => {
            Logger.info(`Closed open session with ID: ${session.id}.`);

            resolve();
          });
        });

        request.on('error', () => {
          Logger.warn(`Failed to close open session with ID: ${session.id}.`);

          resolve();
        });

        request.setTimeout(BaseWDServer.DELETE_OPEN_SESSION_TIMEOUT, () => {
          request.abort();
          Logger.warn(`Time out while trying to close open session with ID: ${session.id}.`);

          resolve();
        });

        request.end();
      }));
    });

    return Promise.all(promises);
  }
}

module.exports = JsonWireProtocol;
