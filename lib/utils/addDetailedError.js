/**
 * @method addDetailedError
 * @param {Error} err
 */
module.exports = function(err) {
  let detailedErr;

  if (err instanceof TypeError) {
    if (err.detailedErr && /browser\..+ is not a function$/.test(err.detailedErr)) {
      detailedErr = ' ' + err.detailedErr + '\n\n  Nightwatch client is not yet available; this often happens when you are attempting to reference the "browser" ' +
        'object globally too soon, either in your test or other Nightwatch related files';
    } else if (/\.page\..+ is not a function$/.test(err.message)) {
      detailedErr = '- verify if page objects are setup correctly, check "page_objects_path" in your config';
    } else if (/\w is not a function$/.test(err.message)) {
      detailedErr = '- writing an ES6 async test case? - keep in mind that commands return a Promise; \n - writing unit tests? - make sure to specify "unit_tests_mode=true" in your config.';
    }
  } else if (err instanceof SyntaxError) {
    const stackParts = err.stack.split('SyntaxError:');
    detailedErr = stackParts[0];

    if (stackParts[1]) {
      if (detailedErr) {
        err.stack = '';
      }
      detailedErr = stackParts[1].split('\n')[0] + ':\n\n  ' + detailedErr;
    }
  }

  if (detailedErr) {
    err.detailedErr = detailedErr;
  }
};