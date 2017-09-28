const HttpRequest = require('../http/request.js');

class SeleniumProtocol extends events.EventEmitter {
  constructor(opts = {}) {
    super();

    this.options = opts;
    this.sessionId = null;
  }

  createSession() {
    let options = {
      path : '/session',
      data : {
        desiredCapabilities : this.options.desiredCapabilities
      }
    };
    let request = new HttpRequest(options);

    return new Promise((resolve, reject) => {
      request.on('success', function(data, response, isRedirect) {
        if (data && data.sessionId) {
          this.sessionId = data.sessionId;
          if (data.value) {
            this.capabilities = data.value;
          }

          //this.emit('selenium:session_create', self.sessionId, request, response);
          resolve();
        } else if (isRedirect) {
          self.followRedirect(request, response);
        } else {
          request.emit('error', data, null);
        }
      })
        .on('error', function(data, err) {
          if (self.options.output) {
            console.error('\n' + Logger.colors.light_red('Error retrieving a new session from the selenium server'));
          }

          if (typeof data == 'object' && Object.keys(data).length === 0) {
            data = '';
          }

          if (!data && err) {
            data = err;
          }

          self.emit('error', data);
        })
        .send();
    });
  }

  followRedirect(request, response) {
    if (!response.headers || !response.headers.location) {
      this.emit('error', null, null);
      return this;
    }
    var url = require('url');
    var urlParts = url.parse(response.headers.location);
    request.setOptions({
      path   : urlParts.pathname,
      host   : urlParts.hostname,
      port   : urlParts.port,
      method : 'GET'
    }).send();

    return this;
  }

}