import {NightwatchDesiredCapabilities} from './desired-capabilities';
import {NightwatchGlobals} from './globals';

export interface NightwatchTestRunner {
  type?: string;
  options?: {
    ui?: string;
    feature_path?: string;
    auto_start_session?: boolean;
    parallel?: number;
    reporter?: string;
    reporterOptions?: { [key: string]: any };
  };
}

export interface NightwatchTestWorker {
  enabled: boolean;
  workers?: 'auto' | number;
  node_options?: string | string[];
}

export interface NightwatchScreenshotOptions {
	enabled: boolean;
	filename_format?: (failureData: {
		testSuite: string;
		testCase: string;
		isError: boolean;
		dateObject: Date;
	}) => string;
	on_failure?: boolean;
	on_error?: boolean;
	path?: string;
}

export interface NightwatchTestSettingGeneric {
	/**
	 * A url which can be used later in the tests as the main url to load.
	 *
	 * Can be set to different values in different test environments.
	 *
	 * @alias `baseUrl`, `base_url`, `launchUrl`, `launch_url` in order of precedence.
	 */
	baseUrl?: string;

	/**
	 * A url which can be used later in the tests as the main url to load.
	 *
	 * Can be set to different values in different test environments.
	 *
	 * @alias `baseUrl`, `base_url`, `launchUrl`, `launch_url` in order of precedence.
	 */
	base_url?: string;

	/**
	 * A url which can be used later in the tests as the main url to load.
	 *
	 * Can be set to different values in different test environments.
	 *
	 * @alias `baseUrl`, `base_url`, `launchUrl`, `launch_url` in order of precedence.
	 */
	launchUrl?: string;

	/**
	 * A url which can be used later in the tests as the main url to load.
	 *
	 * Can be set to different values in different test environments.
	 *
	 * @alias `baseUrl`, `base_url`, `launchUrl`, `launch_url` in order of precedence.
	 */
	launch_url?: string;

	/**
	 * The hostname/IP on which the selenium server is accepting connections.
	 *
	 * @deprecated In favour of `selenium.host`.
	 */
	selenium_host?: string;

	/**
	 * The port number on which the selenium server is accepting connections.
	 *
	 * @deprecated In favour of `selenium.port`.
	 */
	selenium_port?: number;

	/**
	 * An array of folders (excluding subfolders) where the tests are located.
	 */
	src_folders?: string | string[] | null;

	/**
	 * An object which will be passed to the Selenium WebDriver when a new session will be created. You can specify browser name for instance along with other capabilities.
	 * Example:
	 *  "desiredCapabilities" : {
	 *  "browserName" : "firefox",
	 *  "acceptSslCerts" : true
	 * }
	 * You can view the complete list of capabilities https://code.google.com/p/selenium/wiki/DesiredCapabilities.
	 */
	desiredCapabilities?: NightwatchDesiredCapabilities;

	/**
	 * An object containing Selenium Server related configuration options. If Selenium Server is not used, webdriver options should be set instead.
	 *
	 * Starting with Nightwatch 1.0, Selenium is only required when testing against a Grid setup or a cloud testing service (such as SauceLabs or BrowserStack).
	 */
	selenium?: NightwatchSeleniumOptions;

	/**
	 * An object containing WebDriver related configuration options.
	 */
	webdriver?: WebdriverOptions;

	/**
	 * Specifies which test runner to use when running the tests. Set to 'default' to use built-in nightwatch runner.
	 *
	 * @example
	 * "test_runner": {"type": "mocha", "options": {"ui": "tdd"}}
	 *
	 * @default 'default'
	 */
	test_runner?: string | NightwatchTestRunner;

	/**
	 * Whether or not to run individual test files in parallel.
	 *
	 * If set to `true`, runs the tests in parallel and determines the number of workers automatically.
	 *
	 * If set to an object, can specify specify the number of workers as "auto" or a number.
	 *
	 * @example
	 * "test_workers": {"enabled": true, "workers": "auto"}
	 *
	 * @default false
	 */
	test_workers?: boolean | NightwatchTestWorker;

