module.exports = {
  // Location(s) where custom commands will be loaded from.
  custom_commands_path: null,

  // Location(s) where custom assertions will be loaded from.
  custom_assertions_path: null,

  // Location(s) where page object files will be loaded from.
  page_objects_path: null,

  // Location of an external globals module which will be loaded and made available to the test as a
  //  property globals on the main client instance.
  globals_path: null,

  // An object which will be made available on the main test api, throughout the test execution
  globals: {
    // this controls whether to abort the test execution when an assertion failed and skip the rest
    // it's being used in waitFor commands and expect assertions
    abortOnAssertionFailure: true,

    // this will overwrite the default polling interval (currently 500ms) for waitFor commands
    // and expect assertions that use retry
    waitForConditionPollInterval: 500,

    // default timeout value in milliseconds for waitFor commands and implicit waitFor value for
    // expect assertions
    waitForConditionTimeout: 5000,

    // this will cause waitFor commands on elements to throw an error if multiple
    // elements are found using the given locate strategy and selector
    throwOnMultipleElementsReturned: false,

    // By default a warning is printed if multiple elements are found using the given locate strategy
    // and selector; set this to true to suppress those warnings
    suppressWarningsOnMultipleElementsReturned: false,

    // controls the timeout value for async hooks. Expects the done() callback to be invoked within this time
    // or an error is thrown
    asyncHookTimeout : 10000,

    // controls the timeout value for when running async unit tests. Expects the done() callback to be invoked within this time
    // or an error is thrown
    unitTestsTimeout : 2000,

    // controls the timeout value for when executing the global async reporter. Expects the done() callback to be invoked within this time
    // or an error is thrown
    customReporterCallbackTimeout: 20000,

    // Automatically retrying failed assertions - You can tell Nightwatch to automatically retry failed assertions until a given timeout is reached, before the test runner gives up and fails the test.
    retryAssertionTimeout: 5000,

    reporter: function(results, cb) {cb(results);}
  },

  // configuration settings for the dotenv module - a zero-dependency module that loads environment variables from a .env file into process.env. More details on https://www.npmjs.com/package/dotenv
  dotenv: {},

  // persist the same globals object between runs or have a (deep) copy of it per each test;
  // this can be useful when persisting data between test suites is needed, such as a cookie or session information
  persist_globals: false,

  // The location where the JUnit XML report files will be saved. Set this to false if you want to disable XML reporting
  output_folder: 'tests_output',

  // A string or array of folders (excluding subfolders) where the tests are located.
  src_folders: null,

  // Used when running in parallel to determine if the output should be collected and displayed at the end.
  live_output: false,

  // Used to disable colored output in the terminal.
  disable_colors: false,

  // Used when running in parallel to specify the delay (in milliseconds) between starting the child processes
  parallel_process_delay: 10,

  // An object containing Selenium Server related configuration options
  selenium: {
    start_process: false,
    cli_args: {},
    server_path: null,
    log_path: '',
    port: undefined,
    check_process_delay: 500,
    max_status_poll_tries: 15,
    status_poll_interval: 200,
  },

  // Whether or not to automatically start the Selenium/WebDriver session. If running unit tests, this should be set tot false.
  start_session: true,

  // End the session automatically when the test is being terminated, usually after a failed assertion.
  end_session_on_fail: true,

  // Skip the remaining test cases from the current test suite, when one test case fails.
  skip_testcases_on_fail: undefined,

  // Whether or not to run individual test files in parallel.
  test_workers: false,

  // Specifies which test runner to use: default|mocha
  test_runner: 'default',

  // Defines options used to connect to the WebDriver/Selenium server
  webdriver : {
    start_process: false,
    cli_args: {},
    server_path: null,
    log_path: '',
    use_legacy_jsonwire: undefined,

    // Time to wait (in ms) before starting to check the Webdriver server is up and running
    check_process_delay: 100,

    // Maximum number of ping status check attempts before returning a timeout error
    max_status_poll_tries: 10,

    // Interval (in ms) to use between status ping checks when checking if the Webdriver server is up and running
    status_poll_interval: 200,

    // The entire time (in ms) to wait for the Node.js process to be created and running (default is 2 min), including spawning the child process and checking the status
    process_create_timeout: 120000,
    host: undefined,
    port: undefined,
    ssl: undefined,
    proxy: undefined,
    timeout_options: {
      timeout: undefined,
      retry_attempts: undefined
    },
    default_path_prefix: undefined,
    username: undefined,
    access_key: undefined
  },

  test_settings: {
  },

  // A url which can be used later in the tests as the main url to load.
  launch_url: '',

  // set to false if you want to show the extended http traffic command logs from the WebDriver server.
  silent: true,

  // Used to disable terminal output completely.
  output: true,

  // Set this to false if you'd like to only see the test case name displayed and pass/fail status.
  detailed_output: true,

  // Set this to true if you'd like to see timestamps next to the logging output
  output_timestamp: false,

  // Set this to true if you'd like to not display errors during the execution of the test (they are shown at the end always).
  disable_error_log: false,

  // Take error and failure screenshots during test execution
  screenshots: false,

  // Used to enable showing the Base64 image data in the (verbose) log when taking screenshots.
  log_screenshot_data: false,

  desiredCapabilities: {
    browserName: 'firefox'
  },

  // An array of folders or file patterns to be skipped (relative to the main source folder).
  exclude: null,

  // Folder or file pattern to be used when loading the tests. Files that don't match this pattern will be ignored.
  filter: null,

  // Skip a group of tests (a subfolder); can be a list of comma-separated values (no space)
  skipgroup: '',

  sync_test_names: true,

  // Skip tests by tag name; can be a list of comma-separated values (no space)
  skiptags: '',

  // Use xpath as the default locator strategy
  use_xpath: false,

  parallel_mode: false,

  report_prefix: '',

  unit_tests_mode: false,

  default_reporter: 'junit'
};
