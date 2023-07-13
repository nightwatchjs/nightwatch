import { expectAssignable, expectType } from 'tsd';
import { NightwatchAPI, NightwatchLogEntry, NightwatchLogTypes } from '..';


//
// .logs.getLog
//
describe('get log from Selenium', function() {
  it('get browser log (default)', function(browser) {
    const result = browser.logs.getLog(function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const logEntriesArray = result.value;
        expectType<NightwatchLogEntry[]>(logEntriesArray);
      }
    });
    expectAssignable<NightwatchAPI>(result);

    browser.logs.getLog('client', function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const logEntriesArray = result.value;
        expectType<NightwatchLogEntry[]>(logEntriesArray);
      }
    });
  });

  it('get driver log with ES6 async/await', async function(browser) {
    const driverLogAvailable = await browser.logs.isAvailable('driver');
    expectType<boolean>(driverLogAvailable);

    if (driverLogAvailable) {
      const logEntriesArray = await browser.logs.getLog('driver');
      expectType<NightwatchLogEntry[]>(logEntriesArray);
    }
  });
});

//
// .logs.getLogTypes
//
describe('get available log types', function() {
  it('get log types', function(browser) {
    const result = browser.logs.getLogTypes(function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const logTypes = result.value;
        expectType<NightwatchLogTypes[]>(logTypes);
      }
    });
    expectAssignable<NightwatchAPI>(result);
  });

  it('get log types with ES6 async/await', async function(browser) {
    const logTypes = await browser.logs.getLogTypes();
    expectType<NightwatchLogTypes[]>(logTypes);
  });
});

//
// .logs.isAvailable
//
describe('test if the log type is available', function() {
  it('test browser log type', function(browser) {
    const result = browser.logs.isAvailable(function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const isAvailable = result.value;
        expectType<boolean>(isAvailable);
      }
    });
    expectAssignable<NightwatchAPI>(result);

    browser.logs.isAvailable('performance', function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const isAvailable = result.value;
        expectType<boolean>(isAvailable);
      }
    });
  });

  it('test driver log type with ES6 async/await', async function(browser) {
    const isAvailable = await browser.logs.isAvailable('driver');
    expectType<boolean>(isAvailable);
    if (isAvailable) {
      // do something more in here
    }
  });
});