	/**
	 * Specifies which implementation to use for concurrency, child-process or worker-threads.
	 */
	use_child_process?: boolean;

	/**
	 * Used when running in parallel to specify the delay (in milliseconds) between starting the child processes.
	 * @default 10
	 */
	parallel_process_delay?: number;

	/**
	 * Enable aborting the test run execution when the first test failure occurs; the remaining test suites will be skipped.
	 * @default false
	 */
	enable_fail_fast?: boolean;

	/**
	 * An object which will be made available within the test and can be overwritten per environment.
	 *
	 * @example
	 * "globals": {"myGlobal": "some_global"}
	 */
	globals?: NightwatchGlobals;

	/**
	 * Set this to `true` if you'd like to persist the same globals object between testsuite runs or have a (deep) copy of it per each testsuite.
	 *
	 * This can be useful when persisting data between test suites is needed, such as a cookie or session information.
	 * @default false
	 */
	persist_globals?: boolean;

	/**
	 * Whether or not to automatically start the Selenium/WebDriver session. If running unit tests, this should be set to false.
	 * @default true
	 */
	start_session?: boolean;

	/**
	 * End the session automatically when the test is being terminated, usually after a failed assertion.
	 * @default true
	 */
	end_session_on_fail?: boolean;

	/**
	 * Skip the remaining test cases from the current test suite, when one test case fails.
	 * @default true
	 */
	skip_testcases_on_fail?: boolean;

	/**
	 * Use xpath as the default locator strategy.
	 * @default false
	 */
	use_xpath?: boolean;

	/**
	 * Should be set to true if connecting to a remote (cloud) service via HTTPS. Also don't forget to set port to 443.
	 * @deprecated In favour of `selenium.ssl`.
	 * @default false
	 */
	use_ssl?: boolean;

	/**
	 * A name property will be added to the `desiredCapabilities` containing the test suite name when this is enabled. It is useful when using cloud testing services.
	 */
	sync_test_names?: boolean;

	/**
	 * Selenium generates screenshots when command errors occur.
	 *
	 * With on_failure set to true, also generates screenshots for failing or erroring tests. These are saved on the disk.
	 *
	 * Since v0.7.5 you can disable screenshots for command errors by setting "on_error" to false.
	 *
	 * @example
	 * "screenshots": {
	 *      "enabled": true,
	 *      "on_failure": true,
	 *      "on_error": false,
	 *      "path": ""
	 * }
	 */
	screenshots?: NightwatchScreenshotOptions;

	/**
	 * Controls whether to run tests in unit testing mode, which means the session will not automatically be created.=
	 */
	unit_testing_mode?: boolean;

	/**
	 * Controls whether to run tests in unit testing mode, which means the session will not automatically be created.
	 * @deprecated In favour of `unit_testing_mode`.
	 */
	unit_tests_mode?: boolean;

	/**
	 * An array of folders or file patterns to be skipped (relative to the main source folder).
	 *
	 * @example
	 * "exclude" : ["excluded-folder"]
	 * or:
	 * "exclude" : ["test-folder/*-smoke.js"]
	 */
	exclude?: string[] | null;

	/**
	 * Folder or file pattern to be used when loading the tests. Files that don't match this pattern will be ignored.
	 *
	 * @example
	 * "filter": "tests/*-smoke.js"
	 */
	filter?: string | null;

	/**
	 * Skip a group of tests (a subfolder); can be a list of comma-separated values (no space).
	 */
	skipgroup?: string;

	/**
	 * Skip tests by tag name; can be a list of comma-separated values (no space).
	 */
	skiptags?: string;

	/**
	 * Tag(s) used/to be used during test execution.
	 * Can be a single tag or an array of tags.
	 */
	tag_filter?: string | string[];

