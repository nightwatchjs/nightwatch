import { expectError, expectType } from 'tsd';
import { ExtendDescribeThis, NightwatchAPI } from '..';

type Metrics = { [metricName: string]: number };

//
// .setGeolocation
//
describe('mock geolocation', function () {
  it('sets the geolocation to Tokyo, Japan and then resets it', () => {
    browser
      .setGeolocation({
        latitude: 35.689487,
        longitude: 139.691706,
        accuracy: 100,
      }) // sets the geolocation to Tokyo, Japan
      .navigateTo('https://www.gps-coordinates.net/my-location')
      .pause(3000)
      .setGeolocation() // resets the geolocation
      .navigateTo('https://www.gps-coordinates.net/my-location')
      .pause(3000);
  });

  it('tests different ways of using setGeolocation', () => {
    // with all parameters
    browser.setGeolocation(
      {
        latitude: 35.689487,
        longitude: 139.691706,
        accuracy: 100,
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter (resets the geolocation)
        this.setGeolocation();
        console.log(result.value);
      }
    );

    // with only latitude and longitude
    browser.setGeolocation({
      latitude: 35.689487,
      longitude: 139.691706,
    });

    // with just one parameter
    expectError(browser.setGeolocation({
      latitude: 35.689487,
    }))
  });

  it('tests setGeolocation with async', async () => {
    const result = await browser.setGeolocation({
      latitude: 35.689487,
      longitude: 139.691706,
    });

    expectType<null>(result);
  });
});

//
// .captureNetworkRequests
//
describe('capture network requests', function () {
  it('captures and logs network requests as they occur', function (this: ExtendDescribeThis<{ requestCount: number }>) {
    this.requestCount = 1;
    browser
      .captureNetworkRequests((requestParams) => {
        console.log('Request Number:', this.requestCount!++);
        console.log('Request URL:', requestParams.request.url);
        console.log('Request method:', requestParams.request.method);
        console.log('Request headers:', requestParams.request.headers);
      })
      .navigateTo('https://www.google.com');
  });

  it('tests different ways of using captureNetworkRequests', () => {
    // with all parameters
    browser.captureNetworkRequests(
      (requestParams) => {
        console.log('Request URL:', requestParams.request.url);
        console.log('Request method:', requestParams.request.method);
        console.log('Request headers:', requestParams.request.headers);
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter
        expectError(this.captureNetworkRequests())
        console.log(result.value);
      }
    );
  });

  it('tests captureNetworkRequests with async', async () => {
    const result = await browser.captureNetworkRequests(() => {});

    expectType<null>(result);
  });

  it('captures and logs network requests as they occur', function (this: ExtendDescribeThis<{ requestCount: number }>) {
    this.requestCount = 1;
    browser
      .network.captureRequests((requestParams) => {
        console.log('Request Number:', this.requestCount!++);
        console.log('Request URL:', requestParams.request.url);
        console.log('Request method:', requestParams.request.method);
        console.log('Request headers:', requestParams.request.headers);
      })
      .navigateTo('https://www.google.com');
  });

  it('tests different ways of using captureRequests', () => {
    // with all parameters
    browser.network.captureRequests(
      (requestParams) => {
        console.log('Request URL:', requestParams.request.url);
        console.log('Request method:', requestParams.request.method);
        console.log('Request headers:', requestParams.request.headers);
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter
        expectError(this.network.captureRequests())
        console.log(result.value);
      }
    );
  });

  it('tests captureRequests with async', async () => {
    const result = await browser.network.captureRequests(() => {});

    expectType<null>(result);
  });
});

