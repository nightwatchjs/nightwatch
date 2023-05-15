import {ChromeOptions} from './chrome-options';
import {NightwatchGlobals} from './globals';
import {NightwatchTestHooks, NightwatchTestRunner, TimeoutOptions, WindowSize} from '.';

//  TODO: visit later
export interface NightwatchDesiredCapabilities {
	/**
	 * The name of the browser being used; examples: {chrome|firefox|safari|edge|internet explorer|android|iPhone|iPad|opera|brave}.
	 */
	browserName?: string | null;

	/**
	 * The browser version, or the empty string if unknown.
	 */
	version?: string | undefined;

	/**
	 * A key specifying which platform the browser should be running on. This value should be one of {WINDOWS|XP|VISTA|MAC|LINUX|UNIX|ANDROID}.
	 * When requesting a new session, the client may specify ANY to indicate any available platform may be used.
	 * For more information see [GridPlatforms (https://code.google.com/p/selenium/wiki/GridPlatforms)]
	 */
	platform?: string | undefined;

	/**
	 * Whether the session supports taking screenshots of the current page.
	 */
	takesScreenShot?: boolean | undefined;

	/**
	 * Whether the session can interact with modal popups, such as window.alert and window.confirm.
	 */
	handlesAlerts?: boolean | undefined;

	/**
	 * Whether the session supports CSS selectors when searching for elements.
	 */
	cssSelectorsEnabled?: boolean | undefined;

	/**
	 * Whether the session supports executing user supplied JavaScript in the context of the current page (only on HTMLUnitDriver).
	 */
	javascriptEnabled?: boolean | undefined;

	/**
	 * Whether the session can interact with database storage.
	 */
	databaseEnabled?: boolean | undefined;

	/**
	 * Whether the session can set and query the browser's location context.
	 */
	locationContextEnabled?: boolean | undefined;

	/**
	 * Whether the session can interact with the application cache.
	 */
	applicationCacheEnabled?: boolean | undefined;

	/**
	 * Whether the session can query for the browser's connectivity and disable it if desired.
	 */
	browserConnectionEnabled?: boolean | undefined;

	/**
	 * Whether the session supports interactions with storage objects (http://www.w3.org/TR/2009/WD-webstorage-20091029/).
	 */
	webStorageEnabled?: boolean | undefined;

	/**
	 * Whether the session should accept all SSL certs by default.
	 */
	acceptSslCerts?: boolean | undefined;

	/**
	 * Whether the session can rotate the current page's current layout between portrait and landscape orientations (only applies to mobile platforms).
	 */
	rotatable?: boolean | undefined;

	/**
	 * Whether the session is capable of generating native events when simulating user input.
	 */
	nativeEvents?: boolean | undefined;

	/**
	 * What the browser should do with an unhandled alert before throwing out the UnhandledAlertException. Possible values are "accept", "dismiss" and "ignore"
	 */
	unexpectedAlertBehaviour?: string | undefined;

	/**
	 * Allows the user to specify whether elements are scrolled into the viewport for interaction to align with the top (0) or bottom (1) of the viewport.
	 * The default value is to align with the top of the viewport. Supported in IE and Firefox (since 2.36)
	 */
	elementScrollBehaviour?: number | undefined;

	/**
	 * A JSON object describing the logging level of different components in the browser, the driver, or any intermediary WebDriver servers.
	 * Available values for most loggers are "OFF", "SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST", "ALL".
	 * This produces a JSON object looking something like: {"loggingPrefs": {"driver": "INFO", "server": "OFF", "browser": "FINE"}}.
	 */
	loggingPrefs?:
	| {
		browser?: string | undefined;
		driver?: string | undefined;
		server?: string | undefined;
	}
	| undefined;
	/**
	 * This is a list of all the Chrome-specific desired capabilities.
	 */
	chromeOptions?: ChromeOptions | undefined;
}

