import { expectError, expectType } from 'tsd';
import { AppiumGeolocation, NightwatchAPI } from '..';

//
// orientation
//
describe('orientation commands', function () {
  it('tests orientation commands', function () {
    expectType<NightwatchAPI>(app);
    expectType<boolean>(app.isAppiumClient());

    app.appium
      .getOrientation(function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<'LANDSCAPE' | 'PORTRAIT'>(result.value);
        }
      })
      .appium.setOrientation('LANDSCAPE', function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<'LANDSCAPE' | 'PORTRAIT'>(result.value);
        }
      });
  });

  it('tests orientation commands with async/await', async function () {
    expectType<NightwatchAPI>(app);
    expectType<boolean>(app.isAppiumClient());

    const orientation = await app.appium.getOrientation();
    expectType<'LANDSCAPE' | 'PORTRAIT'>(orientation);

    const result = await app.appium.setOrientation('PORTRAIT');
    expectType<'LANDSCAPE' | 'PORTRAIT'>(result);
  });
});

//
// context commands
//
describe('context commands', function () {
  it('tests context commands', function (app: NightwatchAPI) {
    expectType<boolean>(app.isAppiumClient());

    app.appium
      .getContexts(function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<string[]>(result.value);
        }
      })
      .appium.getContext(function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<string | null>(result.value);
        }
      })
      .appium.setContext('something', function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<null>(result.value);
        }
      });
  });

  it('tests context commands with async/await', async function (app: NightwatchAPI) {
    expectType<boolean>(app.isAppiumClient());

    const contexts = await app.appium.getContexts();
    expectType<string[]>(contexts);

    const context = await app.appium.getContext();
    expectType<string | null>(context);

    const result = await app.appium.setContext('random');
    expectType<null>(result);
  });
});

//
// activity commands
//
describe('activity commands', function () {
  it('tests activity commands', function (app: NightwatchAPI) {
    app.appium
      .startActivity(
        {
          appPackage: 'com.some.package',
          appActivity: 'some.activity',
        },
        function (result) {
          expectType<NightwatchAPI>(this);
          if (result.status === 0) {
            expectType<null>(result.value);
          }
        }
      )
      .appium.getCurrentActivity(function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<string>(result.value);
        }
      })
      .appium.getCurrentPackage(function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<string>(result.value);
        }
      });
  });

  it('tests activity commands with async/await', async function (app: NightwatchAPI) {
    expectError(await app.appium.startActivity({
      appPackage: 'com.something',
    }))

    const result = await app.appium.startActivity({
      appPackage: 'com.something',
      appActivity: 'some.activity',
      appWaitActivity: 'some.other.activity',
    });
    expectType<null>(result);

    const activity = await app.appium.getCurrentActivity();
    expectType<string>(activity);

    const packageName = await app.appium.getCurrentPackage();
    expectType<string>(packageName);
  });
});

//
// geolocation
//
describe('geolocation commands', function () {
  it('tests geolocation commands', function (app: NightwatchAPI) {
    app.appium
      .getGeolocation(function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<AppiumGeolocation>(result.value);
        }
      })
      .appium.setGeolocation({ latitude: 232, longitude: 2343, altitude: 5 }, function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<AppiumGeolocation>(result.value);
        }
      });
  });

  it('tests geolocation commands with async/await', async function (app: NightwatchAPI) {
    const location = await app.appium.getGeolocation();
    expectType<AppiumGeolocation>(location);
    expectError(await app.appium.setGeolocation({ latitude: 543 }))
    expectError(await app.appium.setGeolocation())

    const result = await app.appium.setGeolocation({ latitude: 232, longitude: 2343 });
    expectType<AppiumGeolocation>(result);
  });
});

//
// keyboard interaction commands
//
describe('keyboard interaction commands', function () {
  it('tests keyboard interaction commands', function (app: NightwatchAPI) {
    app.appium
      .pressKeyCode(35, function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<null>(result.value);
        }
      })
      .appium.longPressKeyCode(31, function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<null>(result.value);
        }
      })
      .appium.hideKeyboard(function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<boolean>(result.value);
        }
      })
      .appium.isKeyboardShown(function (result) {
        expectType<NightwatchAPI>(this);
        if (result.status === 0) {
          expectType<boolean>(result.value);
        }
      });
  });

  it('tests keyboard interaction commands with async/await', async function (app: NightwatchAPI) {
    expectError(await app.appium.pressKeyCode())
    expectError(await app.appium.pressKeyCode(32, 45, () => {}))

    await app.appium.pressKeyCode(56, () => {});
    await app.appium.pressKeyCode(44, undefined, undefined, () => {});

    const result = await app.appium.pressKeyCode(34, 29474, undefined, () => {});
    expectType<null>(result);

    expectError(await app.appium.longPressKeyCode())
    expectError(await app.appium.longPressKeyCode(32, 45, () => {}))

    await app.appium.longPressKeyCode(56, () => {});
    await app.appium.longPressKeyCode(44, undefined, undefined, () => {});

    const result2 = await app.appium.longPressKeyCode(34, 29474, undefined, () => {});
    expectType<null>(result2);

    const result3 = await app.appium.hideKeyboard();
    expectType<boolean>(result3);

    const result4 = await app.appium.isKeyboardShown();
    expectType<boolean>(result4);
  });

  it('test reset app commands', async function (app: NightwatchAPI) {
    const result = await app.appium.resetApp();
    expectType<null>(result);
  });
});
