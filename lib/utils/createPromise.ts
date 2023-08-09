import { Deferred } from "./types";

export = function createPromise<T>(): Deferred<T> {
  const deferred: Deferred<T> = {
    resolve: null,
    reject: null,
    promise: null
  };

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
};