	/**
	 * Whether to show the extended HTTP traffic command logs from the WebDriver or Selenium server.
	 *
	 * @default true (do not show the extended command logs)
	 */
	silent?: boolean;

	/**
	 * Used to disable terminal output completely.
	 *
	 * @default true
	 */
	output?: boolean;

	/**
	 * By default detailed assertion output is displayed while the test is running.
	 *
	 * Set this to false if you'd like to only see the test case name displayed and pass/fail status.
	 *
	 * Detailed output is disabled by default when running tests in parallel.
	 */
	detailed_output?: boolean;

	/**
	 * Set this to true if you'd like to see timestamps next to the logging output.
	 */
	output_timestamp?: boolean;

	/**
	 * The location where the JUnit XML and HTML report files will be saved. Set this to false if you want to disable XML/HTML reporting.
	 *
	 * @default 'tests_output'
	 */
	output_folder?: string;

	/**
	 * Settings for generated reports.
	 */
	reporter_options?: {
		/**
		 * The location where the JUnit XML and HTML report files will be saved. Set this to false if you want to disable XML/HTML reporting.
		 *
		 * @default 'tests_output'
		 */
		output_folder?: string,

		/**
		 * The name of the parent folder to save the HTML report in.
		 * 
		 * This can be used to retain the HTML reports for all the test runs, by making the `folder_format` dynamic.
		 * 
		 * @example
		 * folder_format: () => Date.now().toString()
		 */
		folder_format?: string | (() => string) | null,

		/**
		 * File name to use while saving the HTML report.
		 *
		 * Can be made dynamic by passing a function. Ex. `filename_format: () => Date.now().toString()`
		 *
		 * @default `index.html`
		 */
		filename_format?: string | (() => string) | null,

		/**
		 * The location where the minimal JSON report should be saved.
		 * This report is used by Nightwatch for its re-run functionality (re-running failed tests from previous run).
		 *
		 * @default 'tests_output/minimal_report.json'
		 */
		minimal_report_file_path?: string;
	},

	/**
	 * Use to disable colored output in the terminal.
	 */
	disable_colors?: boolean;

	/**
	 * Set this to true if you'd like to disable bounding boxes on terminal output. Useful when running in some CI environments.
	 */
	disable_output_boxes?: boolean,

	/**
	 * Used when running tests in parallel to determine if the output should be collected and displayed at the end.
	 *
	 * @default false
	 */
	live_output?: boolean;

	/**
	 * Set this to 'iso' if you'd like to see timestamps as ISO strings.
	 */
	timestamp_format?: string,

	/**
	 * Set this to true if you'd like to not display errors during the execution of the test (they are shown at the end always).
	 *
	 * @default false
	 */
	disable_error_log?: boolean;

	/**
	 * Whether or not to show the Base64 image data in the (verbose) log when taking screenshots.
	 *
	 * @default false
	 */
	log_screenshot_data?: boolean;

	/**
	 * Sets the initial window size: {height: number, width: number}
	 */
	window_size?: {
		height: number;
		width: number;
	};
}

export interface NightwatchOptions extends NightwatchTestSettingGeneric {
	/**
	 * Location(s) where custom commands will be loaded from.
	 */
	custom_commands_path?: string | string[] | null;

	/**
	 * Location(s) where custom assertions will be loaded from.
	 */
	custom_assertions_path?: string | string[] | null;

	/**
	 * Location(s) where page object files will be loaded from.
	 */
	page_objects_path?: string | string[] | null;

	/**
	 * An array specifying a list of Nightwatch plugin names that should be used.
	 *
	 * @example
	 * plugins: ['@nightwatch/react']
	 */
	plugins?: string[];

	/**
	 * Location of the tsconfig file to be used by Nightwatch for running tests written in TS.
	 * @default 'nightwatch/tsconfig.json'
	 */
	tsconfig_path?: string;

