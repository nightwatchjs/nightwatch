module.exports = {
  src_folders: ['./test/sampletests'],
  output_folder: false,
  output: true,
  webdriver: {
    keep_alive: true
  },

  test_settings: {
    default: {
      silent: false,
      test_workers: {
        enabled: true,
        workers: 5
      },
      desiredCapabilities: {
        browserName: 'firefox'
      },
      webdriver: {
        start_process: true,
        server_path: ''
      }
    },
    selenium_server: {
      selenium: {
        start_process: false,
        host: '127.0.0.1'
      }
    },

    chrome: {
      extends: 'selenium_server',
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }
  }
};