export interface NightwatchScreenshotOptions {
	enabled?: boolean | undefined;
	filename_format: ({
		testSuite,
		testCase,
		isError,
		dateObject
	}?: {
		testSuite?: string;
		testCase?: string;
		isError?: boolean;
		dateObject?: Date;
	}) => string;
	on_failure?: boolean | undefined;
	on_error?: boolean | undefined;
	path?: string | undefined;
}

export interface NightwatchOptions {
	/**
	 * Location(s) where custom commands will be loaded from.
	 */
	custom_commands_path?: string | string[] | undefined;

	/**
	 * Location(s) where custom assertions will be loaded from.
	 */
	custom_assertions_path?: string | string[] | undefined;

	/**
	 * Location(s) where page object files will be loaded from.
	 */
	page_objects_path?: string | string[] | undefined;

	// An array specifying a list of Nightwatch plugin names that should be used;
	// e.g.: plugins: ['vite-plugin-nightwatch']
	plugins: string[];

	/**
	 * Location of an external globals module which will be loaded and made available to the test as a property globals on the main client instance.
	 * Globals can also be defined/overwritten inside a test_settings environment.
	 */
	globals_path?: string | undefined;

	/**
	 * An object which will be made available on the main test api, throughout the test execution.
	 */
	globals?: NightwatchGlobals;

	/**
	 * configuration settings for the dotenv module - a zero-dependency module that loads environment variables from a .env file into process.env. More details on https://www.npmjs.com/package/dotenv
	 */
	dotenv?: any;

	/**
	 * persist the same globals object between runs or have a (deep) copy of it per each test;
	 * this can be useful when persisting data between test suites is needed, such as a cookie or session information.
	 * @default false
	 */
	persist_globals?: boolean | undefined;

	/**
	 * The location where the JUnit XML report files will be saved. Set this to false if you want to disable XML reporting.
	 */
	output_folder?: string | undefined;

	/**
	 * An array of folders (excluding subfolders) where the tests are located.
	 */
	src_folders: string | string[];

	/**
	 * Used when running in parallel to determine if the output should be collected and displayed at the end.
	 */
	live_output?: boolean | undefined;

	/**
	 * disable support of loading of typescript files for backwards compatibility with test suites.
	 */
	disable_typescript: boolean | undefined;

	/**
	 * Controls whether or not to disable coloring of the cli output globally.
	 */
	disable_colors?: boolean | undefined;

	/**
	 * Used when running in parallel to specify the delay (in milliseconds) between starting the child processes
	 */
	parallel_process_delay?: number | undefined;

	/**
	 * An object containing Selenium Server related configuration options. See below for details.
	 */
	selenium?: NightwatchSeleniumOptions | undefined;

	/**
	 * Whether or not to automatically start the Selenium/WebDriver session. If running unit tests, this should be set tot false.
	 * @default true
	 */
	start_process?: boolean | undefined;

	/**
	 * End the session automatically when the test is being terminated, usually after a failed assertion.
	 * @default true
	 */
	end_session_on_fail?: boolean | undefined;

	/**
	 * Skip the remaining test cases from the current test suite, when one test case fails.
	 */
	skip_testcases_on_fail?: boolean | undefined;

	/**
	 * Whether or not to run individual test files in parallel. If set to true, runs the tests in parallel and determines the number of workers automatically.
	 * If set to an object, can specify specify the number of workers as "auto" or a number. Example: "test_workers" : {"enabled" : true, "workers" : "auto"}
	 * @default false
	 */
	test_workers?: boolean | NightwatchTestWorker | undefined;

	/**
	 * This object contains all the test related options. See below for details.
	 */
	test_settings: NightwatchTestSettings;

	/**
	 * Specifies which test runner to use when running the tests. Values can be either default (built in nightwatch runner) or mocha.
	 * Example: "test_runner" : {"type" : "mocha", "options" : {"ui" : "tdd"}}
	 * @default 'default'
	 */
	test_runner?: string | NightwatchTestRunner | undefined;

