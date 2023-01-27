const {getSdkRootFromEnv, AndroidBinaryError, requireMobileHelper} = require('../utils/mobile.js');
const {killEmulatorWithoutWait, getAlreadyRunningAvd, launchAVD, getPlatformName} = requireMobileHelper();

module.exports = class AndroidServer {

  constructor (AVD) {
    this.sdkRoot = getSdkRootFromEnv();
    this.avd = AVD || 'nightwatch-android-11';
    this.emulatorId = '';
    this.emulatorAlreadyRunning = false;
  }

  async killEmulator() {
    return killEmulatorWithoutWait(this.sdkRoot, getPlatformName(), this.emulatorId);
  }
  
  async launchEmulator() {
    try {
      const emulatorId = await getAlreadyRunningAvd(this.sdkRoot, getPlatformName(), this.avd);
      this.emulatorAlreadyRunning = !!emulatorId;

      this.emulatorId = emulatorId || await launchAVD(this.sdkRoot, getPlatformName(), this.avd);

      if (this.emulatorId === null) {
        throw new Error('Failed to launch AVD inside Android Emulator');
      }
    } catch (err) {
      throw new AndroidBinaryError(err.message, 'emulator');
    }
  }
};
