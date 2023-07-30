interface ResultObject {
  status: number;
  code: any;
  name: any;
  value: {
    message: any;
  };
  error: any;
}

interface MakePromiseOptions {
  performAction: (callback : (result : ResultObject) => void) => void;
  userSuppliedCallback?: (param : any) => any;
  fullResultObject?: boolean;
  fullPromiseResolve?: boolean;
}

export default class ClientCommand {
  static get isTraceable() : boolean {
    return false;
  }

  /**
   *
   * @param {function} performAction Function to run which contains the command, passing a callback containing the result object
   * @param {function} userSuppliedCallback
   * @param {boolean} fullResultObject Weather to call the user-supplied callback with the entire result object or just the value
   * @param {boolean} fullPromiseResolve Weather to resolve the promise with the full result object or just the "value" property
   * @return {Promise}
   */
  
  static makePromise({
      performAction, 
      userSuppliedCallback = function() {}, 
      fullResultObject = true, 
      fullPromiseResolve = true
    } : MakePromiseOptions) : Promise<any> {
    return new Promise((resolve, reject) => {
      performAction((result) => {
        try {
          if (result instanceof Error) {
            const {name, message, code} = result;

            result = {
              status: -1,
              code,
              name,
              value: {
                message
              },
              error: message
            };
          }

          const resultValue = fullResultObject ? result : result.value;
          let promise = userSuppliedCallback.call(this, resultValue);
          if (!(promise instanceof Promise)) {
            promise = Promise.resolve(promise);
          }

          const resolveValue = fullPromiseResolve ? result : result.value;
          promise.then((_ : any) => resolve(resolveValue)).catch((err : Error) => reject(err));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  get returnsFullResultObject() : boolean {
    return true;
  }

  get resolvesWithFullResultObject() : boolean {
    return true;
  }

  reportProtocolErrors(result : any) : boolean {
    return true;
  }

  performAction () {}

  command(userSuppliedCallback : (param : any) => void) {
    const {performAction} = this;

    return ClientCommand.makePromise({
      performAction: performAction.bind(this),
      userSuppliedCallback,
      fullResultObject: this.returnsFullResultObject,
      fullPromiseResolve: this.resolvesWithFullResultObject
    });
  }

  /*!
   * Helper function for execute and execute_async
   *
   * @param {string} method
   * @param {string|function} script
   * @param {Array} args
   * @param {function} callback
   * @private
   */

  transportActions : any = {}

  executeScriptHandler(method : string, script : string | Function, args : any[], callback : (param : any) => void) {
    let fn;

    if ((script as any).originalTarget) {
      script = (script as any).originalTarget;
    }

    if (typeof script === 'function') {
      fn = 'var passedArgs = Array.prototype.slice.call(arguments,0); return (' +
        script.toString() + ').apply(window, passedArgs);';
    } else {
      fn = script;
    }

    return this.transportActions[method](fn, args, callback);
  }
};