	/**
	 * Allows for webdriver config (mostly the same as selenium)
	 */
	webdriver?:
	| {
		/**
		 * When this is enabled, the Webdriver server is run in background in a child process and started/stopped automatically.
		 * Nightwatch includes support for managing Chromedriver, Geckodriver (Firefox), Safaridriver, and Selenium Server. Please refer to the Install Webdriver section for details.
		 * @default false
		 */
		start_process: boolean;

		/**
		 * Only useful if start_process is enabled.
		 * @default none
		 */
		server_path: string;

		/**
		 * Only needed when the Webdriver service is running on a different machine.
		 */
		host: string;

		/**
		 * The port number on which the Webdriver service will listen and/or on which Nightwatch will attempt to connect.
		 */
		port: number;

		/**
		 * Should be set to true if connecting to a remote (cloud) service via HTTPS. Also don't forget to set port to 443.
		 */
		ssl: boolean;

		/**
		 * The location where the Webdriver service log file output.log file will be placed. Defaults to current directory.
		 * To disable Webdriver logging, set this to false.
		 * @default none
		 */
		log_path: string | boolean;

		/**
		 * List of cli arguments to be passed to the Webdriver process. This varies for each Webdriver implementation.
		 *
		 * @default none
		 */
		cli_args: any;

		/**
		 * Some Webdriver implementations (Safari, Edge) support both the W3C Webdriver API as well as the legacy JSON Wire (Selenium) API.
		 *
		 * @default false
		 */
		use_legacy_jsonwire: boolean;

		/**
		 * Time to wait (in ms) before starting to check the Webdriver server is up and running.
		 *
		 * @default 100
		 */
		check_process_delay: number;

		/**
		 * Maximum number of ping status check attempts when checking if the Webdriver server is up and running before returning a timeout error.
		 *
		 * @default 5
		 */
		max_status_poll_tries: number;

		/**
		 * Interval (in ms) to use between status ping checks when checking if the Webdriver server is up and running.
		 *
		 * @default 100
		 */
		status_poll_interval: number;

		/**
		 * The entire time (in ms) to wait for the Node.js process to be created and running (default is 2 min), including spawning the child process and checking the status.
		 *
		 * @default 120000
		 */
		process_create_timeout: number;

		/**
		 * Proxy requests to the Webdriver (or Selenium) service. http, https, socks(v5), socks5, sock4, and pac are accepted. Uses node-proxy-agent.
		 *
		 * @example http://user:pass@host:port
		 * @default none
		 */
		proxy: string;

		/**
		 * Requests to the Webdriver service will timeout in timeout miliseconds; a retry will happen retry_attempts number of times.
		 *
		 * @example {timeout: 15000, retry_attempts: 5}
		 */
		timeout_options: TimeoutOptions;

		/**
		 * Needed sometimes when using a Selenium Server. The prefix to be added to to all requests (e.g. /wd/hub).
		 */
		default_path_prefix: string;

		/**
		 * Usually only needed for cloud testing Selenium services. In case the server requires credentials this username will be used to compute the Authorization header.
		 *
		 * The value can be also an environment variable, in which case it will look like this:
		 * "username" : "${SAUCE_USERNAME}"
		 *
		 * @default none
		 */
		username: string;

		/**
		 * This field will be used together with username to compute the Authorization header.
		 *
		 * Like username, the value can be also an environment variable:
		 * "access_key" : "${SAUCE_ACCESS_KEY}"
		 *
		 * @default none
		 */
		access_key: string;

		/**
		 * Sets the path to the Chrome binary to use.
		 * On Mac OS X, this path should reference the actual Chrome executable,
		 * not just the application binary (e.g. "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").
		 */
		chrome_binary?: '';

		/**
		 * Sets the path to Chrome's log file. This path should exist on the machine that will launch Chrome.
		 */
		chrome_log_file?: '';

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
	| undefined;

	/**
	 * An array of folders or file patterns to be skipped (relative to the main source folder).
	 * @example
	 * "exclude" : ["excluded-folder"]
	 * or:
	 * "exclude" : ["test-folder/*-smoke.js"]
	 */
	exclude?: string[];

	/**
	 * Folder or file pattern to be used when loading the tests. Files that don't match this pattern will be ignored
	 * @example
	 * "filter" : "tests/*-smoke.js"
	 */
	filter?: string;

	/**
	 * Skip a group of tests (a subfolder); can be a list of comma-separated values (no space).
	 */
	skipgroup?: string;

	/**
	 * A name property will be added to the desiredCapabilities containing the test suite name when this is enabled. It is useful when using cloud testing services.
	 */
	sync_test_names?: boolean;

	/**
	 * Skip tests by tag name; can be a list of comma-separated values (no space).
	 */
	skiptags?: string;

	/**
	 * Use xpath as the default locator strategy.
	 */
	use_xpath?: boolean;

	parallel_mode?: boolean;

	report_prefix?: string;

	unit_testing_mode?: boolean;

	/**
	 * @default junit
	 */
	default_reporter?: string;

	/**
	 * Set this to true to use the v1.x response format for commands when using ES6 async/await
	 * @default false
	 */
	backwards_compatibility_mode?: boolean;

	/**
	 * Set this to true to disable the global objects such as element(), browser, by(), expect()
	 */
	disable_global_apis?: boolean;

	/**
	 * Ignore network errors (e.g. ECONNRESET errors)
	 */
	report_network_errors?: boolean;

	/**
	 * Interactive element commands such as "click" or "setValue" can be retried
	 * if an error occurred (such as an "element not interactable" error)
	 */
	element_command_retries?: number;

	/**
	 * Sets the initial window size: {height: number, width: number}
	 */
	window_size?: WindowSize;
}

export interface NightwatchSeleniumOptions {
	/**
	 * Whether or not to manage the selenium process automatically.
	 * @default false
	 */
	start_process: boolean;

