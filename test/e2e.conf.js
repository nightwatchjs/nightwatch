module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: [],
  
  // See https://nightwatchjs.org/guide/working-with-page-objects/using-page-objects.html
  page_objects_path: ['examples/pages/'],
  
  // See https://nightwatchjs.org/guide/extending-nightwatch/custom-commands.html
  custom_commands_path: ['examples/custom-commands/'],
  
  // See https://nightwatchjs.org/guide/extending-nightwatch/custom-assertions.html
  custom_assertions_path: '',
  
  // See https://nightwatchjs.org/guide/extending-nightwatch/plugin-api.html
  plugins: [],
    
  // See https://nightwatchjs.org/guide/#external-globals
  globals_path: '',
  
  webdriver: {},
  
  test_workers: {
    enabled: true,
    workers: 'auto'
  },
  
  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'https://nightwatchjs.org',
  
      screenshots: {
        enabled: false,
        path: 'screens',
        on_failure: true
      },
  
      desiredCapabilities: {
        browserName: 'firefox'
      },
  
      webdriver: {
        start_process: true,
        server_path: ''
      }
    },
  
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: [
              // '-headless',
              // '-verbose'
            ]
          }
        }
      },
      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: [
          // very verbose geckodriver logs
          // '-vv'
        ]
      }
    },
  
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          // More info on Chromedriver: https://sites.google.com/a/chromium.org/chromedriver/
          //
          // w3c:false tells Chromedriver to run using the legacy JSONWire protocol (not required in Chrome 78)
          w3c: false,
          args: [
            //'--no-sandbox',
            //'--ignore-certificate-errors',
            //'--allow-insecure-localhost',
            //'--headless'
          ]
        }
      },
  
      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: [
          // --verbose
        ]
      }
    }
  }
};
  