	/**
	 * Location of an external globals module which will be loaded and made available to the test as a property globals on the main client instance.
	 * Globals can also be defined/overwritten inside a test_settings environment.
	 */
	globals_path?: string | null;

	/**
	 * configuration settings for the dotenv module - a zero-dependency module that loads environment variables from a .env file into process.env. More details on https://www.npmjs.com/package/dotenv
	 */
	dotenv?: any;

	/**
	 * Disable support for loading of typescript test files for backwards compatibility with test suites.
	 */
	disable_typescript?: boolean;

	/**
	 * This object contains all the test related options. See below for details.
	 */
	test_settings: NightwatchTestSettings;

	parallel_mode?: boolean;

	report_prefix?: string;

	/**
	 * @default junit
	 */
	default_reporter?: string | string[];

	/**
	 * Set this to true to use the v1.x response format for commands in v2.x when using ES6 async/await.
	 * Can also be used to retain the older functionality of `browser.element()` in v3.x.
	 * 
	 * @default false
	 */
	backwards_compatibility_mode?: boolean;

	/**
	 * Set this to true to disable the global objects such as element(), browser, by(), expect()
	 */
	disable_global_apis?: boolean;

	/**
	 * Disable the globally available expect() api.
	 */
	disable_global_expect?: boolean;

	/**
	 * Whether or not to report API command errors that don't deal with DOM elements (e.g. cookie).
	 * @default false
	 */
	report_command_errors?: boolean,

	/**
	 * Whether or not to report network errors (e.g. ECONNRESET errors)
	 * @default true
	 */
	report_network_errors?: boolean;

	/**
	 * Interactive element commands such as "click" or "setValue" can be retried
	 * if an error occurred (such as an "element not interactable" error)
	 */
	element_command_retries?: number;

	/**
	 * Settings related to tracing [DOM History](https://nightwatchjs.org/guide/reporters/dom-history.html#enable-dom-history).
	 */
	trace?: {
		enabled: boolean;
		path?: string;
		filename_format?: (failureData: {
			testSuite: string;
			testCase: string;
			isError: boolean;
			dateObject: Date;
		}) => string;
	}

	/**
	 * Whether or not to consider all commands as being running in async mode.
	 *
	 * Setting this to true will result in all commands returning a promise, even when they are used in non-async tests.
	 */
	always_async_commands?: boolean;

	/**
	 * Settings for anonymous usage metrics collection.
	 */
	usage_analytics?: {
		enabled: boolean;
		/**
		 * @default './logs/analytics'
		 */
		log_path?: string;
		client_id?: string;
	}
}

export interface TimeoutOptions {
	/**
	 * @default 90000
	 */
	timeout: number;

	/**
	 * @default 2
	 */
	retry_attempts: number;
}  

export interface WebdriverOptions {
	/**
	 * When this is enabled, the Webdriver server is run in background in a child process and started/stopped automatically.
	 *
	 * Nightwatch includes support for managing Chromedriver, Geckodriver (Firefox), Safaridriver, and Selenium Server.
	 *
	 * @default false
	 */
	start_process?: boolean;

	/**
	 * Absolute path to the webdriver binary. Only useful if start_process is enabled.
	 * @default none
	 */
	server_path?: string | null;

	/**
	 * Only needed when the Webdriver service is running on a different machine.
	 */
	host?: string;

	/**
	 * The port number on which the Webdriver service will listen and/or on which Nightwatch will attempt to connect.
	 */
	port?: number;

	/**
	 * Should be set to true if connecting to a remote (cloud) service via HTTPS. Also don't forget to set port to 443.
	 */
	ssl?: boolean;

	/**
	 * The location where the Webdriver service log file output.log file will be placed. Defaults to current directory.
	 *
	 * To disable Webdriver logging, set this to false.
	 * @default none
	 */
	log_path?: string | boolean;

	/**
	 * File name to use when writing the webdriver server logs.
	 *
	 * By default, the log file name will be the same as the testsuite file name.
	 */
	log_file_name?: string;

