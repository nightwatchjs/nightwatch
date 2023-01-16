import { NightwatchTests } from 'nightwatch';
import assert from 'assert';

const home: NightwatchTests = {
  'Demo test': () => {
    assert.strictEqual(1+1, 2);
  }
};

export default home;
