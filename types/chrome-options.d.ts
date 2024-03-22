export interface ChromePerfLoggingPrefs {
	/**
	 * Default: true. Whether or not to collect events from Network domain.
	 */
	enableNetwork?: boolean | undefined;

	/**
	 * Default: true. Whether or not to collect events from Page domain.
	 */
	enablePage?: boolean | undefined;

	/**
	 * A comma-separated string of Chrome tracing categories for which trace events should be collected.
	 * An unspecified or empty string disables tracing.
	 */
	traceCategories?: string | undefined;

	/**
	 * Default: 1000. The requested number of milliseconds between DevTools trace buffer usage events. For example, if 1000,
	 * then once per second, DevTools will report how full the trace buffer is. If a report indicates the buffer usage is 100%,
	 * a warning will be issued.
	 */
	bufferUsageReportingInterval?: number | undefined;
}

export interface ChromeOptions {
	/**
	 * Whether to run Chromedriver using w3c protocol or the legacy JSONWire protocol.
	 *
	 * @deprecated Chromedriver now only supports w3c protocol.
	 */
	w3c?: true;

	/**
	 * List of command-line arguments to use when starting Chrome. Arguments with an associated value should be separated by a '=' sign
	 * (e.g., ['start-maximized', 'user-data-dir=/tmp/temp_profile']).
	 */
	args?: string[] | undefined;

	/**
	 * Path to the Chrome executable to use (on Mac OS X, this should be the actual binary, not just the app. e.g.,
	 * '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
	 */
	binary?: string | undefined;

	/**
	 * A list of Chrome extensions to install on startup. Each item in the list should be a base-64 encoded packed Chrome extension (.crx)
	 */
	extensions?: string[] | undefined;

	/**
	 * A dictionary with each entry consisting of the name of the preference and its value. These preferences are applied
	 * to the Local State file in the user data folder.
	 */
	localState?: Record<string, string> | undefined;

	/**
	 * A dictionary with each entry consisting of the name of the preference and its value. These preferences are only applied
	 * to the user profile in use.
	 */
	prefs?: Record<string, string> | undefined;

	/**
	 * Default: false. If false, Chrome will be quit when ChromeDriver is killed, regardless of whether the session is quit.
	 * If true, Chrome will only be quit if the session is quit (or closed). Note, if true, and the session is not quit,
	 * ChromeDriver cannot clean up the temporary user data directory that the running Chrome instance is using.
	 */
	detach?: boolean | undefined;

	/**
	 * An address of a Chrome debugger server to connect to, in the form of <hostname/ip:port>, e.g. '127.0.0.1:38947'
	 */
	debuggerAddress?: string | undefined;

	/**
	 * List of Chrome command line switches to exclude that ChromeDriver by default passes when starting Chrome.
	 * Do not prefix switches with --.
	 */
	excludeSwitches?: string[] | undefined;

	/**
	 * Directory to store Chrome minidumps . (Supported only on Linux.)
	 */
	minidumpPath?: string | undefined;

	/**
	 * A dictionary with either a value for “deviceName,” or values for “deviceMetrics” and “userAgent.” Refer to Mobile Emulation for more information.
	 */
	mobileEmulation?: Record<string, string> | undefined;

	/**
	 * An optional dictionary that specifies performance logging preferences. See below for more information.
	 */
	perfLoggingPrefs?: ChromePerfLoggingPrefs | undefined;

	/**
	 * A list of window types that will appear in the list of window handles. For access to <webview> elements, include "webview" in this list.
	 */
	windowTypes?: string[] | undefined;

	/**
	 * Name of the Android package to do automation on. E.g., 'com.android.chrome'.
	 */
	androidPackage?: string;

	/**
	 * Serial number of the device to connect to via ADB. If not specified, the
	 * WebDriver server will select an unused device at random. An error will be
	 * returned if all devices already have active sessions.
	 */
	androidDeviceSerial?: string;
}
