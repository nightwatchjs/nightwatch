module.exports = {
  src_folders: [],
  page_objects_path: [],
  custom_commands_path: [],
  custom_assertions_path: '',
  globals: {},
  plugins: ['@nightwatch/vue'],
  webdriver: {},
  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'http://localhost:3001',
      persist_globals: true,
      desiredCapabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          w3c: true,
          args: [

          ]
        }
      },

      webdriver: {
        start_process: true,
        server_path: require('chromedriver').path,
        cli_args: [
        ]
      }
    }
  }
};