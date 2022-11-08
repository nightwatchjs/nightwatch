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
 * 
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

module.exports = {
  isMobile,
  isRealIos,
  isSimulator,
  isAndroid,
  iosRealDeviceUDID
};


