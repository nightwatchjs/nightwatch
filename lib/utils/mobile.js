const {execSync} = require('child_process');
const Logger = require('./logger');
const untildify = require('untildify');
const path = require('path');
const semver = require('semver');

/**
 * Function to require mobile-helper
 */
function requireMobileHelper() {
  try {
    return require('@nightwatch/mobile-helper');
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      err.message = `@nightwatch/mobile-helper needs to be installed as a project dependency. You can install @nightwatch/mobile-helper from NPM using:\n\n        ${Logger.colors.light_green('npm i @nightwatch/mobile-helper --save-dev')}`;
    } else if (!semver.satisfies(process.version, '>=14.0.0')) {
      err.message = 'You are using Node ' + process.version + ', but @nightwatch/mobile-helper requires Node >= v14.0.0.\nPlease upgrade your Node version.';
    }
    
    err.showTrace = false;
    err.displayed = false;

    throw err;
  }
}

/**
 * check if target is Android
 * @param {Object} desiredCapabilities 
 * @returns {Boolean}
 */
function isAndroid(desiredCapabilities = {}){
  const {platformName} = desiredCapabilities;

  if (platformName && platformName.toLowerCase() === 'android') {
    return true;
  }

  const options = desiredCapabilities['goog:chromeOptions'] || desiredCapabilities['moz:firefoxOptions'];

  if (options && options.androidPackage) {
    return true;
  }

  return false;
};

/**
 * check if target is iOS Device
 * @param {Object} desiredCapabilities 
 * @returns {Boolean}
 */
function isIos(desiredCapabilities = {}) {
  const {platformName} = desiredCapabilities;

  if (platformName && platformName.toLowerCase() === 'ios') {
    return true;
  }

  return false;
}

/**
 * check if target is Simulator
 * @param {Object} desiredCapabilities 
 * @returns {Boolean}
 */
function isSimulator(desiredCapabilities){
  if (isIos(desiredCapabilities) && desiredCapabilities['safari:useSimulator'] === true) {
    return true;
  }

  return false;
};

/**
 * check if target is Real iOS Device
 * @param {Object} desiredCapabilities 
 * @returns {Boolean}
 */
function isRealIos(desiredCapabilities) {
  if (isIos(desiredCapabilities) && desiredCapabilities['safari:useSimulator'] !== true) {
    return true;
  }

  return false;
};

/**
 * check if the target is a mobile platform
 * @param {Object} desiredCapabilities 
 * @returns {Boolean}
 */
function isMobile(desiredCapabilities){
  if (isIos(desiredCapabilities) || isAndroid(desiredCapabilities)) {
    return true;
  }

  return false;
};

/**
 * Check if Real iOS device UDID is correct
 * @param {String} udid 
 * @returns {String}
 */
function iosRealDeviceUDID(udid){
  if (udid.length > 25) {
    return udid;
  }  
  
  if (udid.length < 24) {
    throw new Error('Incorrect UDID provided for real iOS device');
  }

  return `${udid.substring(0, 8)}-${udid.substring(9, 25)}`;
};

/**
 * Function to kill iOS Simulator 
 * @param {String} udid
 */
function killSimulator(udid) {
  const cmd = `xcrun simctl shutdown ${udid}`;

  try {
    execSync(cmd, {
      stdio: 'pipe'
    });
  } catch (e) {
    Logger.err(e);
  }
};

/**
 * Function to set and return the ANDROID_HOME
 * @returns {String}
 */
function getSdkRootFromEnv() {
  const androidHome = process.env.ANDROID_HOME;

  if (androidHome) {
    return process.env.ANDROID_HOME = path.resolve(untildify(androidHome));
  }

  throw new AndroidHomeError(androidHome);
};


class AndroidHomeError extends Error {
  constructor(androidHome) {
    super();

    this.message = 'ANDROID_HOME environment variable is NOT set or is NOT a valid path!';
    this.name = 'AndroidHomeError';
    this.help = [
      `To setup Android requirements, run: ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')}`,
      `For Android help, run: ${Logger.colors.cyan('npx @nightwatch/mobile-helper android --help \n')}`
    ];
    this.stack = false;
    this.androidHome = androidHome;
  }
}

class RealIosDeviceIdError extends Error {
  constructor() {
    super();

    this.name = 'RealIosDeviceIdError';
    this.message = 'Real Device ID is neither configured nor passed';
    this.help = [
      `Pass ${Logger.colors.green('deviceId')} in the command (for e.g : ${Logger.colors.cyan('--deviceId 00008030-00024C2C3453402E')})`,
      `Or pass ${Logger.colors.green('safari:deviceUDID')} capability in config`,
      `To verify the deviceId run, ${Logger.colors.cyan('system_profiler SPUSBDataType | sed -n \'/iPhone/,/Serial/p\' | grep \'Serial Number:\' | awk -F \': \' \'{print $2}')}`,
      `For more help, run: ${Logger.colors.cyan('npx run @nightwatch/mobile-helper ios')}\n`
    ];
    this.stack = false;
  }
}

