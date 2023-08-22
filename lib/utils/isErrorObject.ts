import {NightwatchNodeError} from './types';

export = function(err: unknown): err is NightwatchNodeError {
  return err instanceof Error || Object.prototype.toString.call(err) === '[object Error]';
};
