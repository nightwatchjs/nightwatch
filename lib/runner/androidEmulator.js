const untildify = require('untildify');
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
    const {getPlatformName, getBinaryLocation} = require('@nightwatch/mobile-helper');

    this.sdkRoot = getSdkRootFromEnv(),
    this.platform = getPlatformName();
    this.binaryLocation = getBinaryLocation;
    this.avd = AVD || 'nightwatch-android-11';
    this.emulatorId = '';
    this.emulatorAlreadyRunning = false;
  }

  async killEmulator() {
    const {killEmulatorWithoutWait} = require('@nightwatch/mobile-helper');

    return killEmulatorWithoutWait(this.sdkRoot, this.platform, this.emulatorId);
  }
  
  async launchEmulator() {
    const {getAlreadyRunningAvd, launchAVD} = require('@nightwatch/mobile-helper');

    try {
      const emulatorAlreadyRunning = await getAlreadyRunningAvd(this.sdkRoot, this.platform, this.avd);

      this.emulatorId = emulatorAlreadyRunning || await launchAVD(this.sdkRoot, this.platform, this.avd);
      this.emulatorAlreadyRunning = !!emulatorAlreadyRunning;

      if (this.emulatorId === null) {
        throw new Error('Failed to launch AVD inside Android Emulator');
      }
    } catch (err) {
      const binaryLocation = this.binaryLocation(this.sdkRoot, this.platfrom, 'emulator', true);

      if (binaryLocation === '') {
        err.help = [
          `'emulator' binary not found. Run ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')} to setup the missing requirements.`
        ];
      } else {
        err.help = [
          `Run ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')} and re-run the test.`,
          `If it still doesn't work, start the emulator by yourself by running ${Logger.colors.cyan(binaryLocation + ' @' + this.avd)} and then run the test.`
        ];
      }
      
      err.stack = false;
  
      throw err;
    }
  }
};