	/**
	 * Whether or not to automatically start the Selenium session.
	 */
	start_session: boolean;

	/**
	 * The location of the selenium jar file. This needs to be specified if start_process is enabled.E.g.: lib/selenium-server-standalone-2.43.0.jar
	 */
	server_path: string;

	/**
	 * The location where the selenium Selenium-debug.log file will be placed. Defaults to current directory. To disable Selenium logging, set this to false
	 */
	log_path: string | boolean;

	/**
	 * Usually not required and only used if start_process is true. Specify the IP address you wish Selenium to listen on.
	 */
	host: string;

	/**
	 * The port number Selenium will listen on.
	 */
	port: number | undefined;

	/**
	 * List of cli arguments to be passed to the Selenium process. Here you can set various options for browser drivers, such as:
	 *
	 * webdriver.firefox.profile: Selenium will be default create a new Firefox profile for each session.
	 * If you wish to use an existing Firefox profile you can specify its name here.
	 * Complete list of Firefox Driver arguments available https://code.google.com/p/selenium/wiki/FirefoxDriver.
	 *
	 * webdriver.chrome.driver: Nightwatch can run the tests using Chrome browser also. To enable this you have to download the ChromeDriver binary
	 * (http://chromedriver.storage.googleapis.com/index.html) and specify it's location here. Also don't forget to specify chrome as the browser name in the
	 * desiredCapabilities object.
	 * More information can be found on the ChromeDriver website (https://sites.google.com/a/chromium.org/chromedriver/).
	 *
	 * webdriver.ie.driver: Nightwatch has support for Internet Explorer also. To enable this you have to download the IE Driver binary
	 * (https://code.google.com/p/selenium/wiki/InternetExplorerDriver) and specify it's location here. Also don't forget to specify "internet explorer" as the browser
	 * name in the desiredCapabilities object.
	 */
	cli_args: {};

	/**
	 * Time to wait (in ms) before starting to check the Webdriver server is up and running
	 * @default 500
	 */
	check_process_delay: number;

	/**
	 * Maximum number of ping status check attempts before returning a timeout error
	 * @default 15
	 */
	max_status_poll_tries: number;

	/**
	 * Interval (in ms) to use between status ping checks when checking if the Webdriver server is up and running
	 * @default 200
	 */
	status_poll_interval: number;
}

// TODO: Remove duplicates from NightwatchOptions
export interface NightwatchTestSettingGeneric {
	/**
	 * A url which can be used later in the tests as the main url to load. Can be useful if your tests will run on different environments, each one with a different url.
	 */
	launch_url?: string | undefined;