//
// .mockNetworkResponse
//
describe('mock network response', function () {
  it('intercepts the request made to Google search and mocks its response', function () {
    browser
      .mockNetworkResponse('https://www.google.com/', {
        status: 200,
        headers: {
          'Content-Type': 'UTF-8',
        },
        body: 'Hello there!',
      })
      .navigateTo('https://www.google.com/')
      .pause(2000);
  });

  it('tests different ways of using mockNetworkResponse', () => {
    // with all parameters
    browser.mockNetworkResponse(
      'https://www.google.com/',
      {
        status: 200,
        headers: {
          'Content-Type': 'UTF-8',
        },
        body: 'Hello there!',
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter (invalid)
        expectError(this.mockNetworkResponse())
        console.log(result.value);
      }
    );

    // with no response
    browser.mockNetworkResponse('https://www.google.com/');

    // with empty response
    browser.mockNetworkResponse('https://www.google.com/', {});

    // with just one parameter
    browser.mockNetworkResponse('https://www.google.com/', {
      body: 'Hello there!',
    });
  });

  it('tests mockNetworkResponse with async', async () => {
    const result = await browser.mockNetworkResponse('https://www.google.com/');

    expectType<null>(result);
  });

  it('intercepts the request made to Google search and mocks its response', function () {
    browser
      .network.mockResponse('https://www.google.com/', {
        status: 200,
        headers: {
          'Content-Type': 'UTF-8',
        },
        body: 'Hello there!',
      })
      .navigateTo('https://www.google.com/')
      .pause(2000);
  });

  it('tests different ways of using mockNetworkResponse', () => {
    // with all parameters
    browser.network.mockResponse(
      'https://www.google.com/',
      {
        status: 200,
        headers: {
          'Content-Type': 'UTF-8',
        },
        body: 'Hello there!',
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter (invalid)
        expectError(this.network.mockResponse())
        console.log(result.value);
      }
    );

    // with no response
    browser.network.mockResponse('https://www.google.com/');

    // with empty response
    browser.network.mockResponse('https://www.google.com/', {});

    // with just one parameter
    browser.network.mockResponse('https://www.google.com/', {
      body: 'Hello there!',
    });
  });

  it('tests mockResponse with async', async () => {
    const result = await browser.network.mockResponse('https://www.google.com/');

    expectType<null>(result);
  });
});

//
//.setNetworkConditions
//
describe('set network conditions', function () {
  it('sets the network conditions', function () {
    browser
      .setNetworkConditions({
        offline: false,
        latency: 3000, // Additional latency (ms).
        download_throughput: 500 * 1024, // Maximal aggregated download throughput.
        upload_throughput: 500 * 1024, // Maximal aggregated upload throughput.
      })
      .navigateTo('https://www.google.com')
      .pause(2000)
  });

  it('tests different ways of using setNetworkConditions', () => {
    // with all parameters
    browser.setNetworkConditions(
      {
        offline: false,
        latency: 3000, // Additional latency (ms).
        download_throughput: 500 * 1024, // Maximal aggregated download throughput.
        upload_throughput: 500 * 1024, // Maximal aggregated upload throughput.
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter (resets the network conditions)
        // without any parameter (invalid)
        expectError(this.setNetworkConditions())
         // missing 'offline' parameter
        expectError(this.setNetworkConditions({
          latency: 3000,
          download_throughput: 500 * 1024,
          upload_throughput: 500 * 1024,
        }));
        // missing 'latency' parameter
        expectError(this.setNetworkConditions({
          offline: false,
          download_throughput: 500 * 1024,
          upload_throughput: 500 * 1024,
        }));
        // missing 'download_throughput' parameter
        expectError(this.setNetworkConditions({
          offline: false,
          latency: 3000,
          upload_throughput: 500 * 1024,
        }));
        // missing 'upload_throughput' parameter
        expectError(this.setNetworkConditions({
          offline: false,
          latency: 3000,
          download_throughput: 500 * 1024,
        }));

        console.log(result.value);
      }
    );

  });

  it('tests setNetworkConditions with async', async () => {
    const result = await browser.setNetworkConditions({
      offline: false,
      latency: 3000, // Additional latency (ms).
      download_throughput: 500 * 1024, // Maximal aggregated download throughput.
      upload_throughput: 500 * 1024, // Maximal aggregated upload throughput.
    });

    expectType<null>(result);
  });

  it('sets the network conditions', function () {
    browser
      .network.setConditions({
        offline: false,
        latency: 3000, // Additional latency (ms).
        download_throughput: 500 * 1024, // Maximal aggregated download throughput.
        upload_throughput: 500 * 1024, // Maximal aggregated upload throughput.
      })
      .navigateTo('https://www.google.com')
      .pause(2000)
  });

  it('tests different ways of using setNetworkConditions', () => {
    // with all parameters
    browser.network.setConditions(
      {
        offline: false,
        latency: 3000, // Additional latency (ms).
        download_throughput: 500 * 1024, // Maximal aggregated download throughput.
        upload_throughput: 500 * 1024, // Maximal aggregated upload throughput.
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter (resets the network conditions)
        // without any parameter (invalid)
        expectError(this.network.setConditions())
         // missing 'offline' parameter
        expectError(this.network.setConditions({
          latency: 3000,
          download_throughput: 500 * 1024,
          upload_throughput: 500 * 1024,
        }));
        // missing 'latency' parameter
        expectError(this.network.setConditions({
          offline: false,
          download_throughput: 500 * 1024,
          upload_throughput: 500 * 1024,
        }));
        // missing 'download_throughput' parameter
        expectError(this.network.setConditions({
          offline: false,
          latency: 3000,
          upload_throughput: 500 * 1024,
        }));
        // missing 'upload_throughput' parameter
        expectError(this.network.setConditions({
          offline: false,
          latency: 3000,
          download_throughput: 500 * 1024,
        }));

        console.log(result.value);
      }
    );

  });

  it('tests setConditions with async', async () => {
    const result = await browser.network.setConditions({
      offline: false,
      latency: 3000, // Additional latency (ms).
      download_throughput: 500 * 1024, // Maximal aggregated download throughput.
      upload_throughput: 500 * 1024, // Maximal aggregated upload throughput.
    });

    expectType<null>(result);
  });
});

