const untildify = require('untildify');
const {Logger} = require('../utils');
const path = require('path');

module.exports = class MobileServer {

  constructor (AVD) {
    this.sdkRoot = this.getSdkRootFromEnv;
    this.avd = AVD || 'nightwatch-android-11';
    this.emulatorId = '';
    this.emulatorAlreadyRunning = false;
  }

  get platform() {
    const {getPlatformName} = require('@nightwatch/mobile-helper');
    return getPlatformName();
  }

  get getSdkRootFromEnv() {
    const androidHome = process.env.ANDROID_HOME;
  
    if (androidHome) {
      return process.env.ANDROID_HOME = path.resolve(untildify(androidHome));
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

  async killEmulator() {
    const {killEmulatorWithoutWait} = require('@nightwatch/mobile-helper');

    return killEmulatorWithoutWait(this.sdkRoot, this.platform, this.emulatorId);
  }
  
  async launchEmulator() {
    const {getAlreadyRunningAvd, launchAVD} = require('@nightwatch/mobile-helper');

    try {
      const emulatorId = await getAlreadyRunningAvd(this.sdkRoot, this.platform, this.avd);
      this.emulatorAlreadyRunning = !!emulatorId;

      this.emulatorId = emulatorId || await launchAVD(this.sdkRoot, this.platform, this.avd);

      if (this.emulatorId === null) {
        throw new Error('Failed to launch AVD inside Android Emulator');
      }
    } catch (err) {
      const {getBinaryLocation} = require('@nightwatch/mobile-helper');

      const binaryLocation = getBinaryLocation(this.sdkRoot, this.platfrom, 'emulator', true);

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
