interface Deferred<T> {
  promise: Promise<T>;
  resolve: ((value: T | PromiseLike<T>) => void);
  reject: ((reason?: unknown) => void);
}

export = function createPromise<T>(): Deferred<T> {
  const deferred = <Deferred<T>> {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
};
