import EventEmitter from 'events';
import {NightwatchAPI, NightwatchCallbackResult} from '../../../types/index';

/**
 * Ends the session. Uses session protocol command.
 *
 * @example
 * this.demoTest = function (browser) {
 *   browser.end();
 * };
 *
 * @method end
 * @syntax .end([callback])
 * @param {function} [callback] Optional callback function to be called when the command finishes.
 * @see session
 * @api protocol.sessions
 */

interface TypeClient {
  sessionId: string | null;
  setApiProperty: (name: string, value: string | null) => void;
  transport: {
    closeDriver: (reason: string) => Promise<void>;
  };
  api: NightwatchAPI;
}

class End extends EventEmitter {
  timeoutId: string | number  | undefined | NodeJS.Timeout;
  api: NightwatchAPI = {} as NightwatchAPI;
  client: TypeClient = {sessionId: null, setApiProperty: () => {}, transport: {closeDriver: () => Promise.resolve()}, api: this.api};
  reuseBrowser: boolean = false;

  command(forceEnd = !this.reuseBrowser, callback: ((this: NightwatchAPI, result: NightwatchCallbackResult<null> | null) => void) | undefined | boolean) {

    if (typeof callback === 'function') {
      forceEnd = forceEnd || !this.reuseBrowser;
    } else if (typeof forceEnd === 'function') {
      callback = forceEnd;
      forceEnd = !this.reuseBrowser;
    }

    const client = this.client;

    if (this.api.sessionId && forceEnd) {
      this.api.session('delete', (result: NightwatchCallbackResult<Record<string, unknown>> | null) => {
        client.sessionId = null;
        client.setApiProperty('sessionId', null);

        this.client.transport.closeDriver('FINISHED').then(() => {
          this.complete(callback, result as NightwatchCallbackResult<null>);
        });
      });
    } else {
      setImmediate(() => {
        this.complete(callback, null);
      });
    }

    return this.client.api;
  }

  complete(callback: ((this: NightwatchAPI, result: NightwatchCallbackResult<null> | null) => void) | undefined | boolean, response: NightwatchCallbackResult<null> | null) {
    let result;
    if (typeof callback === 'function') {
      result = callback.call(this.api,  response as NightwatchCallbackResult<null>);
    }

    this.emit('complete', result);
  }
}

export = End;
