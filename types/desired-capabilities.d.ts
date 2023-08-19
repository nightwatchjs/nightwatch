import {ChromeOptions} from "./chrome-options";

//  TODO: visit later (some settings here are no longer used)
export interface NightwatchDesiredCapabilities {
	[key: `${string}:${string}`]: unknown;

	/**
	 * The name of the browser being used; examples: {chrome|firefox|safari|edge|internet explorer|opera|brave|null}.
	 */
	browserName?: string | null;

	/**
	 * The browser version, or the empty string if unknown.
	 */
	browserVersion?: string;

	/**
	 * A key specifying which platform the browser should be running on. This value should be one of {WINDOWS|XP|VISTA|MAC|LINUX|UNIX|ANDROID|IOS}.
	 * When requesting a new session, the client may specify ANY to indicate any available platform may be used.
	 * For more information see [GridPlatforms (https://code.google.com/p/selenium/wiki/GridPlatforms)]
	 */
	platformName?: string;

	/**
	 * Indicates whether untrusted and self-signed TLS certificates are implicitly trusted on navigation for the duration of the session.
	 */
	acceptInsecureCerts?: boolean;

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
	'goog:loggingPrefs'?: {
		browser?: string | undefined;
		driver?: string | undefined;
		server?: string | undefined;
	};

	/**
	 * List all the Chrome-specific desired capabilities.
	 * @deprecated In favour of `goog:chromeOptions`.
	 */
	chromeOptions?: ChromeOptions;

	/**
	 * List all the Chrome-specific desired capabilities.
	 */
	'goog:chromeOptions'?: ChromeOptions;
}
