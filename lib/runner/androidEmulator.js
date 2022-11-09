const {getSdkRootFromEnv, AndroidBinaryError, requireMobileHelper} = require('../utils/mobile.js');
const mobileHelper = requireMobileHelper();

module.exports = class AndroidServer {

  constructor (AVD) {
    this.sdkRoot = getSdkRootFromEnv();
    this.avd = AVD || 'nightwatch-android-11';
    this.emulatorId = '';
    this.emulatorAlreadyRunning = false;
  }

  async killEmulator() {
    return mobileHelper.killEmulatorWithoutWait(this.sdkRoot, mobileHelper.getPlatformName(), this.emulatorId);
  }
  
  async launchEmulator() {
    try {
      const emulatorId = await mobileHelper.getAlreadyRunningAvd(this.sdkRoot, mobileHelper.getPlatformName(), this.avd);
      this.emulatorAlreadyRunning = !!emulatorId;

      this.emulatorId = emulatorId || await mobileHelper.launchAVD(this.sdkRoot, mobileHelper.getPlatformName(), this.avd);

      if (this.emulatorId === null) {
        throw new Error('Failed to launch AVD inside Android Emulator');
      }
    } catch (err) {
      throw new AndroidBinaryError(err.message, 'emulator');
    }
  }
};
