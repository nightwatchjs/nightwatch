/**
 * @method addDetailedError
 * @param {Error} err
 */
module.exports = function(err) {
  let detailedErr;

  if (err instanceof TypeError) {
    if (/\.page\..+ is not a function$/.test(err.message)) {
      detailedErr = '- verify if page objects are setup correctly, check "page_objects_path" in your config';
    } else if (/\w is not a function$/.test(err.message)) {
      detailedErr = '- writing an ES6 async test case? - keep in mind that commands return a Promise; \n - writing unit tests? - make sure to specify "unit_tests_mode=true" in your config.';
    }
  }

  if (detailedErr) {
    err.detailedErr = detailedErr;
  }
};