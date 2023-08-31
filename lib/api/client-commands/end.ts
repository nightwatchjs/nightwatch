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
  settings: {
    report_command_errors: boolean;
  };
}

class End extends EventEmitter {
  timeoutId: string | number  | undefined | NodeJS.Timeout;
  api: NightwatchAPI = {} as NightwatchAPI;
  client: TypeClient = {sessionId: null, setApiProperty: () => {}, transport: {closeDriver: () => Promise.resolve()}, api: this.api, settings: {report_command_errors: true}};
  reuseBrowser: boolean = false;

  command(forceEnd = !this.reuseBrowser, callback: (result: NightwatchCallbackResult<null>) => NightwatchCallbackResult<null>) {

    if (typeof callback === 'function') {
      forceEnd = forceEnd || !this.reuseBrowser;
    } else if (typeof forceEnd === 'function') {
      callback = forceEnd;
      forceEnd = !this.reuseBrowser;
    }

    const client = this.client;

    if (this.api.sessionId && forceEnd) {
      this.api.session('delete', (result: NightwatchCallbackResult<Record<string, unknown>>) => {
        client.sessionId = null;
        client.setApiProperty('sessionId', null);

        this.client.transport.closeDriver('FINISHED').then(() => {
          this.complete(callback, result);
        });
      });
    } else {
      setImmediate(() => {
        this.complete(callback, null);
      });
    }

    return this.client.api;
  }

  complete(callback: (result: NightwatchCallbackResult<null>) => NightwatchCallbackResult<null>, response: NightwatchCallbackResult<Record<string, unknown>> | null) {
    let result: NightwatchCallbackResult<null> = {status: 0, value: null, error: {cause: '', message: '', name: ''}};
    if (typeof callback === 'function') {
      result = callback.call(this.api,  response as NightwatchCallbackResult<null>);
    }
    
    this.emit('complete', result);
  }
}

export = End;