//
// .setDeviceDimensions
//
describe('modify device dimensions', function () {
  it('modifies the device dimensions and then resets it', function () {
    browser
      .setDeviceDimensions({
        width: 400,
        height: 600,
        deviceScaleFactor: 50,
        mobile: true,
      })
      .navigateTo('https://www.google.com')
      .pause(1000)
      .setDeviceDimensions() // resets the device dimensions
      .navigateTo('https://www.google.com')
      .pause(1000);
  });

  it('tests different ways of using setDeviceDimensions', () => {
    // with all parameters
    browser.setDeviceDimensions(
      {
        width: 400,
        height: 600,
        deviceScaleFactor: 50,
        mobile: true,
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter (resets the dimensions)
        this.setDeviceDimensions();
        console.log(result.value);
      }
    );

    // with only width and deviceScaleFactor
    browser.setDeviceDimensions({
      width: 400,
      deviceScaleFactor: 50,
    });

    // with just one parameter
    browser.setDeviceDimensions({
      mobile: true,
    });
  });

  it('tests setDeviceDimensions with async', async () => {
    const result = await browser.setDeviceDimensions();

    expectType<null>(result);
  });
});

//
// .getPerformanceMetrics
//
describe('collect performance metrics', function () {
  it('enables the metrics collection, does some stuff and collects the metrics', function () {
    browser
      .enablePerformanceMetrics()
      .navigateTo('https://www.google.com')
      .getPerformanceMetrics((result) => {
        if (result.status === 0) {
          const metrics = result.value;
          console.log(metrics);
        }
      });
  });

  it('tests different ways of using getPerformanceMetrics', () => {
    // with all parameters
    browser.getPerformanceMetrics(function (result) {
      expectType<NightwatchAPI>(this);
      // without any parameter
      this.getPerformanceMetrics();

      if (result.status === 0) {
        const metrics = result.value;
        expectType<Metrics>(metrics);
      }
    });
  });

  it('tests getPerformanceMetrics with async', async () => {
    const result1 = await browser.getPerformanceMetrics();
    expectType<Metrics>(result1);

    const result2 = await browser
      .enablePerformanceMetrics()
      .navigateTo('https://www.google.com')
      .getPerformanceMetrics();
    expectType<Metrics>(result2);
  });
});

//
// .enablePerformanceMetrics
//
describe('collect performance metrics', function () {
  it('enables the metrics collection, does some stuff and collects the metrics', function () {
    browser
      .enablePerformanceMetrics()
      .navigateTo('https://www.google.com')
      .getPerformanceMetrics((result) => {
        if (result.status === 0) {
          const metrics = result.value;
          console.log(metrics);
        }
      });
  });

  it('tests different ways of using enablePerformanceMetrics', () => {
    // with all parameters
    browser.enablePerformanceMetrics(false, function (result) {
      expectType<NightwatchAPI>(this);
      // without any parameter
      this.enablePerformanceMetrics();
      console.log(result.value);
    });
  });

  it('tests enablePerformanceMetrics with async', async () => {
    const result1 = await browser.enablePerformanceMetrics();
    expectType<null>(result1);

    const result2 = await browser.enablePerformanceMetrics(false);
    expectType<null>(result2);
  });
});