	/**
	 * List of cli arguments to be passed to the Webdriver process. This varies for each Webdriver implementation.
	 *
	 * @default none
	 */
	cli_args?: string[] | {};

	/**
	 * Some Webdriver implementations (Safari, Edge) support both the W3C Webdriver API as well as the legacy JSON Wire (Selenium) API.
	 *
	 * @default false
	 */
	use_legacy_jsonwire?: boolean;

	/**
	 * Time to wait (in ms) before starting to check the Webdriver server is up and running.
	 *
	 * @default 100
	 */
	check_process_delay?: number;

	/**
	 * Enable HTTP Keep-Alive.
	 *
	 * If set to true, the keepAlive option is enabled with default settings (`keepAliveMsecs` = 3000).
	 *
	 * If set to an object, you can specify specify the `keepAliveMsecs` value.
	 *
	 * @example
	 * "keep_alive": {"enabled": true, "keepAliveMsecs": 2000}
	 */
	keep_alive?: boolean | {
		enabled: boolean,
		keepAliveMsecs: number
	};

	/**
	 * Requests to the Webdriver service will timeout in `timeout` milliseconds; a retry will happen `retry_attempts` number of times.
	 *
	 * @example {timeout: 15000, retry_attempts: 5}
	 */
	timeout_options?: TimeoutOptions;

	/**
	 * Interval (in ms) to use between status ping checks when checking if the Webdriver server is up and running.
	 *
	 * @default 100
	 */
	status_poll_interval?: number;

	/**
	 * Maximum number of ping status check attempts when checking if the Webdriver server is up and running before returning a timeout error.
	 *
	 * @default 5
	 */
	max_status_poll_tries?: number;

	/**
	 * The entire time (in ms) to wait for the Node.js process to be created and running (default is 2 min), including spawning the child process and checking the status.
	 *
	 * @default 120000
	 */
	process_create_timeout?: number;

	/**
	 * Interval (in ms) to wait for before sending another request to the WebDriver server in case of an Internal Server Error (5xx).
	 *
	 * Number of times the retry attempts are made depend on `timeout_options.retryAttempts` webdriver setting.
	 */
	internal_server_error_retry_interval?: number;

	/**
	 * Usually only needed for cloud testing Selenium services. In case the server requires credentials this username will be used to compute the `Authorization` header.
	 *
	 * The value can be also an environment variable, in which case it will look like this:
	 * `"username": "${SAUCE_USERNAME}"`
	 *
	 * @default none
	 */
	username?: string;

	/**
	 * This field will be used together with `username` to compute the `Authorization` header.
	 *
	 * Like `username`, the value can be also an environment variable:
	 * `"access_key": "${SAUCE_ACCESS_KEY}"`
	 *
	 * @default none
	 */
	access_key?: string;

	/**
	 * Proxy requests to the Webdriver (or Selenium) service. http, https, socks(v5), socks5, sock4, and pac are accepted. Uses node-proxy-agent.
	 *
	 * @example http://user:pass@host:port
	 * @default none
	 */
	proxy?: string;

	/**
	 * Needed sometimes when using a Selenium Server. The prefix to be added to to all requests (e.g. `/wd/hub`).
	 */
	default_path_prefix?: string;

	/**
	 * Sets the path to the Chrome binary to use.
	 * On Mac OS X, this path should reference the actual Chrome executable,
	 * not just the application binary (e.g. "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").
	 */
	chrome_binary?: string;

	/**
	 * Sets the path to Chrome's log file. This path should exist on the machine that will launch Chrome.
	 */
	chrome_log_file?: string;

	/**
	 * Configures the ChromeDriver to launch Chrome on Android via adb.
	 */
	android_chrome?: false;

	/**
	 * Sets the path to the Edge binary to use. This path should exist on the machine that will launch Edge.
	 */
	edge_binary?: '';

