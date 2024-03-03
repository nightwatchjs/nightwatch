interface Result {
    status: number;
    code?: string;
    name?: string;
    value: any;
    error?: string;
    message? : string;
}
  
type PerformActionFunction = (callback: (result: Result | Error) => void) => void;
type UserSuppliedCallbackFunction = (resultValue: any) => Promise<any> | void;
  
class ClientCommand {

  static get isTraceable(): boolean {
    return false;
  }

  transportActions : any;

  static makePromise({
    performAction,
    userSuppliedCallback = () => {},
    fullResultObject = true,
    fullPromiseResolve = true
  }: {
        performAction: PerformActionFunction;
        userSuppliedCallback?: UserSuppliedCallbackFunction;
        fullResultObject?: boolean;
        fullPromiseResolve?: boolean;
    }): Promise<any> {
    return new Promise((resolve, reject) => {
      performAction((result : Result | Error) => {
        try {
          if (result) {
            const {name, message} = result;
            const code = (result as Result).code;

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

          const resultValue = fullResultObject ? result : (result as Result).value;
          let promise = userSuppliedCallback.call(this, resultValue);
          if (!(promise instanceof Promise)) {
            promise = Promise.resolve(promise);
          }

          const resolveValue = fullPromiseResolve ? result : (result as Result).value;
          promise.then(() => resolve(resolveValue)).catch(err => reject(err));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  returnsFullResultObject(): boolean {
    return true;
  }

  resolvesWithFullResultObject(): boolean {
    return true;
  }

  reportProtocolErrors(): boolean {
    return true;
  }

  command(performAction : PerformActionFunction, userSuppliedCallback: UserSuppliedCallbackFunction): Promise<any> {
    return ClientCommand.makePromise({
      performAction,
      userSuppliedCallback,
      fullResultObject: this.returnsFullResultObject(),
      fullPromiseResolve: this.resolvesWithFullResultObject()
    });
  }

  executeScriptHandler(
    method: string,
    script: string | ((...args: any[]) => any),
    args: any[],
    callback: (result: any) => void
  ): any {
    let fn;

    if (script instanceof Function) {
      fn = `var passedArgs = Array.prototype.slice.call(arguments,0); return (${script.toString()}).apply(window, passedArgs);`;
    } else {
      fn = script;
    }

    return this.transportActions[method](fn, args, callback);
  }
}

export default ClientCommand;