//
// .takeHeapSnapshot
//
describe('take heap snapshot', function () {
  it('takes heap snapshot and saves it as snap.heapsnapshot file', function () {
    browser.navigateTo('https://www.google.com').takeHeapSnapshot('./snap.heapsnapshot');
  });

  it('tests different ways of using takeHeapSnapshot', () => {
    // with all parameters
    browser.takeHeapSnapshot('snap.heapsnapshot', function (result) {
      expectType<NightwatchAPI>(this);
      // without any parameter
      this.takeHeapSnapshot();

      if (result.status === 0) {
        const snapshot = result.value;
        expectType<string>(snapshot);
      }
    });
  });

  it('tests takeHeapSnapshot with async', async () => {
    const result1 = await browser.takeHeapSnapshot();
    expectType<string>(result1);

    const result2 = await browser.navigateTo('https://www.google.com').takeHeapSnapshot('something.heapsnapshot');
    expectType<string>(result2);
  });
});

//
// .captureBrowserConsoleLogs
//
describe('capture console events', function () {
  it('captures and logs console.log event', function () {
    browser
      .captureBrowserConsoleLogs((event) => {
        console.log(event.type, event.timestamp, event.args[0].value);
      })
      .navigateTo('https://www.google.com')
      .executeScript(function () {
        console.log('here');
      }, []);
  });

  it('captures and logs console.log event using logs ns', function () {
    browser
      .logs.captureBrowserConsoleLogs((event) => {
        console.log(event.type, event.timestamp, event.args[0].value);
      })
      .navigateTo('https://www.google.com')
      .executeScript(function () {
        console.log('here');
      }, []);
  });

  it('tests different ways of using captureBrowserConsoleLogs', () => {
    // with all parameters
    browser.captureBrowserConsoleLogs(
      (event) => {
        console.log(event.type, event.timestamp, event.args[0].value);
        expectError(event.context);
        expectError(event.stackTrace);
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter
        expectError(this.captureBrowserConsoleLogs())
        console.log(result.value);
      }
    );
  });

  it('tests captureBrowserConsoleLogs with async', async () => {
    const result = await browser.captureBrowserConsoleLogs(() => {});

    expectType<null>(result);
  });
});

//
// .captureBrowserExceptions
//
describe('catch browser exceptions', function () {
  it('captures the js exceptions thrown in the browser', async function () {
    await browser.captureBrowserExceptions((event) => {
      console.log('>>> Exception:', event);
    });

    await browser.navigateTo('https://duckduckgo.com/');

    const searchBoxElement = await browser.findElement('input[name=q]');
    await browser.executeScript(
      function (_searchBoxElement) {
        expectError(_searchBoxElement.setAttribute('onclick', 'throw new Error("Hello world!")'))
      },
      [searchBoxElement]
    );

    await browser.elementIdClick(searchBoxElement.getId());
  });

  it('captures the js exceptions thrown in the browser ', async function () {
    await browser
      .logs.captureBrowserExceptions((event) => {
        console.log('>>> Exception:', event);
      })
      .navigateTo('https://duckduckgo.com/');

    const searchBoxElement = await browser.findElement('input[name=q]');
    await browser.executeScript(
      function (_searchBoxElement) {
        expectError(_searchBoxElement.setAttribute('onclick', 'throw new Error("Hello world!")'))
      },
      [searchBoxElement]
    );

    await browser.elementIdClick(searchBoxElement.getId());
  });

  it('tests different ways of using captureBrowserExceptions', () => {
    // with all parameters
    browser.captureBrowserExceptions(
      (event) => {
        console.log('>>> Exception:', event.timestamp, event.exceptionDetails);
      },
      function (result) {
        expectType<NightwatchAPI>(this);
        // without any parameter
        expectError(this.captureBrowserExceptions())
        console.log(result.value);
      }
    );
  });

  it('tests captureBrowserExceptions with async', async () => {
    const result = await browser.captureBrowserExceptions(() => {});

    expectType<null>(result);
  });
});
