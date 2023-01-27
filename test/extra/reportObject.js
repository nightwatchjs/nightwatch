module.exports = {
  'passed': 12,
  'failed': 2,
  'errors': 0,
  'skipped': 0,
  'tests': 0,
  'assertions': 14,
  'errmessages': [],
  'modules': {
    'ecosia': {
      'reportPrefix': 'FIREFOX_108.0.1__',
      'assertionsCount': 7,
      'lastError': {
        'name': 'NightwatchAssertError',
        'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
        'showDiff': false,
        'abortOnFailure': true,
        'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
      },
      'skipped': [],
      'time': '21.18',
      'timeMs': 21175,
      'completed': {
        'Demo test ecosia.org': {
          'time': '15.78',
          'assertions': [{
            'name': 'NightwatchAssertError',
            'message': 'Element <body> was visible after 26 milliseconds.',
            'stackTrace': '',
            'fullMsg': 'Element <body> was visible after 26 milliseconds.',
            'failure': false
          }, {
            'name': 'NightwatchAssertError',
            'message': 'Testing if the page title contains \'Ecosia\' (3ms)',
            'stackTrace': '',
            'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
            'failure': false
          }, {
            'name': 'NightwatchAssertError',
            'message': 'Testing if element <input[type=search]> is visible (14ms)',
            'stackTrace': '',
            'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
            'failure': false
          }, {
            'name': 'NightwatchAssertError',
            'message': 'Testing if element <button[type=submit]> is visible (8ms)',
            'stackTrace': '',
            'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
            'failure': false
          }, {
            'name': 'NightwatchAssertError',
            'message': 'Testing if element <.layout__content> contains text \'Nightwatch.js\' (295ms)',
            'stackTrace': '',
            'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
            'failure': false
          }],
          'commands': [],
          'passed': 5,
          'errors': 0,
          'failed': 0,
          'skipped': 0,
          'tests': 5,
          'status': 'pass',
          'steps': [],
          'stackTrace': '',
          'testcases': {
            'Demo test ecosia.org': {
              'time': '15.78',
              'assertions': [{
                'name': 'NightwatchAssertError',
                'message': 'Element <body> was visible after 26 milliseconds.',
                'stackTrace': '',
                'fullMsg': 'Element <body> was visible after 26 milliseconds.',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
                'stackTrace': '',
                'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
                'stackTrace': '',
                'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
                'stackTrace': '',
                'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
                'stackTrace': '',
                'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
                'failure': false
              }],
              'tests': 5,
              'commands': [],
              'passed': 5,
              'errors': 0,
              'failed': 0,
              'skipped': 0,
              'status': 'pass',
              'steps': [],
              'stackTrace': '',
              'timeMs': 15779,
              'startTimestamp': 'Thu, 22 Dec 2022 08:12:54 GMT',
              'endTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT'
            }
          },
          'timeMs': 15779,
          'startTimestamp': 'Thu, 22 Dec 2022 08:12:54 GMT',
          'endTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT'
        },
        'Demo test ecosia.org fail': {
          'time': '5.396',
          'assertions': [{
            'name': 'NightwatchAssertError',
            'message': 'Element <body> was visible after 8 milliseconds.',
            'stackTrace': '',
            'fullMsg': 'Element <body> was visible after 8 milliseconds.',
            'failure': false
          }, {
            'name': 'NightwatchAssertError',
            'message': 'Testing if the page title contains \'foo\' in 5000ms - expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web" (5100ms)',
            'stackTrace': '    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
            'fullMsg': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
            'failure': 'Expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web"',
            'screenshots': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134315-GMT+0530.png']
          }],
          'commands': [],
          'passed': 1,
          'errors': 0,
          'failed': 1,
          'skipped': 0,
          'tests': 2,
          'status': 'fail',
          'steps': [],
          'stackTrace': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
          'testcases': {
            'Demo test ecosia.org': {
              'time': '15.78',
              'assertions': [{
                'name': 'NightwatchAssertError',
                'message': 'Element <body> was visible after 26 milliseconds.',
                'stackTrace': '',
                'fullMsg': 'Element <body> was visible after 26 milliseconds.',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
                'stackTrace': '',
                'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
                'stackTrace': '',
                'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
                'stackTrace': '',
                'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
                'stackTrace': '',
                'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
                'failure': false
              }],
              'tests': 5,
              'commands': [],
              'passed': 5,
              'errors': 0,
              'failed': 0,
              'skipped': 0,
              'status': 'pass',
              'steps': [],
              'stackTrace': '',
              'timeMs': 15779,
              'startTimestamp': 'Thu, 22 Dec 2022 08:12:54 GMT',
              'endTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT'
            },
            'Demo test ecosia.org fail': {
              'time': '5.396',
              'assertions': [{
                'name': 'NightwatchAssertError',
                'message': 'Element <body> was visible after 8 milliseconds.',
                'stackTrace': '',
                'fullMsg': 'Element <body> was visible after 8 milliseconds.',
                'failure': false
              }, {
                'name': 'NightwatchAssertError',
                'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
                'stackTrace': '    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
                'fullMsg': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
                'failure': 'Expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web"',
                'screenshots': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134315-GMT+0530.png']
              }],
              'tests': 2,
              'commands': [],
              'passed': 1,
              'errors': 0,
              'failed': 1,
              'skipped': 0,
              'status': 'fail',
              'steps': [],
              'stackTrace': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
              'lastError': {
                'name': 'NightwatchAssertError',
                'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
                'showDiff': false,
                'abortOnFailure': true,
                'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
              },
              'timeMs': 5396,
              'startTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT',
              'endTimestamp': 'Thu, 22 Dec 2022 08:13:15 GMT'
            }
          },
          'lastError': {
            'name': 'NightwatchAssertError',
            'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
            'showDiff': false,
            'abortOnFailure': true,
            'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
          },
          'timeMs': 5396,
          'startTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT',
          'endTimestamp': 'Thu, 22 Dec 2022 08:13:15 GMT'
        }
      },
      'completedSections': {
        '__global_beforeEach_hook': {
          'time': 0,
          'assertions': [],
          'commands': [],
          'passed': 0,
          'errors': 0,
          'failed': 0,
          'skipped': 0,
          'tests': 0,
          'status': 'pass'
        },
        '__before_hook': {
          'time': 0,
          'assertions': [],
          'commands': [{
            'name': 'navigateTo',
            'args': ['https://www.ecosia.org/'],
            'startTime': 1671696762127,
            'endTime': 1671696774357,
            'elapsedTime': 12230,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }],
          'passed': 0,
          'errors': 0,
          'failed': 0,
          'skipped': 0,
          'tests': 0,
          'status': 'pass'
        },
        'Demo test ecosia.org': {
          'time': 0,
          'assertions': [],
          'commands': [{
            'name': 'waitForElementVisible',
            'args': ['body'],
            'startTime': 1671696774361,
            'endTime': 1671696774389,
            'elapsedTime': 28,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }, {
            'name': 'assert.titleContains',
            'args': ['Ecosia'],
            'startTime': 1671696774389,
            'endTime': 1671696774395,
            'elapsedTime': 6,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }, {
            'name': 'assert.visible',
            'args': ['input[type=search]'],
            'startTime': 1671696774395,
            'endTime': 1671696774410,
            'elapsedTime': 15,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }, {
            'name': 'setValue',
            'args': ['input[type=search]', 'nightwatch'],
            'startTime': 1671696774410,
            'endTime': 1671696774434,
            'elapsedTime': 24,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }, {
            'name': 'assert.visible',
            'args': ['button[type=submit]'],
            'startTime': 1671696774434,
            'endTime': 1671696774444,
            'elapsedTime': 10,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }, {
            'name': 'click',
            'args': ['button[type=submit]'],
            'startTime': 1671696774444,
            'endTime': 1671696789840,
            'elapsedTime': 15396,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }, {
            'name': 'assert.textContains',
            'args': ['.layout__content', 'Nightwatch.js'],
            'startTime': 1671696789840,
            'endTime': 1671696790137,
            'elapsedTime': 297,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }],
          'passed': 0,
          'errors': 0,
          'failed': 0,
          'skipped': 0,
          'tests': 0,
          'status': 'pass'
        },
        'Demo test ecosia.org fail': {
          'time': 0,
          'assertions': [],
          'commands': [{
            'name': 'waitForElementVisible',
            'args': ['body'],
            'startTime': 1671696790139,
            'endTime': 1671696790147,
            'elapsedTime': 8,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }, {
            'name': 'assert.titleContains',
            'args': ['foo'],
            'startTime': 1671696790147,
            'endTime': 1671696795256,
            'elapsedTime': 5109,
            'status': 'fail',
            'result': {
              'message': 'Testing if the page title contains \'foo\' in 5000ms - expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web" (5100ms)',
              'showDiff': false,
              'name': 'NightwatchAssertError',
              'abortOnFailure': true,
              'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
              'beautifiedStack': {
                'filePath': '/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js',
                'error_line_number': 22,
                'codeSnippet': [{
                  'line_number': 20,
                  'code': '    browser'
                }, {
                  'line_number': 21,
                  'code': '      .waitForElementVisible(\'body\')'
                }, {
                  'line_number': 22,
                  'code': '      .assert.titleContains(\'foo\')'
                }, {
                  'line_number': 23,
                  'code': '      .assert.visible(\'input[type=search]\')'
                }, {
                  'line_number': 24,
                  'code': '      .setValue(\'input[type=search]\', \'nightwatch\')'
                }]
              }
            },
            'screenshot': '/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134315-GMT+0530.png'
          }, {
            'name': 'saveScreenshot',
            'args': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134315-GMT+0530.png', 'function () { [native code] }'],
            'startTime': 1671696795313,
            'endTime': 1671696795533,
            'elapsedTime': 220,
            'status': 'pass',
            'result': {
              'status': 0
            }
          }],
          'passed': 0,
          'errors': 0,
          'failed': 0,
          'skipped': 0,
          'tests': 0,
          'status': 'fail'
        },
        '__after_hook': {
          'time': 0,
          'assertions': [],
          'commands': [{
            'name': 'end',
            'args': [],
            'startTime': 1671696795535,
            'endTime': 1671696796303,
            'elapsedTime': 768,
            'status': 'pass'
          }],
          'passed': 0,
          'errors': 0,
          'failed': 0,
          'skipped': 0,
          'tests': 0,
          'status': 'pass'
        },
        '__global_afterEach_hook': {
          'time': 0,
          'assertions': [],
          'commands': [],
          'passed': 0,
          'errors': 0,
          'failed': 0,
          'skipped': 0,
          'tests': 0,
          'status': 'pass'
        }
      },
      'errmessages': [],
      'testsCount': 2,
      'skippedCount': 0,
      'failedCount': 1,
      'errorsCount': 0,
      'passedCount': 6,
      'group': '',
      'modulePath': '/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js',
      'startTimestamp': 'Thu, 22 Dec 2022 08:12:40 GMT',
      'endTimestamp': 'Thu, 22 Dec 2022 08:13:15 GMT',
      'sessionCapabilities': {
        'acceptInsecureCerts': false,
        'browserName': 'firefox',
        'browserVersion': '108.0.1',
        'moz:accessibilityChecks': false,
        'moz:buildID': '20221215175817',
        'moz:geckodriverVersion': '0.32.0',
        'moz:headless': false,
        'moz:platformVersion': '22.1.0',
        'moz:processID': 1629,
        'moz:profile': '/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/rust_mozprofile7Yt8vc',
        'moz:shutdownTimeout': 60000,
        'moz:useNonSpecCompliantPointerOrigin': false,
        'moz:webdriverClick': true,
        'moz:windowless': false,
        'pageLoadStrategy': 'normal',
        'platformName': 'mac',
        'proxy': {},
        'setWindowRect': true,
        'strictFileInteractability': false,
        'timeouts': {
          'implicit': 0,
          'pageLoad': 300000,
          'script': 30000
        },
        'unhandledPromptBehavior': 'dismiss and notify'
      },
      'sessionId': '5ce15e96-1745-4071-b0ba-a21522f69cef',
      'projectName': '',
      'buildName': '',
      'testEnv': 'firefox',
      'isMobile': false,
      'status': 'fail',
      'seleniumLog': '/Users/binayakghosh/projects/nightwatch-copy/logs/ecosia_geckodriver.log',
      'tests': 2,
      'failures': 1,
      'errors': 0,
      'httpOutput': [
        ['2022-12-22T08:12:40.304Z', '  Request <b><span style="color:#0AA">POST /session  </span></b>', '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'],
        ['2022-12-22T08:12:42.123Z', '  Response 200 POST /session (1821ms)', '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;5ce15e96-1745-4071-b0ba-a21522f69cef&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;108.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20221215175817&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.1.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">1629<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/rust_mozprofile7Yt8vc&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'],
        ['2022-12-22T08:12:42.127Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/url  </span></b>', '{ url: <span style="color:#0A0">&#39;https://www.ecosia.org/&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:12:54.355Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/url (12228ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
        ['2022-12-22T08:12:54.364Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'],
        ['2022-12-22T08:12:54.378Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (14ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;202fb5a8-b2a0-4387-82ba-ed00eba69ef6&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
        ['2022-12-22T08:12:54.380Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;202fb5a8-b2a0-4387-82ba-ed00eba69ef6&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;202fb5a8-b2a0-4387-82ba-ed00eba69ef6&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
        ['2022-12-22T08:12:54.388Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (8ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:12:54.392Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:12:54.393Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (1ms)', '{ value: <span style="color:#0A0">&#39;Ecosia - the search engine that plants trees&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:12:54.397Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
        ['2022-12-22T08:12:54.400Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (3ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;7c487427-edc6-49f2-b230-e7d7c36a779b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
        ['2022-12-22T08:12:54.401Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;7c487427-edc6-49f2-b230-e7d7c36a779b&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;7c487427-edc6-49f2-b230-e7d7c36a779b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
        ['2022-12-22T08:12:54.408Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (7ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:12:54.410Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
        ['2022-12-22T08:12:54.412Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;7c487427-edc6-49f2-b230-e7d7c36a779b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
        ['2022-12-22T08:12:54.413Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/clear  </span></b>', '{}'],
        ['2022-12-22T08:12:54.419Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/clear (7ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
        ['2022-12-22T08:12:54.419Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/value  </span></b>', '{\n     text: <span style="color:#0A0">&#39;nightwatch&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'],
        ['2022-12-22T08:12:54.433Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/value (14ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
        ['2022-12-22T08:12:54.436Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
        ['2022-12-22T08:12:54.437Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2db1076f-3aa3-457d-9eea-3244bd61f510&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
        ['2022-12-22T08:12:54.438Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2db1076f-3aa3-457d-9eea-3244bd61f510&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;2db1076f-3aa3-457d-9eea-3244bd61f510&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
        ['2022-12-22T08:12:54.442Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (4ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:12:54.444Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
        ['2022-12-22T08:12:54.448Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (4ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2db1076f-3aa3-457d-9eea-3244bd61f510&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
        ['2022-12-22T08:12:54.449Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/2db1076f-3aa3-457d-9eea-3244bd61f510/click  </span></b>', '{}'],
        ['2022-12-22T08:13:09.839Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/2db1076f-3aa3-457d-9eea-3244bd61f510/click (15390ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
        ['2022-12-22T08:13:09.843Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;.layout__content&#39;<span style="color:#FFF"> }</span></span></span></span>'],
        ['2022-12-22T08:13:09.846Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (4ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9275e380-10a2-4a89-8a2e-ba2c0d54c9b8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
        ['2022-12-22T08:13:09.846Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/9275e380-10a2-4a89-8a2e-ba2c0d54c9b8/text  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:10.135Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/9275e380-10a2-4a89-8a2e-ba2c0d54c9b8/text (287ms)', '{\n     value: <span style="color:#0A0">&#39;Search\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;https://nightwatchjs.org\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwa...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'],
        ['2022-12-22T08:13:10.139Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'],
        ['2022-12-22T08:13:10.142Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;51b2761e-4769-485c-9591-ad7fe1eb1b0d&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
        ['2022-12-22T08:13:10.143Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;51b2761e-4769-485c-9591-ad7fe1eb1b0d&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;51b2761e-4769-485c-9591-ad7fe1eb1b0d&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
        ['2022-12-22T08:13:10.147Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (4ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:10.149Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:10.151Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (2ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:10.655Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:10.660Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:11.164Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:11.167Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (3ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:11.669Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:11.683Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (14ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:12.187Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:12.191Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:12.696Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:12.701Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:13.206Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:13.211Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (6ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:13.717Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:13.721Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:14.225Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:14.230Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:14.735Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:14.740Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:15.244Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:15.248Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
        ['2022-12-22T08:13:15.316Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/screenshot  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:15.523Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/screenshot (135ms)', '{\n     value: <span style="color:#0A0">&#39;iVBORw0KGgoAAAANSUhEUgAACgAAAAZWCAYAAABgI/pGAAAgAElEQVR4XuydB3xT1RfHTxfQARQ6KC2bsrcgIKiggAKCypApU0TZ...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'],
        ['2022-12-22T08:13:15.537Z', '  Request <b><span style="color:#0AA">DELETE /session/5ce15e96-1745-4071-b0ba-a21522f69cef  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
        ['2022-12-22T08:13:16.302Z', '  Response 200 DELETE /session/5ce15e96-1745-4071-b0ba-a21522f69cef (765ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>']
      ],
      'rawHttpOutput': [
        ['2022-12-22T08:12:40.304Z', '  Request POST /session  ', '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'],
        ['2022-12-22T08:12:42.123Z', '  Response 200 POST /session (1821ms)', '{\n     value: {\n       sessionId: \'5ce15e96-1745-4071-b0ba-a21522f69cef\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'108.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20221215175817\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.1.0\',\n         \'moz:processID\': 1629,\n         \'moz:profile\': \'/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/rust_mozprofile7Yt8vc\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'],
        ['2022-12-22T08:12:42.127Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/url  ', '{ url: \'https://www.ecosia.org/\' }'],
        ['2022-12-22T08:12:54.355Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/url (12228ms)', '{ value: null }'],
        ['2022-12-22T08:12:54.364Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'body\' }'],
        ['2022-12-22T08:12:54.378Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (14ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'202fb5a8-b2a0-4387-82ba-ed00eba69ef6\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:12:54.380Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'202fb5a8-b2a0-4387-82ba-ed00eba69ef6\',\n         ELEMENT: \'202fb5a8-b2a0-4387-82ba-ed00eba69ef6\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:12:54.388Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (8ms)', '{ value: true }'],
        ['2022-12-22T08:12:54.392Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:12:54.393Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (1ms)', '{ value: \'Ecosia - the search engine that plants trees\' }'],
        ['2022-12-22T08:12:54.397Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'input[type=search]\' }'],
        ['2022-12-22T08:12:54.400Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (3ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'7c487427-edc6-49f2-b230-e7d7c36a779b\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:12:54.401Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'7c487427-edc6-49f2-b230-e7d7c36a779b\',\n         ELEMENT: \'7c487427-edc6-49f2-b230-e7d7c36a779b\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:12:54.408Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (7ms)', '{ value: true }'],
        ['2022-12-22T08:12:54.410Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'input[type=search]\' }'],
        ['2022-12-22T08:12:54.412Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'7c487427-edc6-49f2-b230-e7d7c36a779b\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:12:54.413Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/clear  ', '{}'],
        ['2022-12-22T08:12:54.419Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/clear (7ms)', '{ value: null }'],
        ['2022-12-22T08:12:54.419Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/value  ', '{\n     text: \'nightwatch\',\n     value: [\n       \'n\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\'\n     ]\n  }'],
        ['2022-12-22T08:12:54.433Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/value (14ms)', '{ value: null }'],
        ['2022-12-22T08:12:54.436Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'button[type=submit]\' }'],
        ['2022-12-22T08:12:54.437Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2db1076f-3aa3-457d-9eea-3244bd61f510\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:12:54.438Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2db1076f-3aa3-457d-9eea-3244bd61f510\',\n         ELEMENT: \'2db1076f-3aa3-457d-9eea-3244bd61f510\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:12:54.442Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (4ms)', '{ value: true }'],
        ['2022-12-22T08:12:54.444Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'button[type=submit]\' }'],
        ['2022-12-22T08:12:54.448Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (4ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2db1076f-3aa3-457d-9eea-3244bd61f510\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:12:54.449Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/2db1076f-3aa3-457d-9eea-3244bd61f510/click  ', '{}'],
        ['2022-12-22T08:13:09.839Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/2db1076f-3aa3-457d-9eea-3244bd61f510/click (15390ms)', '{ value: null }'],
        ['2022-12-22T08:13:09.843Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'.layout__content\' }'],
        ['2022-12-22T08:13:09.846Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (4ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9275e380-10a2-4a89-8a2e-ba2c0d54c9b8\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:13:09.846Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/9275e380-10a2-4a89-8a2e-ba2c0d54c9b8/text  ', '\'\''],
        ['2022-12-22T08:13:10.135Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/9275e380-10a2-4a89-8a2e-ba2c0d54c9b8/text (287ms)', '{\n     value: \'Search\\n\' +\n       \'https://nightwatchjs.org\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwa...\',\n     suppressBase64Data: true\n  }'],
        ['2022-12-22T08:13:10.139Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'body\' }'],
        ['2022-12-22T08:13:10.142Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'51b2761e-4769-485c-9591-ad7fe1eb1b0d\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:13:10.143Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'51b2761e-4769-485c-9591-ad7fe1eb1b0d\',\n         ELEMENT: \'51b2761e-4769-485c-9591-ad7fe1eb1b0d\'\n       }\n     ]\n  }'],
        ['2022-12-22T08:13:10.147Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (4ms)', '{ value: true }'],
        ['2022-12-22T08:13:10.149Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:10.151Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (2ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:10.655Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:10.660Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:11.164Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:11.167Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (3ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:11.669Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:11.683Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (14ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:12.187Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:12.191Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:12.696Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:12.701Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:13.206Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:13.211Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (6ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:13.717Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:13.721Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:14.225Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:14.230Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:14.735Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:14.740Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:15.244Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
        ['2022-12-22T08:13:15.248Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
        ['2022-12-22T08:13:15.316Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/screenshot  ', '\'\''],
        ['2022-12-22T08:13:15.523Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/screenshot (135ms)', '{\n     value: \'iVBORw0KGgoAAAANSUhEUgAACgAAAAZWCAYAAABgI/pGAAAgAElEQVR4XuydB3xT1RfHTxfQARQ6KC2bsrcgIKiggAKCypApU0TZ...\',\n     suppressBase64Data: true\n  }'],
        ['2022-12-22T08:13:15.537Z', '  Request DELETE /session/5ce15e96-1745-4071-b0ba-a21522f69cef  ', '\'\''],
        ['2022-12-22T08:13:16.302Z', '  Response 200 DELETE /session/5ce15e96-1745-4071-b0ba-a21522f69cef (765ms)', '{ value: null }']
      ],
      'globalErrorRegister': ['   \u001b[1;31m→ ✖ \u001b[1;31mNightwatchAssertError\u001b[0m\n   \u001b[0;31mTesting if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m\u001b[0m\n\u001b[0;33m\n    Error location:\u001b[0m\n    /Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:\n    –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n     20 |     browser\n     21 |       .waitForElementVisible(\'body\')\n    \u001b[0;37m\u001b[41m 22 |       .assert.titleContains(\'foo\') \u001b[0m\n     23 |       .assert.visible(\'input[type=search]\')\n     24 |       .setValue(\'input[type=search]\', \'nightwatch\')\n    –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n\u001b[0m']
    }
  },
  'modulesWithEnv': {
    'chrome': {
      'ecosia': {
        'reportPrefix': 'CHROME_108.0.5359.124__',
        'assertionsCount': 7,
        'lastError': {
          'name': 'NightwatchAssertError',
          'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5095ms)\u001b[0m',
          'showDiff': false,
          'abortOnFailure': true,
          'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
        },
        'skipped': [],
        'time': '13.74',
        'timeMs': 13738,
        'completed': {
          'Demo test ecosia.org': {
            'time': '8.146',
            'assertions': [{
              'name': 'NightwatchAssertError',
              'message': 'Element <body> was visible after 24 milliseconds.',
              'stackTrace': '',
              'fullMsg': 'Element <body> was visible after 24 milliseconds.',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
              'stackTrace': '',
              'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(20ms)\u001b[0m',
              'stackTrace': '',
              'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(20ms)\u001b[0m',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(13ms)\u001b[0m',
              'stackTrace': '',
              'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(13ms)\u001b[0m',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(90ms)\u001b[0m',
              'stackTrace': '',
              'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(90ms)\u001b[0m',
              'failure': false
            }],
            'commands': [],
            'passed': 5,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 5,
            'status': 'pass',
            'steps': [],
            'stackTrace': '',
            'testcases': {
              'Demo test ecosia.org': {
                'time': '8.146',
                'assertions': [{
                  'name': 'NightwatchAssertError',
                  'message': 'Element <body> was visible after 24 milliseconds.',
                  'stackTrace': '',
                  'fullMsg': 'Element <body> was visible after 24 milliseconds.',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(20ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(20ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(13ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(13ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(90ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(90ms)\u001b[0m',
                  'failure': false
                }],
                'tests': 5,
                'commands': [],
                'passed': 5,
                'errors': 0,
                'failed': 0,
                'skipped': 0,
                'status': 'pass',
                'steps': [],
                'stackTrace': '',
                'timeMs': 8146,
                'startTimestamp': 'Thu, 22 Dec 2022 08:12:57 GMT',
                'endTimestamp': 'Thu, 22 Dec 2022 08:13:06 GMT'
              }
            },
            'timeMs': 8146,
            'startTimestamp': 'Thu, 22 Dec 2022 08:12:57 GMT',
            'endTimestamp': 'Thu, 22 Dec 2022 08:13:06 GMT'
          },
          'Demo test ecosia.org fail': {
            'time': '5.592',
            'assertions': [{
              'name': 'NightwatchAssertError',
              'message': 'Element <body> was visible after 9 milliseconds.',
              'stackTrace': '',
              'fullMsg': 'Element <body> was visible after 9 milliseconds.',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5095ms)\u001b[0m',
              'stackTrace': '    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
              'fullMsg': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5095ms)\u001b[0m',
              'failure': 'Expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web"',
              'screenshots': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134311-GMT+0530.png']
            }],
            'commands': [],
            'passed': 1,
            'errors': 0,
            'failed': 1,
            'skipped': 0,
            'tests': 2,
            'status': 'fail',
            'steps': [],
            'stackTrace': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
            'testcases': {
              'Demo test ecosia.org': {
                'time': '8.146',
                'assertions': [{
                  'name': 'NightwatchAssertError',
                  'message': 'Element <body> was visible after 24 milliseconds.',
                  'stackTrace': '',
                  'fullMsg': 'Element <body> was visible after 24 milliseconds.',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(20ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(20ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(13ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(13ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(90ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(90ms)\u001b[0m',
                  'failure': false
                }],
                'tests': 5,
                'commands': [],
                'passed': 5,
                'errors': 0,
                'failed': 0,
                'skipped': 0,
                'status': 'pass',
                'steps': [],
                'stackTrace': '',
                'timeMs': 8146,
                'startTimestamp': 'Thu, 22 Dec 2022 08:12:57 GMT',
                'endTimestamp': 'Thu, 22 Dec 2022 08:13:06 GMT'
              },
              'Demo test ecosia.org fail': {
                'time': '5.592',
                'assertions': [{
                  'name': 'NightwatchAssertError',
                  'message': 'Element <body> was visible after 9 milliseconds.',
                  'stackTrace': '',
                  'fullMsg': 'Element <body> was visible after 9 milliseconds.',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5095ms)\u001b[0m',
                  'stackTrace': '    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
                  'fullMsg': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5095ms)\u001b[0m',
                  'failure': 'Expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web"',
                  'screenshots': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134311-GMT+0530.png']
                }],
                'tests': 2,
                'commands': [],
                'passed': 1,
                'errors': 0,
                'failed': 1,
                'skipped': 0,
                'status': 'fail',
                'steps': [],
                'stackTrace': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
                'lastError': {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5095ms)\u001b[0m',
                  'showDiff': false,
                  'abortOnFailure': true,
                  'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
                },
                'timeMs': 5592,
                'startTimestamp': 'Thu, 22 Dec 2022 08:13:06 GMT',
                'endTimestamp': 'Thu, 22 Dec 2022 08:13:11 GMT'
              }
            },
            'lastError': {
              'name': 'NightwatchAssertError',
              'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5095ms)\u001b[0m',
              'showDiff': false,
              'abortOnFailure': true,
              'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
            },
            'timeMs': 5592,
            'startTimestamp': 'Thu, 22 Dec 2022 08:13:06 GMT',
            'endTimestamp': 'Thu, 22 Dec 2022 08:13:11 GMT'
          }
        },
        'completedSections': {
          '__global_beforeEach_hook': {
            'time': 0,
            'assertions': [],
            'commands': [],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          },
          '__before_hook': {
            'time': 0,
            'assertions': [],
            'commands': [{
              'name': 'navigateTo',
              'args': ['https://www.ecosia.org/'],
              'startTime': 1671696761632,
              'endTime': 1671696777891,
              'elapsedTime': 16259,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          },
          'Demo test ecosia.org': {
            'time': 0,
            'assertions': [],
            'commands': [{
              'name': 'waitForElementVisible',
              'args': ['body'],
              'startTime': 1671696777895,
              'endTime': 1671696777921,
              'elapsedTime': 26,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.titleContains',
              'args': ['Ecosia'],
              'startTime': 1671696777921,
              'endTime': 1671696777928,
              'elapsedTime': 7,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.visible',
              'args': ['input[type=search]'],
              'startTime': 1671696777928,
              'endTime': 1671696777949,
              'elapsedTime': 21,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'setValue',
              'args': ['input[type=search]', 'nightwatch'],
              'startTime': 1671696777949,
              'endTime': 1671696778059,
              'elapsedTime': 110,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.visible',
              'args': ['button[type=submit]'],
              'startTime': 1671696778059,
              'endTime': 1671696778074,
              'elapsedTime': 15,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'click',
              'args': ['button[type=submit]'],
              'startTime': 1671696778074,
              'endTime': 1671696785948,
              'elapsedTime': 7874,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.textContains',
              'args': ['.layout__content', 'Nightwatch.js'],
              'startTime': 1671696785949,
              'endTime': 1671696786039,
              'elapsedTime': 90,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          },
          'Demo test ecosia.org fail': {
            'time': 0,
            'assertions': [],
            'commands': [{
              'name': 'waitForElementVisible',
              'args': ['body'],
              'startTime': 1671696786041,
              'endTime': 1671696786050,
              'elapsedTime': 9,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.titleContains',
              'args': ['foo'],
              'startTime': 1671696786050,
              'endTime': 1671696791152,
              'elapsedTime': 5102,
              'status': 'fail',
              'result': {
                'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5095ms)\u001b[0m',
                'showDiff': false,
                'name': 'NightwatchAssertError',
                'abortOnFailure': true,
                'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
              },
              'screenshot': '/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134311-GMT+0530.png'
            }, {
              'name': 'saveScreenshot',
              'args': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134311-GMT+0530.png', 'function () { [native code] }'],
              'startTime': 1671696791215,
              'endTime': 1671696791632,
              'elapsedTime': 417,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'fail'
          },
          '__after_hook': {
            'time': 0,
            'assertions': [],
            'commands': [{
              'name': 'end',
              'args': [],
              'startTime': 1671696791634,
              'endTime': 1671696791688,
              'elapsedTime': 54,
              'status': 'pass'
            }],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          },
          '__global_afterEach_hook': {
            'time': 0,
            'assertions': [],
            'commands': [],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          }
        },
        'errmessages': [],
        'testsCount': 2,
        'skippedCount': 0,
        'failedCount': 1,
        'errorsCount': 0,
        'passedCount': 6,
        'group': '',
        'modulePath': '/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js',
        'startTimestamp': 'Thu, 22 Dec 2022 08:12:40 GMT',
        'endTimestamp': 'Thu, 22 Dec 2022 08:13:11 GMT',
        'sessionCapabilities': {
          'acceptInsecureCerts': false,
          'browserName': 'chrome',
          'browserVersion': '108.0.5359.124',
          'chrome': {
            'chromedriverVersion': '108.0.5359.71 (1e0e3868ee06e91ad636a874420e3ca3ae3756ac-refs/branch-heads/5359@{#1016})',
            'userDataDir': '/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/.com.google.Chrome.I4lvi3'
          },
          'goog:chromeOptions': {
            'debuggerAddress': 'localhost:59791'
          },
          'networkConnectionEnabled': false,
          'pageLoadStrategy': 'normal',
          'platformName': 'mac os x',
          'proxy': {},
          'setWindowRect': true,
          'strictFileInteractability': false,
          'timeouts': {
            'implicit': 0,
            'pageLoad': 300000,
            'script': 30000
          },
          'unhandledPromptBehavior': 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:virtualAuthenticators': true
        },
        'sessionId': 'b798ac620a723364eefa550fe820baef',
        'projectName': '',
        'buildName': '',
        'testEnv': 'chrome',
        'isMobile': false,
        'status': 'fail',
        'seleniumLog': '/Users/binayakghosh/projects/nightwatch-copy/logs/ecosia_chromedriver.log',
        'tests': 2,
        'failures': 1,
        'errors': 0,
        'httpOutput': [
          ['2022-12-22T08:12:40.323Z', '  Request <b><span style="color:#0AA">POST /session  </span></b>', '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'],
          ['2022-12-22T08:12:41.627Z', '  Response 200 POST /session (1305ms)', '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;108.0.5359.124&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;108.0.5359.71 (1e0e3868ee06e91ad636a874420e3ca3ae3756ac-refs/branch-heads/5359@{#1016})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/.com.google.Chrome.I4lvi3&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:59791&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;b798ac620a723364eefa550fe820baef&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:41.635Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/url  </span></b>', '{ url: <span style="color:#0A0">&#39;https://www.ecosia.org/&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:57.890Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/url (16256ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
          ['2022-12-22T08:12:57.898Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:57.908Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (11ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;608b7fc9-e6cd-42c3-87c0-cb8d80dd1451&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:57.910Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;608b7fc9-e6cd-42c3-87c0-cb8d80dd1451&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;608b7fc9-e6cd-42c3-87c0-cb8d80dd1451&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:57.920Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/execute/sync (10ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:57.922Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:12:57.926Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (4ms)', '{ value: <span style="color:#0A0">&#39;Ecosia - the search engine that plants trees&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:57.930Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:57.938Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (8ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:57.939Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:57.947Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/execute/sync (9ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:57.950Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:57.954Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (4ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:57.955Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/element/ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b/clear  </span></b>', '{}'],
          ['2022-12-22T08:12:57.971Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/element/ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b/clear (16ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
          ['2022-12-22T08:12:57.971Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/element/ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b/value  </span></b>', '{\n     text: <span style="color:#0A0">&#39;nightwatch&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:58.059Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/element/ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b/value (88ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
          ['2022-12-22T08:12:58.061Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:58.066Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (5ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b97d3e55-78a3-45e4-944d-2c467dbd0b7e&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:58.067Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b97d3e55-78a3-45e4-944d-2c467dbd0b7e&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;b97d3e55-78a3-45e4-944d-2c467dbd0b7e&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:58.072Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/execute/sync (5ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:58.074Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:58.077Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (3ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b97d3e55-78a3-45e4-944d-2c467dbd0b7e&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:58.077Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/element/b97d3e55-78a3-45e4-944d-2c467dbd0b7e/click  </span></b>', '{}'],
          ['2022-12-22T08:13:05.948Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/element/b97d3e55-78a3-45e4-944d-2c467dbd0b7e/click (7871ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
          ['2022-12-22T08:13:05.951Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;.layout__content&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:13:05.959Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (8ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;54648a7a-b47c-4ff8-996d-270526697f01&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:13:05.960Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/element/54648a7a-b47c-4ff8-996d-270526697f01/text  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:06.038Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/element/54648a7a-b47c-4ff8-996d-270526697f01/text (79ms)', '{\n     value: <span style="color:#0A0">&#39;Search\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;https://nightwatchjs.org\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwa...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:13:06.042Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:13:06.045Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (4ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b238a104-4c12-4f2c-94d9-95df4bd24ddf&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:13:06.045Z', '  Request <b><span style="color:#0AA">POST /session/b798ac620a723364eefa550fe820baef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b238a104-4c12-4f2c-94d9-95df4bd24ddf&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;b238a104-4c12-4f2c-94d9-95df4bd24ddf&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:13:06.050Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/execute/sync (5ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:06.052Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:06.054Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (2ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:06.561Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:06.569Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (8ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:07.075Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:07.081Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (7ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:07.585Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:07.587Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (3ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:08.092Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:08.098Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (7ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:08.603Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:08.608Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (6ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:09.111Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:09.113Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (2ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:09.617Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:09.619Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (3ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:10.121Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:10.124Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (3ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:10.629Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:10.635Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (7ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:11.140Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:11.145Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (6ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:11.217Z', '  Request <b><span style="color:#0AA">GET /session/b798ac620a723364eefa550fe820baef/screenshot  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:11.622Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/screenshot (336ms)', '{\n     value: <span style="color:#0A0">&#39;iVBORw0KGgoAAAANSUhEUgAACWAAAAY6CAYAAABXEFcWAAABKWlDQ1BTa2lhAAAokX2QsUvDUBCHP0sXtYuo6OCQsYuaVExb1MFW...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'],
          ['2022-12-22T08:13:11.636Z', '  Request <b><span style="color:#0AA">DELETE /session/b798ac620a723364eefa550fe820baef  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:11.688Z', '  Response 200 DELETE /session/b798ac620a723364eefa550fe820baef (52ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>']
        ],
        'rawHttpOutput': [
          ['2022-12-22T08:12:40.323Z', '  Request POST /session  ', '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'],
          ['2022-12-22T08:12:41.627Z', '  Response 200 POST /session (1305ms)', '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'108.0.5359.124\',\n         chrome: {\n           chromedriverVersion: \'108.0.5359.71 (1e0e3868ee06e91ad636a874420e3ca3ae3756ac-refs/branch-heads/5359@{#1016})\',\n           userDataDir: \'/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/.com.google.Chrome.I4lvi3\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:59791\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'b798ac620a723364eefa550fe820baef\'\n     }\n  }'],
          ['2022-12-22T08:12:41.635Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/url  ', '{ url: \'https://www.ecosia.org/\' }'],
          ['2022-12-22T08:12:57.890Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/url (16256ms)', '{ value: null }'],
          ['2022-12-22T08:12:57.898Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/elements  ', '{ using: \'css selector\', value: \'body\' }'],
          ['2022-12-22T08:12:57.908Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (11ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'608b7fc9-e6cd-42c3-87c0-cb8d80dd1451\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:57.910Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'608b7fc9-e6cd-42c3-87c0-cb8d80dd1451\',\n         ELEMENT: \'608b7fc9-e6cd-42c3-87c0-cb8d80dd1451\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:57.920Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/execute/sync (10ms)', '{ value: true }'],
          ['2022-12-22T08:12:57.922Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:12:57.926Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (4ms)', '{ value: \'Ecosia - the search engine that plants trees\' }'],
          ['2022-12-22T08:12:57.930Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/elements  ', '{ using: \'css selector\', value: \'input[type=search]\' }'],
          ['2022-12-22T08:12:57.938Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (8ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:57.939Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b\',\n         ELEMENT: \'ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:57.947Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/execute/sync (9ms)', '{ value: true }'],
          ['2022-12-22T08:12:57.950Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/elements  ', '{ using: \'css selector\', value: \'input[type=search]\' }'],
          ['2022-12-22T08:12:57.954Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (4ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:57.955Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/element/ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b/clear  ', '{}'],
          ['2022-12-22T08:12:57.971Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/element/ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b/clear (16ms)', '{ value: null }'],
          ['2022-12-22T08:12:57.971Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/element/ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b/value  ', '{\n     text: \'nightwatch\',\n     value: [\n       \'n\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\'\n     ]\n  }'],
          ['2022-12-22T08:12:58.059Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/element/ba89a8cd-5bf4-4666-85d1-01e1e7b3d97b/value (88ms)', '{ value: null }'],
          ['2022-12-22T08:12:58.061Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/elements  ', '{ using: \'css selector\', value: \'button[type=submit]\' }'],
          ['2022-12-22T08:12:58.066Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (5ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b97d3e55-78a3-45e4-944d-2c467dbd0b7e\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:58.067Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b97d3e55-78a3-45e4-944d-2c467dbd0b7e\',\n         ELEMENT: \'b97d3e55-78a3-45e4-944d-2c467dbd0b7e\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:58.072Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/execute/sync (5ms)', '{ value: true }'],
          ['2022-12-22T08:12:58.074Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/elements  ', '{ using: \'css selector\', value: \'button[type=submit]\' }'],
          ['2022-12-22T08:12:58.077Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (3ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b97d3e55-78a3-45e4-944d-2c467dbd0b7e\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:58.077Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/element/b97d3e55-78a3-45e4-944d-2c467dbd0b7e/click  ', '{}'],
          ['2022-12-22T08:13:05.948Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/element/b97d3e55-78a3-45e4-944d-2c467dbd0b7e/click (7871ms)', '{ value: null }'],
          ['2022-12-22T08:13:05.951Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/elements  ', '{ using: \'css selector\', value: \'.layout__content\' }'],
          ['2022-12-22T08:13:05.959Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (8ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'54648a7a-b47c-4ff8-996d-270526697f01\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:13:05.960Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/element/54648a7a-b47c-4ff8-996d-270526697f01/text  ', '\'\''],
          ['2022-12-22T08:13:06.038Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/element/54648a7a-b47c-4ff8-996d-270526697f01/text (79ms)', '{\n     value: \'Search\\n\' +\n       \'https://nightwatchjs.org\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwa...\',\n     suppressBase64Data: true\n  }'],
          ['2022-12-22T08:13:06.042Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/elements  ', '{ using: \'css selector\', value: \'body\' }'],
          ['2022-12-22T08:13:06.045Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/elements (4ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b238a104-4c12-4f2c-94d9-95df4bd24ddf\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:13:06.045Z', '  Request POST /session/b798ac620a723364eefa550fe820baef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b238a104-4c12-4f2c-94d9-95df4bd24ddf\',\n         ELEMENT: \'b238a104-4c12-4f2c-94d9-95df4bd24ddf\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:13:06.050Z', '  Response 200 POST /session/b798ac620a723364eefa550fe820baef/execute/sync (5ms)', '{ value: true }'],
          ['2022-12-22T08:13:06.052Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:06.054Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (2ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:06.561Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:06.569Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (8ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:07.075Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:07.081Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (7ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:07.585Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:07.587Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (3ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:08.092Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:08.098Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (7ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:08.603Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:08.608Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (6ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:09.111Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:09.113Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (2ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:09.617Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:09.619Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (3ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:10.121Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:10.124Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (3ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:10.629Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:10.635Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (7ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:11.140Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/title  ', '\'\''],
          ['2022-12-22T08:13:11.145Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/title (6ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:11.217Z', '  Request GET /session/b798ac620a723364eefa550fe820baef/screenshot  ', '\'\''],
          ['2022-12-22T08:13:11.622Z', '  Response 200 GET /session/b798ac620a723364eefa550fe820baef/screenshot (336ms)', '{\n     value: \'iVBORw0KGgoAAAANSUhEUgAACWAAAAY6CAYAAABXEFcWAAABKWlDQ1BTa2lhAAAokX2QsUvDUBCHP0sXtYuo6OCQsYuaVExb1MFW...\',\n     suppressBase64Data: true\n  }'],
          ['2022-12-22T08:13:11.636Z', '  Request DELETE /session/b798ac620a723364eefa550fe820baef  ', '\'\''],
          ['2022-12-22T08:13:11.688Z', '  Response 200 DELETE /session/b798ac620a723364eefa550fe820baef (52ms)', '{ value: null }']
        ]
      }
    },
    'firefox': {
      'ecosia': {
        'reportPrefix': 'FIREFOX_108.0.1__',
        'assertionsCount': 7,
        'lastError': {
          'name': 'NightwatchAssertError',
          'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
          'showDiff': false,
          'abortOnFailure': true,
          'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
        },
        'skipped': [],
        'time': '21.18',
        'timeMs': 21175,
        'completed': {
          'Demo test ecosia.org': {
            'time': '15.78',
            'assertions': [{
              'name': 'NightwatchAssertError',
              'message': 'Element <body> was visible after 26 milliseconds.',
              'stackTrace': '',
              'fullMsg': 'Element <body> was visible after 26 milliseconds.',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if the page title contains \'Ecosia\' (3ms)',
              'stackTrace': '',
              'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if element <input[type=search]> is visible (14ms)',
              'stackTrace': '',
              'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if element <button[type=submit]> is visible (8ms)',
              'stackTrace': '',
              'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if element <.layout__content> contains text \'Nightwatch.js\' (295ms)',
              'stackTrace': '',
              'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
              'failure': false
            }],
            'commands': [],
            'passed': 5,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 5,
            'status': 'pass',
            'steps': [],
            'stackTrace': '',
            'testcases': {
              'Demo test ecosia.org': {
                'time': '15.78',
                'assertions': [{
                  'name': 'NightwatchAssertError',
                  'message': 'Element <body> was visible after 26 milliseconds.',
                  'stackTrace': '',
                  'fullMsg': 'Element <body> was visible after 26 milliseconds.',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
                  'failure': false
                }],
                'tests': 5,
                'commands': [],
                'passed': 5,
                'errors': 0,
                'failed': 0,
                'skipped': 0,
                'status': 'pass',
                'steps': [],
                'stackTrace': '',
                'timeMs': 15779,
                'startTimestamp': 'Thu, 22 Dec 2022 08:12:54 GMT',
                'endTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT'
              }
            },
            'timeMs': 15779,
            'startTimestamp': 'Thu, 22 Dec 2022 08:12:54 GMT',
            'endTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT'
          },
          'Demo test ecosia.org fail': {
            'time': '5.396',
            'assertions': [{
              'name': 'NightwatchAssertError',
              'message': 'Element <body> was visible after 8 milliseconds.',
              'stackTrace': '',
              'fullMsg': 'Element <body> was visible after 8 milliseconds.',
              'failure': false
            }, {
              'name': 'NightwatchAssertError',
              'message': 'Testing if the page title contains \'foo\' in 5000ms - expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web" (5100ms)',
              'stackTrace': '    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
              'fullMsg': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
              'failure': 'Expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web"',
              'screenshots': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134315-GMT+0530.png']
            }],
            'commands': [],
            'passed': 1,
            'errors': 0,
            'failed': 1,
            'skipped': 0,
            'tests': 2,
            'status': 'fail',
            'steps': [],
            'stackTrace': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
            'testcases': {
              'Demo test ecosia.org': {
                'time': '15.78',
                'assertions': [{
                  'name': 'NightwatchAssertError',
                  'message': 'Element <body> was visible after 26 milliseconds.',
                  'stackTrace': '',
                  'fullMsg': 'Element <body> was visible after 26 milliseconds.',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(3ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(14ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(8ms)\u001b[0m',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
                  'stackTrace': '',
                  'fullMsg': 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(295ms)\u001b[0m',
                  'failure': false
                }],
                'tests': 5,
                'commands': [],
                'passed': 5,
                'errors': 0,
                'failed': 0,
                'skipped': 0,
                'status': 'pass',
                'steps': [],
                'stackTrace': '',
                'timeMs': 15779,
                'startTimestamp': 'Thu, 22 Dec 2022 08:12:54 GMT',
                'endTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT'
              },
              'Demo test ecosia.org fail': {
                'time': '5.396',
                'assertions': [{
                  'name': 'NightwatchAssertError',
                  'message': 'Element <body> was visible after 8 milliseconds.',
                  'stackTrace': '',
                  'fullMsg': 'Element <body> was visible after 8 milliseconds.',
                  'failure': false
                }, {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
                  'stackTrace': '    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
                  'fullMsg': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
                  'failure': 'Expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web"',
                  'screenshots': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134315-GMT+0530.png']
                }],
                'tests': 2,
                'commands': [],
                'passed': 1,
                'errors': 0,
                'failed': 1,
                'skipped': 0,
                'status': 'fail',
                'steps': [],
                'stackTrace': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
                'lastError': {
                  'name': 'NightwatchAssertError',
                  'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
                  'showDiff': false,
                  'abortOnFailure': true,
                  'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
                },
                'timeMs': 5396,
                'startTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT',
                'endTimestamp': 'Thu, 22 Dec 2022 08:13:15 GMT'
              }
            },
            'lastError': {
              'name': 'NightwatchAssertError',
              'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
              'showDiff': false,
              'abortOnFailure': true,
              'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
            },
            'timeMs': 5396,
            'startTimestamp': 'Thu, 22 Dec 2022 08:13:10 GMT',
            'endTimestamp': 'Thu, 22 Dec 2022 08:13:15 GMT'
          }
        },
        'completedSections': {
          '__global_beforeEach_hook': {
            'time': 0,
            'assertions': [],
            'commands': [],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          },
          '__before_hook': {
            'time': 0,
            'assertions': [],
            'commands': [{
              'name': 'navigateTo',
              'args': ['https://www.ecosia.org/'],
              'startTime': 1671696762127,
              'endTime': 1671696774357,
              'elapsedTime': 12230,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          },
          'Demo test ecosia.org': {
            'time': 0,
            'assertions': [],
            'commands': [{
              'name': 'waitForElementVisible',
              'args': ['body'],
              'startTime': 1671696774361,
              'endTime': 1671696774389,
              'elapsedTime': 28,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.titleContains',
              'args': ['Ecosia'],
              'startTime': 1671696774389,
              'endTime': 1671696774395,
              'elapsedTime': 6,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.visible',
              'args': ['input[type=search]'],
              'startTime': 1671696774395,
              'endTime': 1671696774410,
              'elapsedTime': 15,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'setValue',
              'args': ['input[type=search]', 'nightwatch'],
              'startTime': 1671696774410,
              'endTime': 1671696774434,
              'elapsedTime': 24,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.visible',
              'args': ['button[type=submit]'],
              'startTime': 1671696774434,
              'endTime': 1671696774444,
              'elapsedTime': 10,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'click',
              'args': ['button[type=submit]'],
              'startTime': 1671696774444,
              'endTime': 1671696789840,
              'elapsedTime': 15396,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.textContains',
              'args': ['.layout__content', 'Nightwatch.js'],
              'startTime': 1671696789840,
              'endTime': 1671696790137,
              'elapsedTime': 297,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          },
          'Demo test ecosia.org fail': {
            'time': 0,
            'assertions': [],
            'commands': [{
              'name': 'waitForElementVisible',
              'args': ['body'],
              'startTime': 1671696790139,
              'endTime': 1671696790147,
              'elapsedTime': 8,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }, {
              'name': 'assert.titleContains',
              'args': ['foo'],
              'startTime': 1671696790147,
              'endTime': 1671696795256,
              'elapsedTime': 5109,
              'status': 'fail',
              'result': {
                'message': 'Testing if the page title contains \'foo\' in 5000ms - expected "contains \'foo\'" but got: "nightwatch - Ecosia - Web" (5100ms)',
                'showDiff': false,
                'name': 'NightwatchAssertError',
                'abortOnFailure': true,
                'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)',
                'beautifiedStack': {
                  'filePath': '/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js',
                  'error_line_number': 22,
                  'codeSnippet': [{
                    'line_number': 20,
                    'code': '    browser'
                  }, {
                    'line_number': 21,
                    'code': '      .waitForElementVisible(\'body\')'
                  }, {
                    'line_number': 22,
                    'code': '      .assert.titleContains(\'foo\')'
                  }, {
                    'line_number': 23,
                    'code': '      .assert.visible(\'input[type=search]\')'
                  }, {
                    'line_number': 24,
                    'code': '      .setValue(\'input[type=search]\', \'nightwatch\')'
                  }]
                }
              },
              'screenshot': '/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134315-GMT+0530.png'
            }, {
              'name': 'saveScreenshot',
              'args': ['/Users/binayakghosh/projects/nightwatch-copy/tests_output/screens/ecosia/Demo-test-ecosia.org-fail_FAILED_Dec-22-2022-134315-GMT+0530.png', 'function () { [native code] }'],
              'startTime': 1671696795313,
              'endTime': 1671696795533,
              'elapsedTime': 220,
              'status': 'pass',
              'result': {
                'status': 0
              }
            }],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'fail'
          },
          '__after_hook': {
            'time': 0,
            'assertions': [],
            'commands': [{
              'name': 'end',
              'args': [],
              'startTime': 1671696795535,
              'endTime': 1671696796303,
              'elapsedTime': 768,
              'status': 'pass'
            }],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          },
          '__global_afterEach_hook': {
            'time': 0,
            'assertions': [],
            'commands': [],
            'passed': 0,
            'errors': 0,
            'failed': 0,
            'skipped': 0,
            'tests': 0,
            'status': 'pass'
          }
        },
        'errmessages': [],
        'testsCount': 2,
        'skippedCount': 0,
        'failedCount': 1,
        'errorsCount': 0,
        'passedCount': 6,
        'group': '',
        'modulePath': '/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js',
        'startTimestamp': 'Thu, 22 Dec 2022 08:12:40 GMT',
        'endTimestamp': 'Thu, 22 Dec 2022 08:13:15 GMT',
        'sessionCapabilities': {
          'acceptInsecureCerts': false,
          'browserName': 'firefox',
          'browserVersion': '108.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20221215175817',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.1.0',
          'moz:processID': 1629,
          'moz:profile': '/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/rust_mozprofile7Yt8vc',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          'pageLoadStrategy': 'normal',
          'platformName': 'mac',
          'proxy': {},
          'setWindowRect': true,
          'strictFileInteractability': false,
          'timeouts': {
            'implicit': 0,
            'pageLoad': 300000,
            'script': 30000
          },
          'unhandledPromptBehavior': 'dismiss and notify'
        },
        'sessionId': '5ce15e96-1745-4071-b0ba-a21522f69cef',
        'projectName': '',
        'buildName': '',
        'testEnv': 'firefox',
        'isMobile': false,
        'status': 'fail',
        'seleniumLog': '/Users/binayakghosh/projects/nightwatch-copy/logs/ecosia_geckodriver.log',
        'tests': 2,
        'failures': 1,
        'errors': 0,
        'httpOutput': [
          ['2022-12-22T08:12:40.304Z', '  Request <b><span style="color:#0AA">POST /session  </span></b>', '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'],
          ['2022-12-22T08:12:42.123Z', '  Response 200 POST /session (1821ms)', '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;5ce15e96-1745-4071-b0ba-a21522f69cef&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;108.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20221215175817&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.1.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">1629<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/rust_mozprofile7Yt8vc&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:42.127Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/url  </span></b>', '{ url: <span style="color:#0A0">&#39;https://www.ecosia.org/&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:54.355Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/url (12228ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
          ['2022-12-22T08:12:54.364Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:54.378Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (14ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;202fb5a8-b2a0-4387-82ba-ed00eba69ef6&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:54.380Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;202fb5a8-b2a0-4387-82ba-ed00eba69ef6&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;202fb5a8-b2a0-4387-82ba-ed00eba69ef6&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:54.388Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (8ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:54.392Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:12:54.393Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (1ms)', '{ value: <span style="color:#0A0">&#39;Ecosia - the search engine that plants trees&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:54.397Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:54.400Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (3ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;7c487427-edc6-49f2-b230-e7d7c36a779b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:54.401Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;7c487427-edc6-49f2-b230-e7d7c36a779b&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;7c487427-edc6-49f2-b230-e7d7c36a779b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:54.408Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (7ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:54.410Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:54.412Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;7c487427-edc6-49f2-b230-e7d7c36a779b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:54.413Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/clear  </span></b>', '{}'],
          ['2022-12-22T08:12:54.419Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/clear (7ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
          ['2022-12-22T08:12:54.419Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/value  </span></b>', '{\n     text: <span style="color:#0A0">&#39;nightwatch&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:54.433Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/value (14ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
          ['2022-12-22T08:12:54.436Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:54.437Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2db1076f-3aa3-457d-9eea-3244bd61f510&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:54.438Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2db1076f-3aa3-457d-9eea-3244bd61f510&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;2db1076f-3aa3-457d-9eea-3244bd61f510&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:12:54.442Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (4ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:12:54.444Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:12:54.448Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (4ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2db1076f-3aa3-457d-9eea-3244bd61f510&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:12:54.449Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/2db1076f-3aa3-457d-9eea-3244bd61f510/click  </span></b>', '{}'],
          ['2022-12-22T08:13:09.839Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/2db1076f-3aa3-457d-9eea-3244bd61f510/click (15390ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'],
          ['2022-12-22T08:13:09.843Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;.layout__content&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:13:09.846Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (4ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9275e380-10a2-4a89-8a2e-ba2c0d54c9b8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:13:09.846Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/9275e380-10a2-4a89-8a2e-ba2c0d54c9b8/text  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:10.135Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/9275e380-10a2-4a89-8a2e-ba2c0d54c9b8/text (287ms)', '{\n     value: <span style="color:#0A0">&#39;Search\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;https://nightwatchjs.org\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwa...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:13:10.139Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  </span></b>', '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'],
          ['2022-12-22T08:13:10.142Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;51b2761e-4769-485c-9591-ad7fe1eb1b0d&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'],
          ['2022-12-22T08:13:10.143Z', '  Request <b><span style="color:#0AA">POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  </span></b>', '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;51b2761e-4769-485c-9591-ad7fe1eb1b0d&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;51b2761e-4769-485c-9591-ad7fe1eb1b0d&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'],
          ['2022-12-22T08:13:10.147Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (4ms)', '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:10.149Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:10.151Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (2ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:10.655Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:10.660Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:11.164Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:11.167Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (3ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:11.669Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:11.683Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (14ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:12.187Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:12.191Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:12.696Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:12.701Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:13.206Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:13.211Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (6ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:13.717Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:13.721Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:14.225Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:14.230Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:14.735Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:14.740Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:15.244Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:15.248Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: <span style="color:#0A0">&#39;nightwatch - Ecosia - Web&#39;<span style="color:#FFF"> }</span></span>'],
          ['2022-12-22T08:13:15.316Z', '  Request <b><span style="color:#0AA">GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/screenshot  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:15.523Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/screenshot (135ms)', '{\n     value: <span style="color:#0A0">&#39;iVBORw0KGgoAAAANSUhEUgAACgAAAAZWCAYAAABgI/pGAAAgAElEQVR4XuydB3xT1RfHTxfQARQ6KC2bsrcgIKiggAKCypApU0TZ...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'],
          ['2022-12-22T08:13:15.537Z', '  Request <b><span style="color:#0AA">DELETE /session/5ce15e96-1745-4071-b0ba-a21522f69cef  </span></b>', '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'],
          ['2022-12-22T08:13:16.302Z', '  Response 200 DELETE /session/5ce15e96-1745-4071-b0ba-a21522f69cef (765ms)', '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>']
        ],
        'rawHttpOutput': [
          ['2022-12-22T08:12:40.304Z', '  Request POST /session  ', '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'],
          ['2022-12-22T08:12:42.123Z', '  Response 200 POST /session (1821ms)', '{\n     value: {\n       sessionId: \'5ce15e96-1745-4071-b0ba-a21522f69cef\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'108.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20221215175817\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.1.0\',\n         \'moz:processID\': 1629,\n         \'moz:profile\': \'/var/folders/c4/v7pl5j0s34qg1yb4b34_lg300000gq/T/rust_mozprofile7Yt8vc\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'],
          ['2022-12-22T08:12:42.127Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/url  ', '{ url: \'https://www.ecosia.org/\' }'],
          ['2022-12-22T08:12:54.355Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/url (12228ms)', '{ value: null }'],
          ['2022-12-22T08:12:54.364Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'body\' }'],
          ['2022-12-22T08:12:54.378Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (14ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'202fb5a8-b2a0-4387-82ba-ed00eba69ef6\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:54.380Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'202fb5a8-b2a0-4387-82ba-ed00eba69ef6\',\n         ELEMENT: \'202fb5a8-b2a0-4387-82ba-ed00eba69ef6\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:54.388Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (8ms)', '{ value: true }'],
          ['2022-12-22T08:12:54.392Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:12:54.393Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (1ms)', '{ value: \'Ecosia - the search engine that plants trees\' }'],
          ['2022-12-22T08:12:54.397Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'input[type=search]\' }'],
          ['2022-12-22T08:12:54.400Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (3ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'7c487427-edc6-49f2-b230-e7d7c36a779b\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:54.401Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'7c487427-edc6-49f2-b230-e7d7c36a779b\',\n         ELEMENT: \'7c487427-edc6-49f2-b230-e7d7c36a779b\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:54.408Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (7ms)', '{ value: true }'],
          ['2022-12-22T08:12:54.410Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'input[type=search]\' }'],
          ['2022-12-22T08:12:54.412Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'7c487427-edc6-49f2-b230-e7d7c36a779b\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:54.413Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/clear  ', '{}'],
          ['2022-12-22T08:12:54.419Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/clear (7ms)', '{ value: null }'],
          ['2022-12-22T08:12:54.419Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/value  ', '{\n     text: \'nightwatch\',\n     value: [\n       \'n\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\'\n     ]\n  }'],
          ['2022-12-22T08:12:54.433Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/7c487427-edc6-49f2-b230-e7d7c36a779b/value (14ms)', '{ value: null }'],
          ['2022-12-22T08:12:54.436Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'button[type=submit]\' }'],
          ['2022-12-22T08:12:54.437Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2db1076f-3aa3-457d-9eea-3244bd61f510\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:54.438Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2db1076f-3aa3-457d-9eea-3244bd61f510\',\n         ELEMENT: \'2db1076f-3aa3-457d-9eea-3244bd61f510\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:54.442Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (4ms)', '{ value: true }'],
          ['2022-12-22T08:12:54.444Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'button[type=submit]\' }'],
          ['2022-12-22T08:12:54.448Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (4ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2db1076f-3aa3-457d-9eea-3244bd61f510\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:12:54.449Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/2db1076f-3aa3-457d-9eea-3244bd61f510/click  ', '{}'],
          ['2022-12-22T08:13:09.839Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/2db1076f-3aa3-457d-9eea-3244bd61f510/click (15390ms)', '{ value: null }'],
          ['2022-12-22T08:13:09.843Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'.layout__content\' }'],
          ['2022-12-22T08:13:09.846Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (4ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9275e380-10a2-4a89-8a2e-ba2c0d54c9b8\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:13:09.846Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/9275e380-10a2-4a89-8a2e-ba2c0d54c9b8/text  ', '\'\''],
          ['2022-12-22T08:13:10.135Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/element/9275e380-10a2-4a89-8a2e-ba2c0d54c9b8/text (287ms)', '{\n     value: \'Search\\n\' +\n       \'https://nightwatchjs.org\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwa...\',\n     suppressBase64Data: true\n  }'],
          ['2022-12-22T08:13:10.139Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements  ', '{ using: \'css selector\', value: \'body\' }'],
          ['2022-12-22T08:13:10.142Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/elements (2ms)', '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'51b2761e-4769-485c-9591-ad7fe1eb1b0d\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:13:10.143Z', '  Request POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync  ', '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'51b2761e-4769-485c-9591-ad7fe1eb1b0d\',\n         ELEMENT: \'51b2761e-4769-485c-9591-ad7fe1eb1b0d\'\n       }\n     ]\n  }'],
          ['2022-12-22T08:13:10.147Z', '  Response 200 POST /session/5ce15e96-1745-4071-b0ba-a21522f69cef/execute/sync (4ms)', '{ value: true }'],
          ['2022-12-22T08:13:10.149Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:10.151Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (2ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:10.655Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:10.660Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:11.164Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:11.167Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (3ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:11.669Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:11.683Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (14ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:12.187Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:12.191Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:12.696Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:12.701Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:13.206Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:13.211Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (6ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:13.717Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:13.721Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:14.225Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:14.230Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:14.735Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:14.740Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:15.244Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title  ', '\'\''],
          ['2022-12-22T08:13:15.248Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/title (5ms)', '{ value: \'nightwatch - Ecosia - Web\' }'],
          ['2022-12-22T08:13:15.316Z', '  Request GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/screenshot  ', '\'\''],
          ['2022-12-22T08:13:15.523Z', '  Response 200 GET /session/5ce15e96-1745-4071-b0ba-a21522f69cef/screenshot (135ms)', '{\n     value: \'iVBORw0KGgoAAAANSUhEUgAACgAAAAZWCAYAAABgI/pGAAAgAElEQVR4XuydB3xT1RfHTxfQARQ6KC2bsrcgIKiggAKCypApU0TZ...\',\n     suppressBase64Data: true\n  }'],
          ['2022-12-22T08:13:15.537Z', '  Request DELETE /session/5ce15e96-1745-4071-b0ba-a21522f69cef  ', '\'\''],
          ['2022-12-22T08:13:16.302Z', '  Response 200 DELETE /session/5ce15e96-1745-4071-b0ba-a21522f69cef (765ms)', '{ value: null }']
        ],
        'globalErrorRegister': ['   \u001b[1;31m→ ✖ \u001b[1;31mNightwatchAssertError\u001b[0m\n   \u001b[0;31mTesting if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m\u001b[0m\n\u001b[0;33m\n    Error location:\u001b[0m\n    /Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:\n    –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n     20 |     browser\n     21 |       .waitForElementVisible(\'body\')\n    \u001b[0;37m\u001b[41m 22 |       .assert.titleContains(\'foo\') \u001b[0m\n     23 |       .assert.visible(\'input[type=search]\')\n     24 |       .setValue(\'input[type=search]\', \'nightwatch\')\n    –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n\u001b[0m']
      }
    }
  },
  'lastError': {
    'name': 'NightwatchAssertError',
    'message': 'Testing if the page title contains \u001b[0;33m\'foo\'\u001b[0m in 5000ms - expected \u001b[0;32m"contains \'foo\'"\u001b[0m but got: \u001b[0;31m"nightwatch - Ecosia - Web"\u001b[0m \u001b[0;90m(5100ms)\u001b[0m',
    'showDiff': false,
    'abortOnFailure': true,
    'stack': 'Error\n    at Proxy.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/lib/api/index.js:149:30)\n    at DescribeInstance.<anonymous> (/Users/binayakghosh/projects/nightwatch-copy/examples/tests/ecosia.js:22:15)\n    at Context.call (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/context.js:476:35)\n    at TestCase.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:80)\n    at Runnable.run (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:893:49)\n    at TestSuite.handleRunnable (/Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:908:33)\n    at /Users/binayakghosh/projects/nightwatch-copy/lib/testsuite/index.js:743:21\n    at async DefaultRunner.runTestSuite (/Users/binayakghosh/projects/nightwatch-copy/lib/runner/test-runners/default.js:76:7)'
  }
};