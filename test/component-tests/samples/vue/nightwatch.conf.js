module.exports = {
  src_folders: ['tests'], // Defines where the test files are stored
  page_objects_path: ['page-objects'], // Defines path for page objects (optional)
  custom_commands_path: [], // Path for custom commands, leave empty if unused
  custom_assertions_path: '', // Path for custom assertions, leave empty if unused
  globals: {}, // Define any necessary global variables

  plugins: ['@nightwatch/vue'], // Vue plugin integration

  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'http://localhost:3001',
      persist_globals: true,
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: true,
          args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] // Headless mode for CI
        }
      },

      webdriver: {
        start_process: true,
        server_path: '', // Remove chromedriver dependency
        port: 9515
      }
    }
  }
};
