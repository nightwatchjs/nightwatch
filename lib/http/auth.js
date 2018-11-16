const HttpUtil = require('./http.js');

class Auth {
  constructor(httpRequest) {
    this.httpRequest = httpRequest;
  }

  basic(user, pass) {
    let authHeader = Auth.toBase64(`${user}:${pass}`);
    return `Basic ${authHeader}`;
  }

  addAuth(user, pass, bearer) {
    if (user && pass) {
      this.httpRequest.setHeader(HttpUtil.Headers.AUTHORIZATION, this.basic(user, pass));
    }
  }

  static toBase64(str) {
    return Buffer.from(str).toString('base64');
  }
}

module.exports = Auth;