function getBinaryLocation(binaryName) {
  const {getBinaryLocation, getPlatformName} = requireMobileHelper();

  return getBinaryLocation(getSdkRootFromEnv(), getPlatformName(), binaryName, true);
}

class AndroidBinaryError extends Error {
  constructor(message, binaryName) {
    super();

    this.message = message;
    this.stack = false;
    this.binaryName = binaryName;
  }

  get help() {
    let help;
    const binaryLocation = getBinaryLocation(this.binaryName);

    if (binaryLocation === '') {
      help = [
        `${Logger.colors.cyan(this.binaryName)} binary not found. Run command ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')} to setup the missing requirements.`
      ];
    } else if (this.binaryName === 'emulator') {
      help = [
        `Run ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')} and re-run the test.`,
        `If it still doesn't work, start the emulator by yourself by running ${Logger.colors.cyan(binaryLocation + ' @' + this.avd)} and then run the test.`
      ];
    } else {
      help = [
        `Run ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')} and re-run the test.`
      ];
    }

    return help;
  }
}

class AndroidConnectionError extends Error {
  constructor({message, detailedErr, extraDetail}) {
    super();

    this.message = message;
    this.extraHelp = [detailedErr, extraDetail + '\n'];
    this.stack = false;
  }

  get help() {
    let binaryLocation = getBinaryLocation('adb');
    let help;

    if (binaryLocation === '') {
      help = [
        `${Logger.colors.cyan('adb')} binary not found. Run command ${Logger.colors.cyan('npx @nightwatch/mobile-helper android')} to setup the missing requirements.`
      ];
    } else { 
      if (binaryLocation === 'PATH') {
        binaryLocation = 'adb';
      }

      if (this.message.includes('Failed to run adb command')) {
        help = [
          `Run command: ${Logger.colors.cyan(binaryLocation + ' start-server')}`,
          `If still doesn't work, run "${Logger.colors.green('npx @nightwatch/mobile-helper android')}"`
        ];
      }

      if (this.message.includes('no devices online')) {
        help = [
          `If testing on real-device, check if device is connected with USB debugging turned on and ${Logger.colors.cyan(binaryLocation + ' devices')} should list the connected device.`,
          `If testing on emulator, check the Nightwatch configuration to make sure ${Logger.colors.cyan('real_mobile')} is set to ${Logger.colors.cyan('false')} and ${Logger.colors.cyan('avd')} to the name of AVD to launch and test on.`
        ];
      }
    }

    return [...help, ...this.extraHelp];
  }
}


class IosSessionNotCreatedError extends Error {
  constructor({message, name}, desiredCapabilities) {
    super();

    this.message = message;
    this.name = name;
    this.stack = false;
    this.desiredCapabilities = desiredCapabilities;
  }

  get help() {
    let help;

    if (this.message.includes('session timed out')) {
      // 'The session timed out while connecting to a Safari instance.'
      help = [
        'Re-run the test command',
        `If it doesn't work, try running: ${Logger.colors.cyan('npx run @nightwatch/mobile-helper ios')}`
      ];
    } else if (this.message.includes('not find any session hosts') || this.message.includes('Some devices were found')) {
      // Could not find any session hosts that match the requested capabilities
      // or some devices were found, but could not be used
      if (isSimulator(this.desiredCapabilities)) {
        help = [
          `Run command to get device list: ${Logger.colors.cyan('xcrun simctl list devices')}`,
          `Update the ${Logger.colors.cyan('safari:platformVersion')} and/or ${Logger.colors.cyan('safari:platforName')} in Nightwatch configuration accordingly`,
          `If it doesn't work, try running: ${Logger.colors.cyan('npx run @nightwatch/mobile-helper ios')}`
        ];
      } else {
        help= [
          `Make sure you have passed correct ${Logger.colors.green('deviceId')} in the command (for e.g : ${Logger.colors.cyan('--deviceId 00008030-00024C2C3453402E')})`,
          `Or pass ${Logger.colors.green('safari:deviceUDID')} capability in config`,
          `To verify the deviceId run, ${Logger.colors.cyan('system_profiler SPUSBDataType | sed -n \'/iPhone/,/Serial/p\' | grep \'Serial Number:\' | awk -F \': \' \'{print $2}')}`,
          `For more help, run: ${Logger.colors.cyan('npx run @nightwatch/mobile-helper ios')}\n`
        ];
      }
    }

    return help;
  }
}


module.exports = {
  isMobile,
  isIos,
  isRealIos,
  isSimulator,
  isAndroid,
  iosRealDeviceUDID,
  killSimulator,
  getSdkRootFromEnv,

  RealIosDeviceIdError,
  AndroidConnectionError,
  IosSessionNotCreatedError,
  AndroidBinaryError,
  AndroidHomeError,
  requireMobileHelper
};
