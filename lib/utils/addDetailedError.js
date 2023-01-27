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
    } else if (err.message.includes('.mountComponent() is already defined.')) {
      detailedErr = '  - running component tests? loading multiple plugins together is not supported.';
      err.help = [
        'check your nightwatch config file (e.g. nightwatch.conf.js) and inspect the line with "plugins": [...]',
        'make sure to load only the plugin for the intended framework (e.g. either load @nightwatch/react or @nightwatch/vue, but not both together)'
      ];

      err.link = 'https://nightwatchjs.org/guide/concepts/component-testing.html';
    } else if (err.message.includes('browser.mountComponent is not a function')) {
      detailedErr = '  - writing an ES6 async test case? - keep in mind that commands return a Promise; \n      - writing unit tests? - make sure to specify "unit_tests_mode=true" in your config.';
    } else if (/\w is not a function$/.test(err.message)) {
      detailedErr = '  - writing an ES6 async test case? - keep in mind that commands return a Promise; \n      - writing unit tests? - make sure to specify "unit_tests_mode=true" in your config.';
    }
  } else if (err instanceof SyntaxError) {
    const stackParts = err.stack.split('SyntaxError:');
    detailedErr = stackParts[0];
    let modulePath = err.stack.split('\n')[0];
    if (modulePath.includes(':')) {
      modulePath = modulePath.split(':')[0];
    }

    if (stackParts[1]) {
      if (detailedErr) {
        err.stack = '';
      }

      let header = stackParts[1].split('\n')[0];
      if (header.trim() === err.message) {
        header = '';
      } else {
        header = header + ':\n\n  ';
      }
      detailedErr = header + detailedErr;
    }

    if (modulePath.endsWith('.jsx') || modulePath.endsWith('.tsx')) {
      detailedErr = `\n   In order to be able to load JSX files, one of these plugins is needed:
   - @nightwatch/react
   - @nightwatch/storybook (only if using Storybook in your project)
      `;
    }
  }

  if (detailedErr) {
    err.detailedErr = detailedErr;
  }
};