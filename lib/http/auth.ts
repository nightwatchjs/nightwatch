import HttpUtil = require('./http');
import {ClientRequest} from 'http';


class Auth {
  #httpRequest: ClientRequest;

  constructor(httpRequest: ClientRequest) {
    this.#httpRequest = httpRequest;
  }

  private basic(user: string, pass: string): string {
    return `Basic ${Auth.toBase64(`${user}:${pass}`)}`;
  }

  addAuth(user: string, pass: string): void {
    if (user && pass) {
      this.#httpRequest.setHeader(HttpUtil.Headers.AUTHORIZATION, this.basic(user, pass));
    }
  }

  static toBase64(str: string): string {
    return Buffer.from(str).toString('base64');
  }
}

export = Auth;
