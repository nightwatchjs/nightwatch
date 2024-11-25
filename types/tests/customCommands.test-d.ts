import {expectType} from 'tsd';
import {CustomCommandInstance, NightwatchCallbackResult, NightwatchCustomCommandsModel} from '..';

export class AngularCommand implements NightwatchCustomCommandsModel {
  async command(this: CustomCommandInstance, listName: string, cb = function<T>(r: T) {return r}) {
    // Script to be executed in the browser
    const script = function(listName: string) {
      // executed in the browser context
      // eslint-disable-next-line
      var elements = document.querySelectorAll('*[ng-repeat$="'+listName+'"]');

      if (elements) {return elements}

      return null;
    };

    // Arguments to be passed to the script function above
    const args: [string] = [listName];

    // Callback to be called when the script finishes its execution,
    // with the result returned by the script passed as argument.
    const callback = async function(result: any) {
      const cbResult = await cb(result);

      if (cbResult.value) {
        return cbResult.value;
      }

      return cbResult;
    };

    // Execute the script defined above, along with arguments and
    // the callback function.
    await this.api.executeScript(script, args, callback);


    // CUSTOM COMMAND WITH `this.httpRequest` EXAMPLE
    const response = await this.httpRequest({
      path: '/session/:sessionId/url',
      sessionId: this.api.sessionId,
      method: 'POST',
      data: {
        url: 'https://nightwatchjs.org'
      }
    });
    expectType<unknown>(response);

    // CUSTOM COMMAND WITH `this.transportActions` EXAMPLE (still incomplete)
    const currentUrl = await (this.transportActions as TransportActions).getCurrentUrl();
    expectType<NightwatchCallbackResult<string>>(currentUrl);

    this.complete('hello', 1, true, {value: null});
  }
}

interface TransportActions {
  getCurrentUrl(): Promise<NightwatchCallbackResult<string>>;
}
