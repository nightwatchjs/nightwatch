const {Logger, getSdkRootFromEnv} = require('../utils');
const {getPlatformName, killEmulatorWithoutWait,  getAlreadyRunningAvd, launchAVD, getBinaryLocation} = require('@nightwatch/mobile-helper');

module.exports = class MobileServer {

  constructor (AVD) {
    this.sdkRoot = getSdkRootFromEnv();
    this.avd = AVD || 'nightwatch-android-11';
    this.emulatorId = '';
    this.emulatorAlreadyRunning = false;
  }

  get platform() {
    return getPlatformName();
  }

  async killEmulator() {
    return killEmulatorWithoutWait(this.sdkRoot, this.platform, this.emulatorId);
  }
  
  async launchEmulator() {
    try {
      const emulatorId = await getAlreadyRunningAvd(this.sdkRoot, this.platform, this.avd);
      this.emulatorAlreadyRunning = !!emulatorId;

      this.emulatorId = emulatorId || await launchAVD(this.sdkRoot, this.platform, this.avd);

      if (this.emulatorId === null) {
        throw new Error('Failed to launch AVD inside Android Emulator');
      }
    } catch (err) {
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