	/**
	 * Sets the path to the Edge binary to use.
	 */
	edge_log_file?: '';

	/**
	 * Sets the binary to use. The binary may be specified as the path to a Firefox executable or a desired release Channel. This path should exist on the machine that will launch Firefox.
	 */
	firefox_binary?: '';

	/**
	 * Sets the path to an existing profile to use as a template for new browser sessions.
	 * This profile will be copied for each new session - changes will not be applied to the profile itself.
	 */
	firefox_profile?: '';
}

export interface NightwatchSeleniumOptions {
	/**
	 * Whether or not to manage the selenium process automatically.
	 * @default false
	 */
	start_process?: boolean;

	/**
	 * Whether or not to automatically start the Selenium session.
	 */
	start_session?: boolean;

	/**
	 * The location of the selenium jar file. Leave empty if @nightwatch/selenium-server is installed.
	 *
	 * @example 'lib/selenium-server-standalone-2.43.0.jar'
	 */
	server_path?: string | null;

	/**
	 * Required when using Selenium 4. Set this to 'standalone'.
	 */
	command?: string;

	/**
	 * The location where the selenium Selenium `output.log` file will be placed. Defaults to current directory.
	 *
	 * To disable Selenium logging, set this to `false`.
	 */
	log_path?: string | boolean;

	/**
	 * The IP address Selenium will listen on and/or Nightwatch will attempt to connect to.
	 */
	host?: string;

	/**
	 * The port number Selenium will listen on and/or Nightwatch will attempt to connect to.
	 */
	port?: number;

	/**
	 * List of cli arguments to be passed to the Selenium process. Here you can set various options for browser drivers, such as:
	 *
	 * `webdriver.firefox.profile`: Selenium will be default create a new Firefox profile for each session.
	 * If you wish to use an existing Firefox profile you can specify its name here.
	 * Complete list of Firefox Driver arguments available https://code.google.com/p/selenium/wiki/FirefoxDriver.
	 *
	 * `webdriver.chrome.driver`: Nightwatch can run the tests using Chrome browser also. To enable this you have to download the ChromeDriver binary
	 * (http://chromedriver.storage.googleapis.com/index.html) and specify it's location here. Also don't forget to specify chrome as the browser name in the
	 * desiredCapabilities object.
	 * More information can be found on the ChromeDriver website (https://sites.google.com/a/chromium.org/chromedriver/).
	 *
	 * `webdriver.ie.driver`: Nightwatch has support for Internet Explorer also. To enable this you have to download the IE Driver binary
	 * (https://code.google.com/p/selenium/wiki/InternetExplorerDriver) and specify it's location here. Also don't forget to specify "internet explorer" as the browser
	 * name in the desiredCapabilities object.
	 */
	cli_args?: {};

	/**
	 * Set this to true when using Nightwatch to manage and/or connect to an Appium server.
	 */
	use_appium?: boolean;

	/**
	 * Time to wait (in ms) before starting to check the Selenium server is up and running
	 * @default 500
	 */
	check_process_delay?: number;

	/**
	 * Maximum number of ping status check attempts before returning a timeout error.
	 * @default 15
	 */
	max_status_poll_tries?: number;

	/**
	 * Interval (in ms) to use between status ping checks when checking if the Selenium server is up and running.
	 * @default 200
	 */
	status_poll_interval?: number;
}

export interface NightwatchTestOptions extends NightwatchTestSettingGeneric {
	/**
	 * Path where screenshots captured during test failure or error will be saved.
	 */
	screenshotsPath: string;

	/**
	 * In case the selenium server requires credentials this username will be used to compute the Authorization header.
	 */
	username?: string;

	/**
	 * This field will be used together with username to compute the Authorization header.
	 */
	accessKey?: string;
}

export interface NightwatchTestSettings {
	[key: string]: NightwatchTestSettingGeneric & {
		/**
		 * Inherit settings from another environment.
		 */
		extends?: string;
	};
}
