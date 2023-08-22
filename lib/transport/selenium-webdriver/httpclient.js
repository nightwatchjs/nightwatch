const HttpRequest = require('../../http/request.js');

module.exports = function(settings, HttpResponse) {
  // TODO: handle agent and proxy arguments below
  const url = require('url');

  return class HttpClient {
    constructor(serverUrl, opt_agent, opt_proxy) {
      this.agent_ = opt_agent || null;
      // eslint-disable-next-line
      const options = url.parse(serverUrl);
      if (!options.hostname) {
        throw new Error('Invalid URL: ' + serverUrl);
      }
      this.proxyOptions_ = opt_proxy ? {} : null;

      const {hostname: host, pathname: path, protocol} = options;
      const {log_screenshot_data} = settings;
      let {port} = options;
      if (port) {
        port = Number(port);
        HttpRequest.updateGlobalSettings({port});
      } else {
        port = protocol === 'https' ? 443 : 80;
      }

      this.options = {
        host,
        port,
        path,
        addtOpts: {
          suppressBase64Data: !log_screenshot_data
        },
        use_ssl: protocol === 'https:'
      };
      this.errorTimeoutId = null;

    }

    /** @override */
    send(httpRequest) {
      const {method, data, path} = httpRequest;
      const headers = {};

      if (httpRequest.headers) {
        httpRequest.headers.forEach(function (value, name) {
          headers[name] = value;
        });
      }

      this.options.headers = headers;
      this.options.data = data;
      this.options.path = path;
      this.options.method = method;

      const request = new HttpRequest(this.options);

      return new Promise((resolve, reject) => {
        request.once('success', (data, response, isRedirect) => {
          const {statusCode, headers} = response;
          let body = '';
          if (data) {
            try {
              body = JSON.stringify(data);
            } catch (err) {
              //
            }
          }

          if (data && data.error) {
            reject(data);
          } else {
            const resp = new HttpResponse(statusCode, headers, body);
            resolve(resp);
          }
        });

        request.on('error', (err) => {
          let {message, code} = err;

          // for connection reset errors, sometimes the error event gets fired multiple times
          if (this.errorTimeoutId) {
            clearTimeout(this.errorTimeoutId);
          }
          this.errorTimeoutId = setTimeout(() => {
            if (code) {
              message = code + ' ' + message;
            }

            const error = new Error(message);
            if (code) {
              error.code = code;
            }

            reject(error);
          }, 15);
        });

        request.send();
      });
    }
  };
};
