import { expectAssignable, expectType } from 'tsd';
import { NightwatchAPI, NightwatchLogEntry, NightwatchLogTypes } from '..';


//
// .logs.getSessionLog
//
describe('get log from Selenium', function() {
  it('get browser log (default)', function(browser) {
    const result = browser.logs.getSessionLog(function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const logEntriesArray = result.value;
        expectType<NightwatchLogEntry[]>(logEntriesArray);
      }
    });
    expectAssignable<NightwatchAPI>(result);

    browser.logs.getSessionLog('client', function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const logEntriesArray = result.value;
        expectType<NightwatchLogEntry[]>(logEntriesArray);
      }
    });
  });

  it('get driver log with ES6 async/await', async function(browser) {
    const driverLogAvailable = await browser.logs.isSessionLogAvailable('driver');
    expectType<boolean>(driverLogAvailable);

    if (driverLogAvailable) {
      const logEntriesArray = await browser.logs.getSessionLog('driver');
      expectType<NightwatchLogEntry[]>(logEntriesArray);
    }
  });
});

//
// .logs.getSessionLogTypes
//
describe('get available log types', function() {
  it('get log types', function(browser) {
    const result = browser.logs.getSessionLogTypes(function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const logTypes = result.value;
        expectType<NightwatchLogTypes[]>(logTypes);
      }
    });
    expectAssignable<NightwatchAPI>(result);
  });

  it('get log types with ES6 async/await', async function(browser) {
    const logTypes = await browser.logs.getSessionLogTypes();
    expectType<NightwatchLogTypes[]>(logTypes);
  });
});

//
// .logs.isSessionLogAvailable
//
describe('test if the log type is available', function() {
  it('test browser log type', function(browser) {
    const result = browser.logs.isSessionLogAvailable(function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const isAvailable = result.value;
        expectType<boolean>(isAvailable);
      }
    });
    expectAssignable<NightwatchAPI>(result);

    browser.logs.isSessionLogAvailable('performance', function(result) {
      expectType<NightwatchAPI>(this);
      if (result.status === 0) {
        const isAvailable = result.value;
        expectType<boolean>(isAvailable);
      }
    });
  });

  it('test driver log type with ES6 async/await', async function(browser) {
    const isAvailable = await browser.logs.isSessionLogAvailable('driver');
    expectType<boolean>(isAvailable);
    if (isAvailable) {
      // do something more in here
    }
  });
});
