const {execSync} = require('child_process');
const {Logger} = require('./logger');
const untildify = require('untildify');
const path = require('path');

/**
 * check if target is Android
 * @param {Object} desiredCapabilities 
 * @returns {Boolean}
 */
function isAndroid(desiredCapabilities){
  const options = desiredCapabilities['goog:chromeOptions'] || desiredCapabilities['moz:firefoxOptions'];

  if (options && options.androidPackage) {
    return true;
  }

  return false;
};

/**
 * check if target is Simulator
 * @param {Object} desiredCapabilities 
 * @returns {Boolean}
 */
function isSimulator(desiredCapabilities){
  const {browserName = '', platformName = ''} = desiredCapabilities;

  if (browserName.toLowerCase() === 'safari' && platformName.toLowerCase() === 'ios' && desiredCapabilities['safari:useSimulator'] === true) {
    return true;
  }

  return false;
};

/**
 * check if target is Real iOS Device
 * @param {Object} desiredCapabilities 
 * @returns {Boolean}
 */
function isRealIos(desiredCapabilities){
  const {browserName = '', platformName = ''} = desiredCapabilities;

  if (browserName.toLowerCase() === 'safari' && platformName.toLowerCase() === 'ios' && desiredCapabilities['safari:useSimulator'] !== true) {
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
  if (isSimulator(desiredCapabilities) || isRealIos(desiredCapabilities) || isAndroid(desiredCapabilities)) {
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

module.exports = {
  isMobile,
  isRealIos,
  isSimulator,
  isAndroid,
  iosRealDeviceUDID,
  killSimulator,
  getSdkRootFromEnv
};