	/**
	 * The hostname/IP on which the selenium server is accepting connections.
	 */
	selenium_host?: string | undefined;

	/**
	 * The port number on which the selenium server is accepting connections.
	 */
	selenium_port?: number | undefined;

	/**
	 * Whether to show extended Selenium command logs.
	 */
	silent?: boolean | undefined;

	/**
	 * Use to disable terminal output completely.
	 */
	output?: boolean | undefined;

	/**
	 * Use to disable colored output in the terminal.
	 */
	disable_colors?: boolean | undefined;

	/**
	 * In case the selenium server requires credentials this username will be used to compute the Authorization header.
	 * The value can be also an environment variable, in which case it will look like this: "username" : "${SAUCE_USERNAME}"
	 */
	username?: string | undefined;

	/**
	 * This field will be used together with username to compute the Authorization header.
	 * Like username, the value can be also an environment variable: "access_key" : "${SAUCE_ACCESS_KEY}"
	 */
	access_key?: string | undefined;

	/**
	 * Proxy requests to the selenium server. http, https, socks(v5), socks5, sock4, and pac are accepted. Uses node-proxy-agent. Example: http://user:pass@host:port
	 */
	proxy?: string | undefined;

	/**
	 * An object which will be passed to the Selenium WebDriver when a new session will be created. You can specify browser name for instance along with other capabilities.
	 * Example:
	 *  "desiredCapabilities" : {
	 *  "browserName" : "firefox",
	 *  "acceptSslCerts" : true
	 * }
	 * You can view the complete list of capabilities https://code.google.com/p/selenium/wiki/DesiredCapabilities.
	 */
	desiredCapabilities?: NightwatchDesiredCapabilities | undefined;

	/**
	 * An object which will be made available within the test and can be overwritten per environment. Example:"globals" : {  "myGlobal" : "some_global" }
	 */
	globals?: NightwatchTestHooks | undefined;

	/**
	 * An array of folders or file patterns to be skipped (relative to the main source folder).
	 * Example: "exclude" : ["excluded-folder"] or: "exclude" : ["test-folder/*-smoke.js"]
	 */
	exclude?: string[] | undefined;

	/**
	 * Folder or file pattern to be used when loading the tests. Files that don't match this patter will be ignored.
	 * Example: "filter" : "tests/*-smoke.js"
	 */
	filter?: string | undefined;

	/**
	 * Do not show the Base64 image data in the (verbose) log when taking screenshots.
	 */
	log_screenshot_data?: boolean | undefined;

	/**
	 * Use xpath as the default locator strategy
	 */
	use_xpath?: boolean | undefined;

	/**
	 * Same as Selenium settings cli_args. You can override the global cli_args on a per-environment basis.
	 */
	cli_args?: any;

	/**
	 * End the session automatically when the test is being terminated, usually after a failed assertion.
	 */
	end_session_on_fail?: boolean | undefined;

	/**
	 * Skip the rest of testcases (if any) when one testcase fails..
	 */
	skip_testcases_on_fail?: boolean | undefined;
}

export interface NightwatchTestSettingScreenshots extends NightwatchTestSettingGeneric {
	/**
	 * Selenium generates screenshots when command errors occur. With on_failure set to true, also generates screenshots for failing or erroring tests. These are saved on the disk.
	 * Since v0.7.5 you can disable screenshots for command errors by setting "on_error" to false.
	 * Example:
	 * "screenshots" : {
	 *      "enabled" : true,
	 *      "on_failure" : true,
	 *      "on_error" : false,
	 *      "path" : ""
	 * }
	 */
	screenshots: NightwatchScreenshotOptions;
}

export interface NightwatchTestOptions extends NightwatchTestSettingGeneric {
	screenshots: boolean;
	screenshotsPath: string;
}

export interface NightwatchTestSettings {
	[key: string]: NightwatchTestSettingScreenshots;
}

export interface NightwatchTestWorker {
  enabled: boolean;
  workers: string | number;
  node_options?: string | string[] | undefined;
}
