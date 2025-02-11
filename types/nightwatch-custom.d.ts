import {NightwatchAPI} from './index';

declare module 'nightwatch' {
  export interface NightwatchCustomPageObjects {
    rightClick(selector: string, callback?: (this: NightwatchAPI) => void): this;
  }
}
