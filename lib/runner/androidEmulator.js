const untildify = require('untildify');
const {getPlatformName, getAlreadyRunningAvd, launchAVD, killEmulatorWithoutWait, getBinaryLocation} = require('nightwatch-mobile-helper');
const {Logger} = require('../utils');
const path = require('path');

const getSdkRootFromEnv = () => {
  const androidHome = process.env.ANDROID_HOME;

  if (androidHome) {
    const androidHomeFinal = untildify(androidHome);

    const androidHomeAbsolute = path.resolve(androidHomeFinal);
    if (androidHomeFinal !== androidHomeAbsolute) {
      return androidHomeAbsolute;
    }

    return androidHomeFinal;
  }

  let err;

  if (androidHome === undefined) {
    err = new Error('ANDROID_HOME environment variable is NOT set!');
  } else {
    err = new Error(`ANDROID_HOME is set to '${androidHome}' which is NOT a valid path!`);
  }
  
  err.help = [
    `To setup Android requirements, run: ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')}`,
    `For Android help, run: ${Logger.colors.cyan('npx @nightwatch/mobile-helper android --help \n')}`
  ];

  err.stack = false;

  throw err;
};

module.exports = class MobileServer {

  constructor (AVD) {
    this.sdkRoot = getSdkRootFromEnv(),
    this.platform = getPlatformName();
    this.avd = AVD || 'nightwatch-android-11';
    this.emulatorId = '';
    this.emulatorAlreadyRunning = false;
  }

  async killEmulator() {
    return killEmulatorWithoutWait(this.sdkRoot, this.platform, this.emulatorId);
  }
  
  async launchEmulator() {
    try {
      const emulatorAlreadyRunning = await getAlreadyRunningAvd(this.sdkRoot, this.platform, this.avd);

      this.emulatorId = emulatorAlreadyRunning || await launchAVD(this.sdkRoot, this.platform, this.avd);
      this.emulatorAlreadyRunning = Boolean(emulatorAlreadyRunning);
    } catch (e) {
      const err = new Error('Failed to launch AVD inside Android Emulator');
      err.help = [
        `Run command: ${Logger.colors.cyan(getBinaryLocation(this.sdkRoot, this.platfrom, 'adb', true) + ' start-server')}`,
        `Try running ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')} \n`
      ];
      err.stack = false;
  
      throw err;
    }
  }
};
