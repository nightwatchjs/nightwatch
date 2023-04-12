module.exports = {
  passed: 40,
  failed: 3,
  errors: 0,
  skipped: 2,
  tests: 0,
  assertions: 43,
  errmessages: [
  ],
  modules: {
    selectElement: {
      reportPrefix: 'FIREFOX_111.0.1__',
      assertionsCount: 1,
      lastError: null,
      skipped: [
      ],
      time: '1.082',
      timeMs: 1082,
      completed: {
        demoTest: {
          time: '1.082',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Forth option is selected (4ms)',
              stackTrace: '',
              fullMsg: 'Forth option is selected \u001b[0;90m(4ms)\u001b[0m',
              failure: false
            }
          ],
          commands: [
          ],
          passed: 1,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 1,
          status: 'pass',
          steps: [
          ],
          stackTrace: '',
          testcases: {
            demoTest: {
              time: '1.082',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Forth option is selected \u001b[0;90m(4ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Forth option is selected \u001b[0;90m(4ms)\u001b[0m',
                  failure: false
                }
              ],
              tests: 1,
              commands: [
              ],
              passed: 1,
              errors: 0,
              failed: 0,
              skipped: 0,
              status: 'pass',
              steps: [
              ],
              stackTrace: '',
              timeMs: 1082,
              startTimestamp: 'Thu, 06 Apr 2023 10:19:41 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:19:42 GMT'
            }
          },
          timeMs: 1082,
          startTimestamp: 'Thu, 06 Apr 2023 10:19:41 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:19:42 GMT'
        }
      },
      completedSections: {
        __global_beforeEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __before_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        demoTest: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'url',
              args: [
                'https://www.selenium.dev/selenium/web/formPage.html'
              ],
              startTime: 1680776381835,
              endTime: 1680776382638,
              elapsedTime: 803,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'element().getAttribute',
              args: [
                'tagName'
              ],
              startTime: 1680776382642,
              endTime: 1680776382669,
              elapsedTime: 27,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'element().findElement',
              args: [
                '[object Object]'
              ],
              startTime: 1680776382669,
              endTime: 1680776382674,
              elapsedTime: 5,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'perform',
              args: [
                'function () { [native code] }'
              ],
              startTime: 1680776382639,
              endTime: 1680776382900,
              elapsedTime: 261,
              status: 'pass'
            },
            {
              name: 'element().findElement',
              args: [
                '[object Object]'
              ],
              startTime: 1680776382901,
              endTime: 1680776382905,
              elapsedTime: 4,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'assert.selected',
              args: [
                '[object Object]',
                'Forth option is selected'
              ],
              startTime: 1680776382906,
              endTime: 1680776382912,
              elapsedTime: 6,
              status: 'pass',
              result: {
                status: 0
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __after_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __global_afterEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'end',
              args: [
                'true'
              ],
              startTime: 1680776382919,
              endTime: 1680776384029,
              elapsedTime: 1110,
              status: 'pass'
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        }
      },
      errmessages: [
      ],
      testsCount: 1,
      skippedCount: 0,
      failedCount: 0,
      errorsCount: 0,
      passedCount: 1,
      group: '',
      modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/selectElement.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:19:40 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:19:42 GMT',
      sessionCapabilities: {
        acceptInsecureCerts: false,
        browserName: 'firefox',
        browserVersion: '111.0.1',
        'moz:accessibilityChecks': false,
        'moz:buildID': '20230321111920',
        'moz:geckodriverVersion': '0.32.0',
        'moz:headless': false,
        'moz:platformVersion': '22.3.0',
        'moz:processID': 93822,
        'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileHW3NPW',
        'moz:shutdownTimeout': 60000,
        'moz:useNonSpecCompliantPointerOrigin': false,
        'moz:webdriverClick': true,
        'moz:windowless': false,
        pageLoadStrategy: 'normal',
        platformName: 'mac',
        proxy: {
        },
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000
        },
        unhandledPromptBehavior: 'dismiss and notify'
      },
      sessionId: 'a1f5ad5e-07f5-4800-ba12-b7a271e609a9',
      projectName: '',
      buildName: '',
      testEnv: 'firefox',
      isMobile: false,
      status: 'pass',
      seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/selectElement_geckodriver.log',
      host: 'localhost',
      tests: 1,
      failures: 0,
      errors: 0,
      httpOutput: [
        [
          '2023-04-06T10:19:40.629Z',
          '  Request <b><span style="color:#0AA">POST /session  </span></b>',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
        ],
        [
          '2023-04-06T10:19:41.827Z',
          '  Response 200 POST /session (1199ms)',
          '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;a1f5ad5e-07f5-4800-ba12-b7a271e609a9&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93822<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileHW3NPW&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:41.837Z',
          '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/url  </span></b>',
          '{ url: <span style="color:#0A0">&#39;https://www.selenium.dev/selenium/web/formPage.html&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:42.638Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/url (801ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:42.643Z',
          '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;select[name=selectomatic]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.660Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/elements (17ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ab344c02-89da-455d-a6d9-f3d066201c38&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.661Z',
          '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var h=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=h;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (43188 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ab344c02-89da-455d-a6d9-f3d066201c38&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;ab344c02-89da-455d-a6d9-f3d066201c38&#39;<span style="color:#FFF">\n       },\n       <span style="color:#0A0">&#39;tagName&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.668Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/execute/sync (7ms)',
          '{ value: <span style="color:#0A0">&#39;SELECT&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:42.670Z',
          '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;xpath&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;./option[. = &quot;Four&quot;]|./option[normalize-space(text()) = &quot;Four&quot;]|./optgroup/option[. = &quot;Four&quot;]|./optgroup/option[normalize-space(text()) = &quot;Four&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.674Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element (4ms)',
          '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f5aa1430-b88f-46cf-9816-c48c2ef74bfd&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.675Z',
          '  Request <b><span style="color:#0AA">GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:42.678Z',
          '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected (3ms)',
          '{ value: <span style="color:#A50">false<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:42.679Z',
          '  Request <b><span style="color:#0AA">GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/enabled  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:42.687Z',
          '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/enabled (9ms)',
          '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:42.688Z',
          '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/click  </span></b>',
          '{}'
        ],
        [
          '2023-04-06T10:19:42.900Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/click (212ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:42.901Z',
          '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;option[value=four]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.905Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element (4ms)',
          '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f5aa1430-b88f-46cf-9816-c48c2ef74bfd&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.909Z',
          '  Request <b><span style="color:#0AA">GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:42.911Z',
          '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected (3ms)',
          '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:42.921Z',
          '  Request <b><span style="color:#0AA">DELETE /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:44.026Z',
          '  Response 200 DELETE /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9 (1105ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ]
      ],
      rawHttpOutput: [
        [
          '2023-04-06T10:19:40.629Z',
          '  Request POST /session  ',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
        ],
        [
          '2023-04-06T10:19:41.827Z',
          '  Response 200 POST /session (1199ms)',
          '{\n     value: {\n       sessionId: \'a1f5ad5e-07f5-4800-ba12-b7a271e609a9\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93822,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileHW3NPW\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:41.837Z',
          '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/url  ',
          '{ url: \'https://www.selenium.dev/selenium/web/formPage.html\' }'
        ],
        [
          '2023-04-06T10:19:42.638Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/url (801ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:42.643Z',
          '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/elements  ',
          '{ using: \'css selector\', value: \'select[name=selectomatic]\' }'
        ],
        [
          '2023-04-06T10:19:42.660Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/elements (17ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ab344c02-89da-455d-a6d9-f3d066201c38\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:42.661Z',
          '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var h=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=h;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (43188 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ab344c02-89da-455d-a6d9-f3d066201c38\',\n         ELEMENT: \'ab344c02-89da-455d-a6d9-f3d066201c38\'\n       },\n       \'tagName\'\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:42.668Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/execute/sync (7ms)',
          '{ value: \'SELECT\' }'
        ],
        [
          '2023-04-06T10:19:42.670Z',
          '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element  ',
          '{\n     using: \'xpath\',\n     value: \'./option[. = &quot;Four&quot;]|./option[normalize-space(text()) = &quot;Four&quot;]|./optgroup/option[. = &quot;Four&quot;]|./optgroup/option[normalize-space(text()) = &quot;Four&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:42.674Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element (4ms)',
          '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'f5aa1430-b88f-46cf-9816-c48c2ef74bfd\'\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:42.675Z',
          '  Request GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:42.678Z',
          '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected (3ms)',
          '{ value: false }'
        ],
        [
          '2023-04-06T10:19:42.679Z',
          '  Request GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/enabled  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:42.687Z',
          '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/enabled (9ms)',
          '{ value: true }'
        ],
        [
          '2023-04-06T10:19:42.688Z',
          '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/click  ',
          '{}'
        ],
        [
          '2023-04-06T10:19:42.900Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/click (212ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:42.901Z',
          '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element  ',
          '{ using: \'css selector\', value: \'option[value=four]\' }'
        ],
        [
          '2023-04-06T10:19:42.905Z',
          '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element (4ms)',
          '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'f5aa1430-b88f-46cf-9816-c48c2ef74bfd\'\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:42.909Z',
          '  Request GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:42.911Z',
          '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected (3ms)',
          '{ value: true }'
        ],
        [
          '2023-04-06T10:19:42.921Z',
          '  Request DELETE /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:44.026Z',
          '  Response 200 DELETE /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9 (1105ms)',
          '{ value: null }'
        ]
      ]
    },
    chromeCDP_example: {
      reportPrefix: 'FIREFOX_111.0.1__',
      assertionsCount: 1,
      lastError: {
        name: 'NightwatchAssertError',
        message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
        showDiff: false,
        abortOnFailure: true,
        stack: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)'
      },
      skipped: [
      ],
      time: '4.669',
      timeMs: 4669,
      completed: {
        'using CDP DOM Snapshot': {
          time: '4.669',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected "documents,strings" but got: "abortOnFailure" (4ms)',
              stackTrace: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
              fullMsg: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
              failure: 'Expected "documents,strings" but got: "abortOnFailure"',
              screenshots: [
                '/Users/vaibhavsingh/Dev/nightwatch/screens/chromeCDP_example/using-CDP-DOM-Snapshot_FAILED_Apr-06-2023-154931-GMT+0530.png'
              ]
            }
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 1,
          skipped: 0,
          tests: 1,
          status: 'fail',
          steps: [
          ],
          stackTrace: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
          testcases: {
            'using CDP DOM Snapshot': {
              time: '4.669',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                  stackTrace: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
                  fullMsg: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                  failure: 'Expected "documents,strings" but got: "abortOnFailure"',
                  screenshots: [
                    '/Users/vaibhavsingh/Dev/nightwatch/screens/chromeCDP_example/using-CDP-DOM-Snapshot_FAILED_Apr-06-2023-154931-GMT+0530.png'
                  ]
                }
              ],
              tests: 1,
              commands: [
              ],
              passed: 0,
              errors: 0,
              failed: 1,
              skipped: 0,
              status: 'fail',
              steps: [
              ],
              stackTrace: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
              lastError: {
                name: 'NightwatchAssertError',
                message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                showDiff: false,
                abortOnFailure: true,
                stack: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)'
              },
              timeMs: 4669,
              startTimestamp: 'Thu, 06 Apr 2023 10:19:27 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:19:32 GMT'
            }
          },
          lastError: {
            name: 'NightwatchAssertError',
            message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
            showDiff: false,
            abortOnFailure: true,
            stack: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)'
          },
          timeMs: 4669,
          startTimestamp: 'Thu, 06 Apr 2023 10:19:27 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:19:32 GMT'
        }
      },
      completedSections: {
        __global_beforeEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __before_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        'using CDP DOM Snapshot': {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'navigateTo',
              args: [
                'https://nightwatchjs.org'
              ],
              startTime: 1680776367423,
              endTime: 1680776371918,
              elapsedTime: 4495,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'chrome.sendAndGetDevToolsCommand',
              args: [
                'DOMSnapshot.captureSnapshot',
                '[object Object]'
              ],
              startTime: 1680776371920,
              endTime: 1680776371920,
              elapsedTime: 0,
              status: 'fail',
              result: {
                message: 'Error while running "chrome.sendAndGetDevToolsCommand" command: [TypeError] nightwatchInstance.transport.driver[commandName] is not a function',
                name: 'TypeError',
                abortOnFailure: true,
                stack: 'TypeError: Error while running "chrome.sendAndGetDevToolsCommand" command: [TypeError] nightwatchInstance.transport.driver[commandName] is not a function\n    at ChromeCommandLoader.commandFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/_base-loader.js:38:62)\n    at TreeNode.invokeCommand (/Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:154:31)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:177:12\n    at new Promise (<anonymous>)\n    at TreeNode.execute (/Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:176:12)\n    at TreeNode.runCommand (/Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:138:27)\n    at TreeNode.run (/Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:112:17)\n    at AsyncTree.runChildNode (/Users/vaibhavsingh/Dev/nightwatch/lib/core/asynctree.js:118:31)\n    at AsyncTree.traverse (/Users/vaibhavsingh/Dev/nightwatch/lib/core/asynctree.js:48:33)\n    at CommandQueue.traverse (/Users/vaibhavsingh/Dev/nightwatch/lib/core/queue.js:97:8)',
                beautifiedStack: {
                  filePath: '/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/_base-loader.js',
                  error_line_number: 38,
                  codeSnippet: [
                    {
                      line_number: 36,
                      code: '  static createDriverCommand(nightwatchInstance, commandName) {'
                    },
                    {
                      line_number: 37,
                      code: '    return function commandFn({args}) {'
                    },
                    {
                      line_number: 38,
                      code: '      return nightwatchInstance.transport.driver[commandName](...args).catch((error) => {'
                    },
                    {
                      line_number: 39,
                      code: '        if (error.remoteStacktrace) {'
                    },
                    {
                      line_number: 40,
                      code: '          delete error.remoteStacktrace;'
                    }
                  ]
                }
              }
            },
            {
              name: 'assert.deepStrictEqual',
              args: [
              ],
              startTime: 1680776371927,
              endTime: 1680776371930,
              elapsedTime: 3,
              status: 'fail',
              result: {
                message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected "documents,strings" but got: "abortOnFailure" (4ms)',
                showDiff: false,
                name: 'NightwatchAssertError',
                abortOnFailure: true,
                stack: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
                beautifiedStack: {
                  filePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js',
                  error_line_number: 10,
                  codeSnippet: [
                    {
                      line_number: 8,
                      code: '    });'
                    },
                    {
                      line_number: 9,
                      code: ''
                    },
                    {
                      line_number: 10,
                      code: '    browser.assert.deepStrictEqual(Object.keys(dom), [\'documents\', \'strings\']);'
                    },
                    {
                      line_number: 11,
                      code: '  });'
                    },
                    {
                      line_number: 12,
                      code: '});'
                    }
                  ]
                }
              },
              screenshot: '/Users/vaibhavsingh/Dev/nightwatch/screens/chromeCDP_example/using-CDP-DOM-Snapshot_FAILED_Apr-06-2023-154931-GMT+0530.png'
            },
            {
              name: 'saveScreenshot',
              args: [
                '/Users/vaibhavsingh/Dev/nightwatch/screens/chromeCDP_example/using-CDP-DOM-Snapshot_FAILED_Apr-06-2023-154931-GMT+0530.png',
                'function () { [native code] }'
              ],
              startTime: 1680776371985,
              endTime: 1680776372089,
              elapsedTime: 104,
              status: 'pass',
              result: {
                status: 0
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'fail'
        },
        __after_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __global_afterEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'end',
              args: [
                'true'
              ],
              startTime: 1680776372096,
              endTime: 1680776372556,
              elapsedTime: 460,
              status: 'pass'
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        }
      },
      errmessages: [
      ],
      testsCount: 1,
      skippedCount: 0,
      failedCount: 1,
      errorsCount: 0,
      passedCount: 0,
      group: '',
      modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:19:25 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:19:32 GMT',
      sessionCapabilities: {
        acceptInsecureCerts: false,
        browserName: 'firefox',
        browserVersion: '111.0.1',
        'moz:accessibilityChecks': false,
        'moz:buildID': '20230321111920',
        'moz:geckodriverVersion': '0.32.0',
        'moz:headless': false,
        'moz:platformVersion': '22.3.0',
        'moz:processID': 93704,
        'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofiletwZmUW',
        'moz:shutdownTimeout': 60000,
        'moz:useNonSpecCompliantPointerOrigin': false,
        'moz:webdriverClick': true,
        'moz:windowless': false,
        pageLoadStrategy: 'normal',
        platformName: 'mac',
        proxy: {
        },
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000
        },
        unhandledPromptBehavior: 'dismiss and notify'
      },
      sessionId: '245b46ac-127c-49fa-8360-05e674967894',
      projectName: '',
      buildName: '',
      testEnv: 'firefox',
      isMobile: false,
      status: 'fail',
      seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/chromeCDP_example_geckodriver.log',
      host: 'localhost',
      tests: 1,
      failures: 1,
      errors: 0,
      httpOutput: [
        [
          '2023-04-06T10:19:25.786Z',
          '  Request <b><span style="color:#0AA">POST /session  </span></b>',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
        ],
        [
          '2023-04-06T10:19:27.415Z',
          '  Response 200 POST /session (1630ms)',
          '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;245b46ac-127c-49fa-8360-05e674967894&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93704<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofiletwZmUW&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:27.426Z',
          '  Request <b><span style="color:#0AA">POST /session/245b46ac-127c-49fa-8360-05e674967894/url  </span></b>',
          '{ url: <span style="color:#0A0">&#39;https://nightwatchjs.org&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:31.915Z',
          '  Response 200 POST /session/245b46ac-127c-49fa-8360-05e674967894/url (4490ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:31.987Z',
          '  Request <b><span style="color:#0AA">GET /session/245b46ac-127c-49fa-8360-05e674967894/screenshot  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:32.085Z',
          '  Response 200 GET /session/245b46ac-127c-49fa-8360-05e674967894/screenshot (76ms)',
          '{\n     value: <span style="color:#0A0">&#39;iVBORw0KGgoAAAANSUhEUgAACgAAAAV8CAYAAAD3/MaLAAAgAElEQVR4XuydB3wURRvG34QUQu8gXQRpoqIiVhQUBQSxgYgF+RRB...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:32.100Z',
          '  Request <b><span style="color:#0AA">DELETE /session/245b46ac-127c-49fa-8360-05e674967894  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:32.554Z',
          '  Response 200 DELETE /session/245b46ac-127c-49fa-8360-05e674967894 (454ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ]
      ],
      rawHttpOutput: [
        [
          '2023-04-06T10:19:25.786Z',
          '  Request POST /session  ',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
        ],
        [
          '2023-04-06T10:19:27.415Z',
          '  Response 200 POST /session (1630ms)',
          '{\n     value: {\n       sessionId: \'245b46ac-127c-49fa-8360-05e674967894\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93704,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofiletwZmUW\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:27.426Z',
          '  Request POST /session/245b46ac-127c-49fa-8360-05e674967894/url  ',
          '{ url: \'https://nightwatchjs.org\' }'
        ],
        [
          '2023-04-06T10:19:31.915Z',
          '  Response 200 POST /session/245b46ac-127c-49fa-8360-05e674967894/url (4490ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:31.987Z',
          '  Request GET /session/245b46ac-127c-49fa-8360-05e674967894/screenshot  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:32.085Z',
          '  Response 200 GET /session/245b46ac-127c-49fa-8360-05e674967894/screenshot (76ms)',
          '{\n     value: \'iVBORw0KGgoAAAANSUhEUgAACgAAAAV8CAYAAAD3/MaLAAAgAElEQVR4XuydB3wURRvG34QUQu8gXQRpoqIiVhQUBQSxgYgF+RRB...\',\n     suppressBase64Data: true\n  }'
        ],
        [
          '2023-04-06T10:19:32.100Z',
          '  Request DELETE /session/245b46ac-127c-49fa-8360-05e674967894  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:32.554Z',
          '  Response 200 DELETE /session/245b46ac-127c-49fa-8360-05e674967894 (454ms)',
          '{ value: null }'
        ]
      ],
      globalErrorRegister: [
        '   \u001b[1;31m→ ✖ \u001b[1;31mNightwatchAssertError\u001b[0m\n   \u001b[0;31mFailed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m\u001b[0m\n\u001b[0;33m\n    Error location:\u001b[0m\n    /Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:\n    ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n     8 |     });\n     9 | \n    \u001b[0;37m\u001b[41m 10 |     browser.assert.deepStrictEqual(Object.keys(dom), [\'documents\', \'strings\']); \u001b[0m\n     11 |   });\n     12 | });\n    ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n\u001b[0m'
      ]
    },
    angularTodoTest: {
      reportPrefix: 'FIREFOX_111.0.1__',
      assertionsCount: 2,
      lastError: null,
      skipped: [
      ],
      time: '1.908',
      timeMs: 1908,
      completed: {
        'should add a todo using custom commands': {
          time: '1.908',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Expected element <web element{f201c631-099d-4556-b725-1b9036ff21e7}> text to equal: "what is nightwatch?" (15ms)',
              stackTrace: '',
              fullMsg: 'Expected element <web element{f201c631-099d-4556-b725-1b9036ff21e7}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Expected elements <*[module=todoApp] li .done-true> count to equal: "2" (5ms)',
              stackTrace: '',
              fullMsg: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (5ms)\u001b[0m',
              failure: false
            }
          ],
          commands: [
          ],
          passed: 2,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 2,
          status: 'pass',
          steps: [
          ],
          stackTrace: '',
          testcases: {
            'should add a todo using custom commands': {
              time: '1.908',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected element <web element{f201c631-099d-4556-b725-1b9036ff21e7}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected element <web element{f201c631-099d-4556-b725-1b9036ff21e7}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (5ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (5ms)\u001b[0m',
                  failure: false
                }
              ],
              tests: 2,
              commands: [
              ],
              passed: 2,
              errors: 0,
              failed: 0,
              skipped: 0,
              status: 'pass',
              steps: [
              ],
              stackTrace: '',
              timeMs: 1908,
              startTimestamp: 'Thu, 06 Apr 2023 10:19:27 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT'
            }
          },
          timeMs: 1908,
          startTimestamp: 'Thu, 06 Apr 2023 10:19:27 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT'
        }
      },
      completedSections: {
        __global_beforeEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __before_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        'should add a todo using custom commands': {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'navigateTo',
              args: [
                'https://angularjs.org'
              ],
              startTime: 1680776367982,
              endTime: 1680776369381,
              elapsedTime: 1399,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'sendKeys',
              args: [
                '[ng-model="todoList.todoText"]',
                'what is nightwatch?'
              ],
              startTime: 1680776369382,
              endTime: 1680776369412,
              elapsedTime: 30,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'click',
              args: [
                '[value="add"]'
              ],
              startTime: 1680776369412,
              endTime: 1680776369631,
              elapsedTime: 219,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'getElementsInList',
              args: [
                'todoList.todos'
              ],
              startTime: 1680776369631,
              endTime: 1680776369638,
              elapsedTime: 7,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'expect.element',
              args: [
                'web element{f201c631-099d-4556-b725-1b9036ff21e7}'
              ],
              startTime: 1680776369642,
              endTime: 1680776369658,
              elapsedTime: 16,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'element().findElement',
              args: [
                '[object Object]'
              ],
              startTime: 1680776369658,
              endTime: 1680776369662,
              elapsedTime: 4,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'click',
              args: [
                '[object Object]'
              ],
              startTime: 1680776369662,
              endTime: 1680776369876,
              elapsedTime: 214,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'expect.elements',
              args: [
                '*[module=todoApp] li .done-true'
              ],
              startTime: 1680776369878,
              endTime: 1680776369883,
              elapsedTime: 5,
              status: 'pass',
              result: {
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __after_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __global_afterEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'end',
              args: [
                'true'
              ],
              startTime: 1680776369890,
              endTime: 1680776370259,
              elapsedTime: 369,
              status: 'pass'
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        }
      },
      errmessages: [
      ],
      testsCount: 1,
      skippedCount: 0,
      failedCount: 0,
      errorsCount: 0,
      passedCount: 2,
      group: '',
      modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/angularTodoTest.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:19:25 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT',
      sessionCapabilities: {
        acceptInsecureCerts: false,
        browserName: 'firefox',
        browserVersion: '111.0.1',
        'moz:accessibilityChecks': false,
        'moz:buildID': '20230321111920',
        'moz:geckodriverVersion': '0.32.0',
        'moz:headless': false,
        'moz:platformVersion': '22.3.0',
        'moz:processID': 93705,
        'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileCfAJtT',
        'moz:shutdownTimeout': 60000,
        'moz:useNonSpecCompliantPointerOrigin': false,
        'moz:webdriverClick': true,
        'moz:windowless': false,
        pageLoadStrategy: 'normal',
        platformName: 'mac',
        proxy: {
        },
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000
        },
        unhandledPromptBehavior: 'dismiss and notify'
      },
      sessionId: '1a5fbc5c-7381-4c6e-991b-936453257b8d',
      projectName: '',
      buildName: '',
      testEnv: 'firefox',
      isMobile: false,
      status: 'pass',
      seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/angularTodoTest_geckodriver.log',
      host: 'localhost',
      tests: 1,
      failures: 0,
      errors: 0,
      httpOutput: [
        [
          '2023-04-06T10:19:25.817Z',
          '  Request <b><span style="color:#0AA">POST /session  </span></b>',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
        ],
        [
          '2023-04-06T10:19:27.970Z',
          '  Response 200 POST /session (2155ms)',
          '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;1a5fbc5c-7381-4c6e-991b-936453257b8d&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93705<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileCfAJtT&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:27.986Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/url  </span></b>',
          '{ url: <span style="color:#0A0">&#39;https://angularjs.org&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:29.380Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/url (1394ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:29.385Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[ng-model=&quot;todoList.todoText&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.391Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (7ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9e5ff74b-5b5b-4221-90b6-d14dcc856ec8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.393Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/9e5ff74b-5b5b-4221-90b6-d14dcc856ec8/value  </span></b>',
          '{\n     text: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;?&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.411Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/9e5ff74b-5b5b-4221-90b6-d14dcc856ec8/value (18ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:29.413Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[value=&quot;add&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.416Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (3ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b00c28b3-319c-44f5-906d-c24b3debafd7&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.418Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/b00c28b3-319c-44f5-906d-c24b3debafd7/click  </span></b>',
          '{}'
        ],
        [
          '2023-04-06T10:19:29.631Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/b00c28b3-319c-44f5-906d-c24b3debafd7/click (213ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:29.634Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;var passedArgs = Array.prototype.slice.call(arguments,0); return (function(listName) {\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      // executed in the browser context\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      // eslint-disable-next-line\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      var elements = document.querySel... (366 characters)&#39;<span style="color:#FFF">,\n     args: [ <span style="color:#0A0">&#39;todoList.todos&#39;<span style="color:#FFF"> ]\n  }</span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.637Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/execute/sync (3ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;df85178f-1166-489c-827d-17e13fecf95a&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed6dc16b-f99b-4ab7-821b-c17030dcd5de&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f201c631-099d-4556-b725-1b9036ff21e7&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.643Z',
          '  Request <b><span style="color:#0AA">GET /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/text  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:29.656Z',
          '  Response 200 GET /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/text (13ms)',
          '{ value: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:29.659Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/element  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.662Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/element (3ms)',
          '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8b05c802-195a-4804-a216-09892ca94a68&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.663Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/8b05c802-195a-4804-a216-09892ca94a68/click  </span></b>',
          '{}'
        ],
        [
          '2023-04-06T10:19:29.875Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/8b05c802-195a-4804-a216-09892ca94a68/click (212ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:29.879Z',
          '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;*[module=todoApp] li .done-true&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.883Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (4ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f027fd19-1bf0-406e-899c-c005c1e40456&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed3f1754-6119-41a2-83c1-d56075d6b38a&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.893Z',
          '  Request <b><span style="color:#0AA">DELETE /session/1a5fbc5c-7381-4c6e-991b-936453257b8d  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:30.257Z',
          '  Response 200 DELETE /session/1a5fbc5c-7381-4c6e-991b-936453257b8d (365ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ]
      ],
      rawHttpOutput: [
        [
          '2023-04-06T10:19:25.817Z',
          '  Request POST /session  ',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
        ],
        [
          '2023-04-06T10:19:27.970Z',
          '  Response 200 POST /session (2155ms)',
          '{\n     value: {\n       sessionId: \'1a5fbc5c-7381-4c6e-991b-936453257b8d\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93705,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileCfAJtT\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:27.986Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/url  ',
          '{ url: \'https://angularjs.org\' }'
        ],
        [
          '2023-04-06T10:19:29.380Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/url (1394ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:29.385Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  ',
          '{ using: \'css selector\', value: \'[ng-model=&quot;todoList.todoText&quot;]\' }'
        ],
        [
          '2023-04-06T10:19:29.391Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (7ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9e5ff74b-5b5b-4221-90b6-d14dcc856ec8\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:29.393Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/9e5ff74b-5b5b-4221-90b6-d14dcc856ec8/value  ',
          '{\n     text: \'what is nightwatch?\',\n     value: [\n       \'w\', \'h\', \'a\', \'t\', \' \',\n       \'i\', \'s\', \' \', \'n\', \'i\',\n       \'g\', \'h\', \'t\', \'w\', \'a\',\n       \'t\', \'c\', \'h\', \'?\'\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:29.411Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/9e5ff74b-5b5b-4221-90b6-d14dcc856ec8/value (18ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:29.413Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  ',
          '{ using: \'css selector\', value: \'[value=&quot;add&quot;]\' }'
        ],
        [
          '2023-04-06T10:19:29.416Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (3ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b00c28b3-319c-44f5-906d-c24b3debafd7\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:29.418Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/b00c28b3-319c-44f5-906d-c24b3debafd7/click  ',
          '{}'
        ],
        [
          '2023-04-06T10:19:29.631Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/b00c28b3-319c-44f5-906d-c24b3debafd7/click (213ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:29.634Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/execute/sync  ',
          '{\n     script: \'var passedArgs = Array.prototype.slice.call(arguments,0); return (function(listName) {\\n\' +\n       \'      // executed in the browser context\\n\' +\n       \'      // eslint-disable-next-line\\n\' +\n       \'      var elements = document.querySel... (366 characters)\',\n     args: [ \'todoList.todos\' ]\n  }'
        ],
        [
          '2023-04-06T10:19:29.637Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/execute/sync (3ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'df85178f-1166-489c-827d-17e13fecf95a\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed6dc16b-f99b-4ab7-821b-c17030dcd5de\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f201c631-099d-4556-b725-1b9036ff21e7\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:29.643Z',
          '  Request GET /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/text  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:29.656Z',
          '  Response 200 GET /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/text (13ms)',
          '{ value: \'what is nightwatch?\' }'
        ],
        [
          '2023-04-06T10:19:29.659Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/element  ',
          '{ using: \'css selector\', value: \'input\' }'
        ],
        [
          '2023-04-06T10:19:29.662Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/element (3ms)',
          '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'8b05c802-195a-4804-a216-09892ca94a68\'\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:29.663Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/8b05c802-195a-4804-a216-09892ca94a68/click  ',
          '{}'
        ],
        [
          '2023-04-06T10:19:29.875Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/8b05c802-195a-4804-a216-09892ca94a68/click (212ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:29.879Z',
          '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  ',
          '{ using: \'css selector\', value: \'*[module=todoApp] li .done-true\' }'
        ],
        [
          '2023-04-06T10:19:29.883Z',
          '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (4ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f027fd19-1bf0-406e-899c-c005c1e40456\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed3f1754-6119-41a2-83c1-d56075d6b38a\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:29.893Z',
          '  Request DELETE /session/1a5fbc5c-7381-4c6e-991b-936453257b8d  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:30.257Z',
          '  Response 200 DELETE /session/1a5fbc5c-7381-4c6e-991b-936453257b8d (365ms)',
          '{ value: null }'
        ]
      ]
    },
    duckDuckGo: {
      reportPrefix: 'FIREFOX_111.0.1__',
      assertionsCount: 1,
      lastError: {
        name: 'NightwatchAssertError',
        message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
        showDiff: false,
        abortOnFailure: true,
        waitFor: true,
        stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
      },
      skipped: [
      ],
      time: '5.777',
      timeMs: 5777,
      completed: {
        'Search Nightwatch.js and check results': {
          time: '5.777',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5088ms)',
              stackTrace: '    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
              fullMsg: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
              failure: 'Expected "visible" but got: "not found"',
              screenshots: [
                '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154934-GMT+0530.png'
              ]
            }
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 1,
          skipped: 0,
          tests: 1,
          status: 'fail',
          steps: [
          ],
          stackTrace: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
          testcases: {
            'Search Nightwatch.js and check results': {
              time: '5.777',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
                  stackTrace: '    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                  fullMsg: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
                  failure: 'Expected "visible" but got: "not found"',
                  screenshots: [
                    '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154934-GMT+0530.png'
                  ]
                }
              ],
              tests: 1,
              commands: [
              ],
              passed: 0,
              errors: 0,
              failed: 1,
              skipped: 0,
              status: 'fail',
              steps: [
              ],
              stackTrace: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
              lastError: {
                name: 'NightwatchAssertError',
                message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
                showDiff: false,
                abortOnFailure: true,
                waitFor: true,
                stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
              },
              timeMs: 5777,
              startTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:19:34 GMT'
            }
          },
          lastError: {
            name: 'NightwatchAssertError',
            message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
            showDiff: false,
            abortOnFailure: true,
            waitFor: true,
            stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
          },
          timeMs: 5777,
          startTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:19:34 GMT'
        }
      },
      completedSections: {
        __global_beforeEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __before_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        'Search Nightwatch.js and check results': {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'navigateTo',
              args: [
                'https://duckduckgo.com'
              ],
              startTime: 1680776369008,
              endTime: 1680776369560,
              elapsedTime: 552,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'waitForElementVisible',
              args: [
                '#search_form_input_homepage'
              ],
              startTime: 1680776369561,
              endTime: 1680776374652,
              elapsedTime: 5091,
              status: 'fail',
              result: {
                message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5088ms)',
                showDiff: false,
                name: 'NightwatchAssertError',
                abortOnFailure: true,
                stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                beautifiedStack: {
                  filePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js',
                  error_line_number: 8,
                  codeSnippet: [
                    {
                      line_number: 6,
                      code: '    browser'
                    },
                    {
                      line_number: 7,
                      code: '      .navigateTo(\'https://duckduckgo.com\')'
                    },
                    {
                      line_number: 8,
                      code: '      .waitForElementVisible(\'#search_form_input_homepage\')'
                    },
                    {
                      line_number: 9,
                      code: '      .sendKeys(\'#search_form_input_homepage\', [\'Nightwatch.js\'])'
                    },
                    {
                      line_number: 10,
                      code: '      .click(\'#search_button_homepage\')'
                    }
                  ]
                }
              },
              screenshot: '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154934-GMT+0530.png'
            },
            {
              name: 'saveScreenshot',
              args: [
                '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154934-GMT+0530.png',
                'function () { [native code] }'
              ],
              startTime: 1680776374705,
              endTime: 1680776374779,
              elapsedTime: 74,
              status: 'pass',
              result: {
                status: 0
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'fail'
        },
        __after_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __global_afterEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'end',
              args: [
                'true'
              ],
              startTime: 1680776374783,
              endTime: 1680776375248,
              elapsedTime: 465,
              status: 'pass'
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        }
      },
      errmessages: [
      ],
      testsCount: 1,
      skippedCount: 0,
      failedCount: 1,
      errorsCount: 0,
      passedCount: 0,
      group: '',
      modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:19:26 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:19:34 GMT',
      sessionCapabilities: {
        acceptInsecureCerts: false,
        browserName: 'firefox',
        browserVersion: '111.0.1',
        'moz:accessibilityChecks': false,
        'moz:buildID': '20230321111920',
        'moz:geckodriverVersion': '0.32.0',
        'moz:headless': false,
        'moz:platformVersion': '22.3.0',
        'moz:processID': 93718,
        'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile7QoCZB',
        'moz:shutdownTimeout': 60000,
        'moz:useNonSpecCompliantPointerOrigin': false,
        'moz:webdriverClick': true,
        'moz:windowless': false,
        pageLoadStrategy: 'normal',
        platformName: 'mac',
        proxy: {
        },
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000
        },
        unhandledPromptBehavior: 'dismiss and notify'
      },
      sessionId: '57729330-9108-4abf-9b31-a590c5cdf0e9',
      projectName: '',
      buildName: '',
      testEnv: 'firefox',
      isMobile: false,
      status: 'fail',
      seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/duckDuckGo_geckodriver.log',
      host: 'localhost',
      tests: 1,
      failures: 1,
      errors: 0,
      httpOutput: [
        [
          '2023-04-06T10:19:27.321Z',
          '  Request <b><span style="color:#0AA">POST /session  </span></b>',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
        ],
        [
          '2023-04-06T10:19:28.997Z',
          '  Response 200 POST /session (1678ms)',
          '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;57729330-9108-4abf-9b31-a590c5cdf0e9&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93718<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile7QoCZB&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.011Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/url  </span></b>',
          '{ url: <span style="color:#0A0">&#39;https://duckduckgo.com&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:29.559Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/url (549ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:29.563Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:29.573Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (10ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:30.075Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:30.077Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (2ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:30.581Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:30.599Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (18ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:31.101Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:31.106Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (5ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:31.608Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:31.611Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:32.115Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:32.120Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (6ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:32.622Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:32.625Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:33.128Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:33.132Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (4ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:33.635Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:33.638Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:34.140Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:34.144Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (4ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:34.646Z',
          '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:34.649Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:34.708Z',
          '  Request <b><span style="color:#0AA">GET /session/57729330-9108-4abf-9b31-a590c5cdf0e9/screenshot  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:34.774Z',
          '  Response 200 GET /session/57729330-9108-4abf-9b31-a590c5cdf0e9/screenshot (54ms)',
          '{\n     value: <span style="color:#0A0">&#39;iVBORw0KGgoAAAANSUhEUgAACgAAAAV8CAYAAAD3/MaLAAAgAElEQVR4XuzdeZhcZZk34Kf39JLuzr5CCIQlIARZBJTFBRVRRNEZ...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:34.787Z',
          '  Request <b><span style="color:#0AA">DELETE /session/57729330-9108-4abf-9b31-a590c5cdf0e9  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:35.245Z',
          '  Response 200 DELETE /session/57729330-9108-4abf-9b31-a590c5cdf0e9 (456ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ]
      ],
      rawHttpOutput: [
        [
          '2023-04-06T10:19:27.321Z',
          '  Request POST /session  ',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
        ],
        [
          '2023-04-06T10:19:28.997Z',
          '  Response 200 POST /session (1678ms)',
          '{\n     value: {\n       sessionId: \'57729330-9108-4abf-9b31-a590c5cdf0e9\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93718,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile7QoCZB\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:29.011Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/url  ',
          '{ url: \'https://duckduckgo.com\' }'
        ],
        [
          '2023-04-06T10:19:29.559Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/url (549ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:29.563Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:29.573Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (10ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:30.075Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:30.077Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (2ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:30.581Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:30.599Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (18ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:31.101Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:31.106Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (5ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:31.608Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:31.611Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:32.115Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:32.120Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (6ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:32.622Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:32.625Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:33.128Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:33.132Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (4ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:33.635Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:33.638Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:34.140Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:34.144Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (4ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:34.646Z',
          '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
          '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
        ],
        [
          '2023-04-06T10:19:34.649Z',
          '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:34.708Z',
          '  Request GET /session/57729330-9108-4abf-9b31-a590c5cdf0e9/screenshot  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:34.774Z',
          '  Response 200 GET /session/57729330-9108-4abf-9b31-a590c5cdf0e9/screenshot (54ms)',
          '{\n     value: \'iVBORw0KGgoAAAANSUhEUgAACgAAAAV8CAYAAAD3/MaLAAAgAElEQVR4XuzdeZhcZZk34Kf39JLuzr5CCIQlIARZBJTFBRVRRNEZ...\',\n     suppressBase64Data: true\n  }'
        ],
        [
          '2023-04-06T10:19:34.787Z',
          '  Request DELETE /session/57729330-9108-4abf-9b31-a590c5cdf0e9  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:35.245Z',
          '  Response 200 DELETE /session/57729330-9108-4abf-9b31-a590c5cdf0e9 (456ms)',
          '{ value: null }'
        ]
      ],
      globalErrorRegister: [
        '   \u001b[1;31m→ ✖ \u001b[1;31mNightwatchAssertError\u001b[0m\n   \u001b[0;31mTimed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m\u001b[0m\n\u001b[0;33m\n    Error location:\u001b[0m\n    /Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:\n    –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n     6 |     browser\n     7 |       .navigateTo(\'https://duckduckgo.com\')\n    \u001b[0;37m\u001b[41m 8 |       .waitForElementVisible(\'#search_form_input_homepage\') \u001b[0m\n     9 |       .sendKeys(\'#search_form_input_homepage\', [\'Nightwatch.js\'])\n     10 |       .click(\'#search_button_homepage\')\n    –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n\u001b[0m'
      ]
    },
    googlePageObject: {
      reportPrefix: '',
      assertionsCount: 0,
      lastError: null,
      skipped: [
        'should complete the consent form'
      ],
      time: 0,
      completed: {
      },
      completedSections: {
      },
      errmessages: [
      ],
      testsCount: 0,
      skippedCount: 1,
      failedCount: 0,
      errorsCount: 0,
      passedCount: 0,
      group: '',
      modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/googlePageObject.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:19:36 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:19:36 GMT',
      sessionCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: [
            ]
          }
        },
        name: 'google search with consent form - page objects'
      },
      sessionId: '',
      projectName: '',
      buildName: '',
      testEnv: 'firefox',
      isMobile: false,
      status: 'skip',
      host: 'localhost',
      tests: 0,
      failures: 0,
      errors: 0,
      httpOutput: [
      ],
      rawHttpOutput: [
      ]
    },
    google: {
      reportPrefix: 'FIREFOX_111.0.1__',
      assertionsCount: 2,
      lastError: null,
      skipped: [
      ],
      time: '10.68',
      timeMs: 10675,
      completed: {
        'demo test using expect apis': {
          time: '10.68',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
              stackTrace: '',
              fullMsg: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Testing if element <#rso>:first-child> contains text \'Nightwatch.js\' (1069ms)',
              stackTrace: '',
              fullMsg: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(1069ms)\u001b[0m',
              failure: false
            }
          ],
          commands: [
          ],
          passed: 2,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 2,
          status: 'pass',
          steps: [
          ],
          stackTrace: '',
          testcases: {
            'demo test using expect apis': {
              time: '10.68',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                  stackTrace: '',
                  fullMsg: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(1069ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(1069ms)\u001b[0m',
                  failure: false
                }
              ],
              tests: 2,
              commands: [
              ],
              passed: 2,
              errors: 0,
              failed: 0,
              skipped: 0,
              status: 'pass',
              steps: [
              ],
              stackTrace: '',
              timeMs: 10675,
              startTimestamp: 'Thu, 06 Apr 2023 10:19:35 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:19:46 GMT'
            }
          },
          timeMs: 10675,
          startTimestamp: 'Thu, 06 Apr 2023 10:19:35 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:19:46 GMT'
        }
      },
      completedSections: {
        __global_beforeEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __before_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        'demo test using expect apis': {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'navigateTo',
              args: [
                'http://google.no'
              ],
              startTime: 1680776375516,
              endTime: 1680776379577,
              elapsedTime: 4061,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'isPresent',
              args: [
                '[aria-modal="true"][title="Before you continue to Google Search"]'
              ],
              startTime: 1680776379578,
              endTime: 1680776384672,
              elapsedTime: 5094,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'waitForElementVisible',
              args: [
                'form[action="/search"] input[type=text]'
              ],
              startTime: 1680776384675,
              endTime: 1680776384690,
              elapsedTime: 15,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'sendKeys',
              args: [
                'form[action="/search"] input[type=text]',
                'Nightwatch.js,'
              ],
              startTime: 1680776384690,
              endTime: 1680776384728,
              elapsedTime: 38,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'assert.textContains',
              args: [
                '#rso>:first-child',
                'Nightwatch.js'
              ],
              startTime: 1680776384728,
              endTime: 1680776385800,
              elapsedTime: 1072,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'end',
              args: [
              ],
              startTime: 1680776385800,
              endTime: 1680776386186,
              elapsedTime: 386,
              status: 'pass'
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __after_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __global_afterEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        }
      },
      errmessages: [
      ],
      testsCount: 1,
      skippedCount: 0,
      failedCount: 0,
      errorsCount: 0,
      passedCount: 2,
      group: '',
      modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/google.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:19:33 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:19:46 GMT',
      sessionCapabilities: {
        acceptInsecureCerts: false,
        browserName: 'firefox',
        browserVersion: '111.0.1',
        'moz:accessibilityChecks': false,
        'moz:buildID': '20230321111920',
        'moz:geckodriverVersion': '0.32.0',
        'moz:headless': false,
        'moz:platformVersion': '22.3.0',
        'moz:processID': 93775,
        'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileoRDuKX',
        'moz:shutdownTimeout': 60000,
        'moz:useNonSpecCompliantPointerOrigin': false,
        'moz:webdriverClick': true,
        'moz:windowless': false,
        pageLoadStrategy: 'normal',
        platformName: 'mac',
        proxy: {
        },
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000
        },
        unhandledPromptBehavior: 'dismiss and notify'
      },
      sessionId: 'c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d',
      projectName: '',
      buildName: '',
      testEnv: 'firefox',
      isMobile: false,
      status: 'pass',
      host: 'localhost',
      tests: 1,
      failures: 0,
      errors: 0,
      httpOutput: [
        [
          '2023-04-06T10:19:34.090Z',
          '  Request <b><span style="color:#0AA">POST /session  </span></b>',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
        ],
        [
          '2023-04-06T10:19:35.510Z',
          '  Response 200 POST /session (1421ms)',
          '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93775<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileoRDuKX&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:35.517Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/url  </span></b>',
          '{ url: <span style="color:#0A0">&#39;http://google.no&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:39.576Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/url (4059ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:39.580Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:39.588Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:40.091Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:40.096Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (6ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:40.598Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:40.600Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:41.103Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:41.111Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:41.614Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:41.620Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (7ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:42.123Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.128Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (6ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:42.630Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:42.637Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:43.140Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:43.154Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (15ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:43.656Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:43.659Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:44.161Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.163Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (2ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:44.665Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.669Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:44.676Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;form[action=&quot;/search&quot;] input[type=text]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.680Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d11d4330-8ae2-44c8-b64a-3971618fbde5&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.682Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d11d4330-8ae2-44c8-b64a-3971618fbde5&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;d11d4330-8ae2-44c8-b64a-3971618fbde5&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.689Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/execute/sync (7ms)',
          '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:44.691Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;form[action=&quot;/search&quot;] input[type=text]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.694Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d11d4330-8ae2-44c8-b64a-3971618fbde5&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.695Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/d11d4330-8ae2-44c8-b64a-3971618fbde5/value  </span></b>',
          '{\n     text: <span style="color:#0A0">&#39;Nightwatch.js&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;N&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;.&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;j&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.727Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/d11d4330-8ae2-44c8-b64a-3971618fbde5/value (32ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:44.730Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#rso&gt;:first-child&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:44.732Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (2ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:45.235Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#rso&gt;:first-child&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:45.238Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:45.741Z',
          '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#rso&gt;:first-child&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:45.744Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;1e7d46f7-02cf-45c5-9db9-6673572e7e78&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:45.746Z',
          '  Request <b><span style="color:#0AA">GET /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/1e7d46f7-02cf-45c5-9db9-6673572e7e78/text  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:45.797Z',
          '  Response 200 GET /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/1e7d46f7-02cf-45c5-9db9-6673572e7e78/text (51ms)',
          '{\n     value: <span style="color:#0A0">&#39;Web result with site links\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch....&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:45.803Z',
          '  Request <b><span style="color:#0AA">DELETE /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:46.185Z',
          '  Response 200 DELETE /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d (383ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ]
      ],
      rawHttpOutput: [
        [
          '2023-04-06T10:19:34.090Z',
          '  Request POST /session  ',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
        ],
        [
          '2023-04-06T10:19:35.510Z',
          '  Response 200 POST /session (1421ms)',
          '{\n     value: {\n       sessionId: \'c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93775,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileoRDuKX\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:35.517Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/url  ',
          '{ url: \'http://google.no\' }'
        ],
        [
          '2023-04-06T10:19:39.576Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/url (4059ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:39.580Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:39.588Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:40.091Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:40.096Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (6ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:40.598Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:40.600Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:41.103Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:41.111Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:41.614Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:41.620Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (7ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:42.123Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:42.128Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (6ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:42.630Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:42.637Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:43.140Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:43.154Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (15ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:43.656Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:43.659Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:44.161Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:44.163Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (2ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:44.665Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
        ],
        [
          '2023-04-06T10:19:44.669Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:44.676Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'form[action=&quot;/search&quot;] input[type=text]\'\n  }'
        ],
        [
          '2023-04-06T10:19:44.680Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d11d4330-8ae2-44c8-b64a-3971618fbde5\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:44.682Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d11d4330-8ae2-44c8-b64a-3971618fbde5\',\n         ELEMENT: \'d11d4330-8ae2-44c8-b64a-3971618fbde5\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:44.689Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/execute/sync (7ms)',
          '{ value: true }'
        ],
        [
          '2023-04-06T10:19:44.691Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{\n     using: \'css selector\',\n     value: \'form[action=&quot;/search&quot;] input[type=text]\'\n  }'
        ],
        [
          '2023-04-06T10:19:44.694Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d11d4330-8ae2-44c8-b64a-3971618fbde5\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:44.695Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/d11d4330-8ae2-44c8-b64a-3971618fbde5/value  ',
          '{\n     text: \'Nightwatch.js\',\n     value: [\n       \'N\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\', \'.\', \'j\',\n       \'s\', \'\'\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:44.727Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/d11d4330-8ae2-44c8-b64a-3971618fbde5/value (32ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:44.730Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{ using: \'css selector\', value: \'#rso&gt;:first-child\' }'
        ],
        [
          '2023-04-06T10:19:44.732Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (2ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:45.235Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{ using: \'css selector\', value: \'#rso&gt;:first-child\' }'
        ],
        [
          '2023-04-06T10:19:45.238Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
          '{ value: [] }'
        ],
        [
          '2023-04-06T10:19:45.741Z',
          '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
          '{ using: \'css selector\', value: \'#rso&gt;:first-child\' }'
        ],
        [
          '2023-04-06T10:19:45.744Z',
          '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'1e7d46f7-02cf-45c5-9db9-6673572e7e78\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:45.746Z',
          '  Request GET /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/1e7d46f7-02cf-45c5-9db9-6673572e7e78/text  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:45.797Z',
          '  Response 200 GET /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/1e7d46f7-02cf-45c5-9db9-6673572e7e78/text (51ms)',
          '{\n     value: \'Web result with site links\\n\' +\n       \'\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwatch....\',\n     suppressBase64Data: true\n  }'
        ],
        [
          '2023-04-06T10:19:45.803Z',
          '  Request DELETE /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:46.185Z',
          '  Response 200 DELETE /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d (383ms)',
          '{ value: null }'
        ]
      ]
    },
    shadowRootExample: {
      reportPrefix: '',
      assertionsCount: 0,
      lastError: null,
      skipped: [
        'retrieve the shadowRoot'
      ],
      time: 0,
      completed: {
      },
      completedSections: {
      },
      errmessages: [
      ],
      testsCount: 0,
      skippedCount: 1,
      failedCount: 0,
      errorsCount: 0,
      passedCount: 0,
      group: '',
      modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/shadowRootExample.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:19:45 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:19:45 GMT',
      sessionCapabilities: {
        browserName: 'firefox',
        alwaysMatch: {
          acceptInsecureCerts: true,
          'moz:firefoxOptions': {
            args: [
            ]
          }
        },
        name: 'Shadow Root example test'
      },
      sessionId: '',
      projectName: '',
      buildName: '',
      testEnv: 'firefox',
      isMobile: false,
      status: 'skip',
      host: 'localhost',
      tests: 0,
      failures: 0,
      errors: 0,
      httpOutput: [
      ],
      rawHttpOutput: [
      ]
    },
    vueTodoList: {
      reportPrefix: 'FIREFOX_111.0.1__',
      assertionsCount: 3,
      lastError: null,
      skipped: [
      ],
      time: '1.251',
      timeMs: 1251,
      completed: {
        'should add a todo using global element()': {
          time: '1.251',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Expected elements <#todo-list ul li> count to equal: "5" (4ms)',
              stackTrace: '',
              fullMsg: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Expected element <#todo-list ul li> text to contain: "what is nightwatch?" (15ms)',
              stackTrace: '',
              fullMsg: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Expected elements <#todo-list ul li input:checked> count to equal: "3" (4ms)',
              stackTrace: '',
              fullMsg: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
              failure: false
            }
          ],
          commands: [
          ],
          passed: 3,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 3,
          status: 'pass',
          steps: [
          ],
          stackTrace: '',
          testcases: {
            'should add a todo using global element()': {
              time: '1.251',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                  failure: false
                }
              ],
              tests: 3,
              commands: [
              ],
              passed: 3,
              errors: 0,
              failed: 0,
              skipped: 0,
              status: 'pass',
              steps: [
              ],
              stackTrace: '',
              timeMs: 1251,
              startTimestamp: 'Thu, 06 Apr 2023 10:19:47 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:19:48 GMT'
            }
          },
          timeMs: 1251,
          startTimestamp: 'Thu, 06 Apr 2023 10:19:47 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:19:48 GMT'
        }
      },
      completedSections: {
        __global_beforeEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __before_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        'should add a todo using global element()': {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'navigateTo',
              args: [
                'https://todo-vue3-vite.netlify.app/'
              ],
              startTime: 1680776387084,
              endTime: 1680776387841,
              elapsedTime: 757,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'sendKeys',
              args: [
                '#new-todo-input',
                'what is nightwatch?'
              ],
              startTime: 1680776387841,
              endTime: 1680776387864,
              elapsedTime: 23,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'click',
              args: [
                'form button[type="submit"]'
              ],
              startTime: 1680776387865,
              endTime: 1680776388087,
              elapsedTime: 222,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'expect.elements',
              args: [
                '#todo-list ul li'
              ],
              startTime: 1680776388091,
              endTime: 1680776388095,
              elapsedTime: 4,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'expect.element',
              args: [
                '#todo-list ul li'
              ],
              startTime: 1680776388096,
              endTime: 1680776388111,
              elapsedTime: 15,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'element().findElement',
              args: [
                '[object Object]'
              ],
              startTime: 1680776388111,
              endTime: 1680776388114,
              elapsedTime: 3,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'click',
              args: [
                '[object Object]'
              ],
              startTime: 1680776388116,
              endTime: 1680776388327,
              elapsedTime: 211,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'expect.elements',
              args: [
                '#todo-list ul li input:checked'
              ],
              startTime: 1680776388328,
              endTime: 1680776388332,
              elapsedTime: 4,
              status: 'pass',
              result: {
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __after_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __global_afterEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'end',
              args: [
                'true'
              ],
              startTime: 1680776388337,
              endTime: 1680776389341,
              elapsedTime: 1004,
              status: 'pass'
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        }
      },
      errmessages: [
      ],
      testsCount: 1,
      skippedCount: 0,
      failedCount: 0,
      errorsCount: 0,
      passedCount: 3,
      group: '',
      modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/vueTodoList.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:19:45 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:19:48 GMT',
      sessionCapabilities: {
        acceptInsecureCerts: false,
        browserName: 'firefox',
        browserVersion: '111.0.1',
        'moz:accessibilityChecks': false,
        'moz:buildID': '20230321111920',
        'moz:geckodriverVersion': '0.32.0',
        'moz:headless': false,
        'moz:platformVersion': '22.3.0',
        'moz:processID': 93855,
        'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile2iTSVu',
        'moz:shutdownTimeout': 60000,
        'moz:useNonSpecCompliantPointerOrigin': false,
        'moz:webdriverClick': true,
        'moz:windowless': false,
        pageLoadStrategy: 'normal',
        platformName: 'mac',
        proxy: {
        },
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000
        },
        unhandledPromptBehavior: 'dismiss and notify'
      },
      sessionId: '02cdc21b-3ae3-4f80-b595-07f8498c4a11',
      projectName: '',
      buildName: '',
      testEnv: 'firefox',
      isMobile: false,
      status: 'pass',
      seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/vueTodoList_geckodriver.log',
      host: 'localhost',
      tests: 1,
      failures: 0,
      errors: 0,
      httpOutput: [
        [
          '2023-04-06T10:19:45.864Z',
          '  Request <b><span style="color:#0AA">POST /session  </span></b>',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
        ],
        [
          '2023-04-06T10:19:47.078Z',
          '  Response 200 POST /session (1217ms)',
          '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;02cdc21b-3ae3-4f80-b595-07f8498c4a11&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93855<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile2iTSVu&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:47.085Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/url  </span></b>',
          '{ url: <span style="color:#0A0">&#39;https://todo-vue3-vite.netlify.app/&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:19:47.840Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/url (755ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:47.843Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#new-todo-input&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:47.848Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (6ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;cbf47355-2c00-4daf-b3b5-8179d43d1e88&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:47.851Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/cbf47355-2c00-4daf-b3b5-8179d43d1e88/value  </span></b>',
          '{\n     text: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;?&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:47.863Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/cbf47355-2c00-4daf-b3b5-8179d43d1e88/value (13ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:47.867Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;form button[type=&quot;submit&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:47.871Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (5ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:47.873Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed/click  </span></b>',
          '{}'
        ],
        [
          '2023-04-06T10:19:48.087Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed/click (215ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:48.092Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.094Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9fba7102-78a1-4f16-8085-471f605574cf&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d8c3dbca-d8d8-4395-bdee-5dd16a889d37&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;320b0952-82ca-4c8d-b91b-36141f695c14&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f8514d2e-85c6-4991-8920-31e10a6d7f88&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2bfecd6d-d71c-4946-97bd-5521f6a31055&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.096Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.098Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9fba7102-78a1-4f16-8085-471f605574cf&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d8c3dbca-d8d8-4395-bdee-5dd16a889d37&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;320b0952-82ca-4c8d-b91b-36141f695c14&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f8514d2e-85c6-4991-8920-31e10a6d7f88&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2bfecd6d-d71c-4946-97bd-5521f6a31055&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.099Z',
          '  Request <b><span style="color:#0AA">GET /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/text  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:48.110Z',
          '  Response 200 GET /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/text (11ms)',
          '{\n     value: <span style="color:#0A0">&#39;new taskwhat is nightwatch?\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Edit\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;New Taskwhat Is Nightwatch?\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Delete\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;New Taskwhat Is Nightwatch?&#39;<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.112Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/element  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=&quot;checkbox&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.114Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/element (2ms)',
          '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9db02cb5-bb43-4ef1-b935-38a417240ee2&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.117Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/9db02cb5-bb43-4ef1-b935-38a417240ee2/click  </span></b>',
          '{}'
        ],
        [
          '2023-04-06T10:19:48.327Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/9db02cb5-bb43-4ef1-b935-38a417240ee2/click (209ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:19:48.329Z',
          '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li input:checked&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.331Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;a6373a47-f735-4162-bb2d-36b5aa4756a4&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;56a696cc-b2f5-4300-8428-0bcf93409417&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9db02cb5-bb43-4ef1-b935-38a417240ee2&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:19:48.340Z',
          '  Request <b><span style="color:#0AA">DELETE /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:19:49.340Z',
          '  Response 200 DELETE /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11 (1000ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ]
      ],
      rawHttpOutput: [
        [
          '2023-04-06T10:19:45.864Z',
          '  Request POST /session  ',
          '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
        ],
        [
          '2023-04-06T10:19:47.078Z',
          '  Response 200 POST /session (1217ms)',
          '{\n     value: {\n       sessionId: \'02cdc21b-3ae3-4f80-b595-07f8498c4a11\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93855,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile2iTSVu\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:47.085Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/url  ',
          '{ url: \'https://todo-vue3-vite.netlify.app/\' }'
        ],
        [
          '2023-04-06T10:19:47.840Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/url (755ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:47.843Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
          '{ using: \'css selector\', value: \'#new-todo-input\' }'
        ],
        [
          '2023-04-06T10:19:47.848Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (6ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'cbf47355-2c00-4daf-b3b5-8179d43d1e88\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:47.851Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/cbf47355-2c00-4daf-b3b5-8179d43d1e88/value  ',
          '{\n     text: \'what is nightwatch?\',\n     value: [\n       \'w\', \'h\', \'a\', \'t\', \' \',\n       \'i\', \'s\', \' \', \'n\', \'i\',\n       \'g\', \'h\', \'t\', \'w\', \'a\',\n       \'t\', \'c\', \'h\', \'?\'\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:47.863Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/cbf47355-2c00-4daf-b3b5-8179d43d1e88/value (13ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:47.867Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
          '{ using: \'css selector\', value: \'form button[type=&quot;submit&quot;]\' }'
        ],
        [
          '2023-04-06T10:19:47.871Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (5ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:47.873Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed/click  ',
          '{}'
        ],
        [
          '2023-04-06T10:19:48.087Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed/click (215ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:48.092Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
          '{ using: \'css selector\', value: \'#todo-list ul li\' }'
        ],
        [
          '2023-04-06T10:19:48.094Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9fba7102-78a1-4f16-8085-471f605574cf\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d8c3dbca-d8d8-4395-bdee-5dd16a889d37\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'320b0952-82ca-4c8d-b91b-36141f695c14\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f8514d2e-85c6-4991-8920-31e10a6d7f88\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2bfecd6d-d71c-4946-97bd-5521f6a31055\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:48.096Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
          '{ using: \'css selector\', value: \'#todo-list ul li\' }'
        ],
        [
          '2023-04-06T10:19:48.098Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9fba7102-78a1-4f16-8085-471f605574cf\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d8c3dbca-d8d8-4395-bdee-5dd16a889d37\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'320b0952-82ca-4c8d-b91b-36141f695c14\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f8514d2e-85c6-4991-8920-31e10a6d7f88\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2bfecd6d-d71c-4946-97bd-5521f6a31055\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:48.099Z',
          '  Request GET /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/text  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:48.110Z',
          '  Response 200 GET /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/text (11ms)',
          '{\n     value: \'new taskwhat is nightwatch?\\n\' +\n       \'Edit\\n\' +\n       \'New Taskwhat Is Nightwatch?\\n\' +\n       \'Delete\\n\' +\n       \'New Taskwhat Is Nightwatch?\'\n  }'
        ],
        [
          '2023-04-06T10:19:48.112Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/element  ',
          '{ using: \'css selector\', value: \'input[type=&quot;checkbox&quot;]\' }'
        ],
        [
          '2023-04-06T10:19:48.114Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/element (2ms)',
          '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'9db02cb5-bb43-4ef1-b935-38a417240ee2\'\n     }\n  }'
        ],
        [
          '2023-04-06T10:19:48.117Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/9db02cb5-bb43-4ef1-b935-38a417240ee2/click  ',
          '{}'
        ],
        [
          '2023-04-06T10:19:48.327Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/9db02cb5-bb43-4ef1-b935-38a417240ee2/click (209ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:19:48.329Z',
          '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
          '{ using: \'css selector\', value: \'#todo-list ul li input:checked\' }'
        ],
        [
          '2023-04-06T10:19:48.331Z',
          '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'a6373a47-f735-4162-bb2d-36b5aa4756a4\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'56a696cc-b2f5-4300-8428-0bcf93409417\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9db02cb5-bb43-4ef1-b935-38a417240ee2\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:19:48.340Z',
          '  Request DELETE /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11  ',
          '\'\''
        ],
        [
          '2023-04-06T10:19:49.340Z',
          '  Response 200 DELETE /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11 (1000ms)',
          '{ value: null }'
        ]
      ]
    },
    ecosia: {
      reportPrefix: 'CHROME_111.0.5563.146__',
      assertionsCount: 5,
      lastError: null,
      skipped: [
      ],
      time: '3.056',
      timeMs: 3056,
      completed: {
        'Demo test ecosia.org': {
          time: '3.056',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Element <body> was visible after 39 milliseconds.',
              stackTrace: '',
              fullMsg: 'Element <body> was visible after 39 milliseconds.',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Testing if the page title contains \'Ecosia\' (7ms)',
              stackTrace: '',
              fullMsg: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Testing if element <input[type=search]> is visible (17ms)',
              stackTrace: '',
              fullMsg: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(17ms)\u001b[0m',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Testing if element <button[type=submit]> is visible (86ms)',
              stackTrace: '',
              fullMsg: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(86ms)\u001b[0m',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Testing if element <.layout__content> contains text \'Nightwatch.js\' (136ms)',
              stackTrace: '',
              fullMsg: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(136ms)\u001b[0m',
              failure: false
            }
          ],
          commands: [
          ],
          passed: 5,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 5,
          status: 'pass',
          steps: [
          ],
          stackTrace: '',
          testcases: {
            'Demo test ecosia.org': {
              time: '3.056',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Element <body> was visible after 39 milliseconds.',
                  stackTrace: '',
                  fullMsg: 'Element <body> was visible after 39 milliseconds.',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(17ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(17ms)\u001b[0m',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(86ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(86ms)\u001b[0m',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(136ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(136ms)\u001b[0m',
                  failure: false
                }
              ],
              tests: 5,
              commands: [
              ],
              passed: 5,
              errors: 0,
              failed: 0,
              skipped: 0,
              status: 'pass',
              steps: [
              ],
              stackTrace: '',
              timeMs: 3056,
              startTimestamp: 'Thu, 06 Apr 2023 10:18:37 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT'
            }
          },
          timeMs: 3056,
          startTimestamp: 'Thu, 06 Apr 2023 10:18:37 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT'
        }
      },
      completedSections: {
        __global_beforeEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __before_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'navigateTo',
              args: [
                'https://www.ecosia.org/'
              ],
              startTime: 1680776313426,
              endTime: 1680776317581,
              elapsedTime: 4155,
              status: 'pass',
              result: {
                status: 0
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        'Demo test ecosia.org': {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'waitForElementVisible',
              args: [
                'body'
              ],
              startTime: 1680776317585,
              endTime: 1680776317625,
              elapsedTime: 40,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'assert.titleContains',
              args: [
                'Ecosia'
              ],
              startTime: 1680776317626,
              endTime: 1680776317633,
              elapsedTime: 7,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'assert.visible',
              args: [
                'input[type=search]'
              ],
              startTime: 1680776317633,
              endTime: 1680776317653,
              elapsedTime: 20,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'setValue',
              args: [
                'input[type=search]',
                'nightwatch'
              ],
              startTime: 1680776317653,
              endTime: 1680776317770,
              elapsedTime: 117,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'assert.visible',
              args: [
                'button[type=submit]'
              ],
              startTime: 1680776317770,
              endTime: 1680776317857,
              elapsedTime: 87,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'click',
              args: [
                'button[type=submit]'
              ],
              startTime: 1680776317858,
              endTime: 1680776320498,
              elapsedTime: 2640,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'assert.textContains',
              args: [
                '.layout__content',
                'Nightwatch.js'
              ],
              startTime: 1680776320498,
              endTime: 1680776320637,
              elapsedTime: 139,
              status: 'pass',
              result: {
                status: 0
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __after_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'end',
              args: [
              ],
              startTime: 1680776320640,
              endTime: 1680776320701,
              elapsedTime: 61,
              status: 'pass'
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __global_afterEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        }
      },
      errmessages: [
      ],
      testsCount: 1,
      skippedCount: 0,
      failedCount: 0,
      errorsCount: 0,
      passedCount: 5,
      group: '',
      modulePath: '/examples/tests/ecosia.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:18:31 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT',
      sessionCapabilities: {
        acceptInsecureCerts: false,
        browserName: 'chrome',
        browserVersion: '111.0.5563.146',
        chrome: {
          chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
          userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.crT7I3'
        },
        'goog:chromeOptions': {
          debuggerAddress: 'localhost:52878'
        },
        networkConnectionEnabled: false,
        pageLoadStrategy: 'normal',
        platformName: 'mac os x',
        proxy: {
        },
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000
        },
        unhandledPromptBehavior: 'dismiss and notify',
        'webauthn:extension:credBlob': true,
        'webauthn:extension:largeBlob': true,
        'webauthn:extension:minPinLength': true,
        'webauthn:extension:prf': true,
        'webauthn:virtualAuthenticators': true
      },
      sessionId: '5e487662a1e1be6f6d821f923d21af64',
      projectName: '',
      buildName: '',
      testEnv: 'chrome',
      isMobile: false,
      status: 'pass',
      seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/ecosia_chromedriver.log',
      host: 'localhost',
      tests: 1,
      failures: 0,
      errors: 0,
      httpOutput: [
        [
          '2023-04-06T10:18:31.743Z',
          '  Request <b><span style="color:#0AA">POST /session  </span></b>',
          '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:33.414Z',
          '  Response 200 POST /session (1683ms)',
          '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.crT7I3&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52878&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;5e487662a1e1be6f6d821f923d21af64&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:33.429Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/url  </span></b>',
          '{ url: <span style="color:#0A0">&#39;https://www.ecosia.org/&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:37.580Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/url (4152ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:18:37.587Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.604Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (17ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f9443218-7896-44fc-9e32-b7d8642bade8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.608Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f9443218-7896-44fc-9e32-b7d8642bade8&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;f9443218-7896-44fc-9e32-b7d8642bade8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.624Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (16ms)',
          '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:37.629Z',
          '  Request <b><span style="color:#0AA">GET /session/5e487662a1e1be6f6d821f923d21af64/title  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:18:37.632Z',
          '  Response 200 GET /session/5e487662a1e1be6f6d821f923d21af64/title (4ms)',
          '{ value: <span style="color:#0A0">&#39;Ecosia - the search engine that plants trees&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:37.636Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.641Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (5ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b51dfbe1-4af2-44cb-85dc-a229a45c3c3f&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.642Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b51dfbe1-4af2-44cb-85dc-a229a45c3c3f&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;b51dfbe1-4af2-44cb-85dc-a229a45c3c3f&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.651Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (9ms)',
          '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:37.654Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.663Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (9ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b51dfbe1-4af2-44cb-85dc-a229a45c3c3f&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.664Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/clear  </span></b>',
          '{}'
        ],
        [
          '2023-04-06T10:18:37.683Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/clear (19ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:18:37.685Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/value  </span></b>',
          '{\n     text: <span style="color:#0A0">&#39;nightwatch&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.769Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/value (84ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:18:37.774Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.843Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (69ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;dfe9ef82-4e7e-407d-b76b-86de1443ac1b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.847Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;dfe9ef82-4e7e-407d-b76b-86de1443ac1b&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;dfe9ef82-4e7e-407d-b76b-86de1443ac1b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.855Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (9ms)',
          '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:37.860Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.864Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (4ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;dfe9ef82-4e7e-407d-b76b-86de1443ac1b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:37.865Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/element/dfe9ef82-4e7e-407d-b76b-86de1443ac1b/click  </span></b>',
          '{}'
        ],
        [
          '2023-04-06T10:18:40.497Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/dfe9ef82-4e7e-407d-b76b-86de1443ac1b/click (2632ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:18:40.501Z',
          '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;.layout__content&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:40.507Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (6ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;e3557007-ed36-4c86-b27a-7c09e9317276&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:40.509Z',
          '  Request <b><span style="color:#0AA">GET /session/5e487662a1e1be6f6d821f923d21af64/element/e3557007-ed36-4c86-b27a-7c09e9317276/text  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:18:40.634Z',
          '  Response 200 GET /session/5e487662a1e1be6f6d821f923d21af64/element/e3557007-ed36-4c86-b27a-7c09e9317276/text (125ms)',
          '{\n     value: <span style="color:#0A0">&#39;Search\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;https://nightwatchjs.org\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwa...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:40.643Z',
          '  Request <b><span style="color:#0AA">DELETE /session/5e487662a1e1be6f6d821f923d21af64  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:18:40.700Z',
          '  Response 200 DELETE /session/5e487662a1e1be6f6d821f923d21af64 (57ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ]
      ],
      rawHttpOutput: [
        [
          '2023-04-06T10:18:31.743Z',
          '  Request POST /session  ',
          '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
        ],
        [
          '2023-04-06T10:18:33.414Z',
          '  Response 200 POST /session (1683ms)',
          '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.crT7I3\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52878\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'5e487662a1e1be6f6d821f923d21af64\'\n     }\n  }'
        ],
        [
          '2023-04-06T10:18:33.429Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/url  ',
          '{ url: \'https://www.ecosia.org/\' }'
        ],
        [
          '2023-04-06T10:18:37.580Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/url (4152ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:18:37.587Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
          '{ using: \'css selector\', value: \'body\' }'
        ],
        [
          '2023-04-06T10:18:37.604Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (17ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f9443218-7896-44fc-9e32-b7d8642bade8\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.608Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f9443218-7896-44fc-9e32-b7d8642bade8\',\n         ELEMENT: \'f9443218-7896-44fc-9e32-b7d8642bade8\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.624Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (16ms)',
          '{ value: true }'
        ],
        [
          '2023-04-06T10:18:37.629Z',
          '  Request GET /session/5e487662a1e1be6f6d821f923d21af64/title  ',
          '\'\''
        ],
        [
          '2023-04-06T10:18:37.632Z',
          '  Response 200 GET /session/5e487662a1e1be6f6d821f923d21af64/title (4ms)',
          '{ value: \'Ecosia - the search engine that plants trees\' }'
        ],
        [
          '2023-04-06T10:18:37.636Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
          '{ using: \'css selector\', value: \'input[type=search]\' }'
        ],
        [
          '2023-04-06T10:18:37.641Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (5ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b51dfbe1-4af2-44cb-85dc-a229a45c3c3f\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.642Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b51dfbe1-4af2-44cb-85dc-a229a45c3c3f\',\n         ELEMENT: \'b51dfbe1-4af2-44cb-85dc-a229a45c3c3f\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.651Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (9ms)',
          '{ value: true }'
        ],
        [
          '2023-04-06T10:18:37.654Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
          '{ using: \'css selector\', value: \'input[type=search]\' }'
        ],
        [
          '2023-04-06T10:18:37.663Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (9ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b51dfbe1-4af2-44cb-85dc-a229a45c3c3f\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.664Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/clear  ',
          '{}'
        ],
        [
          '2023-04-06T10:18:37.683Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/clear (19ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:18:37.685Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/value  ',
          '{\n     text: \'nightwatch\',\n     value: [\n       \'n\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\'\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.769Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/value (84ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:18:37.774Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
          '{ using: \'css selector\', value: \'button[type=submit]\' }'
        ],
        [
          '2023-04-06T10:18:37.843Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (69ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'dfe9ef82-4e7e-407d-b76b-86de1443ac1b\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.847Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'dfe9ef82-4e7e-407d-b76b-86de1443ac1b\',\n         ELEMENT: \'dfe9ef82-4e7e-407d-b76b-86de1443ac1b\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.855Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (9ms)',
          '{ value: true }'
        ],
        [
          '2023-04-06T10:18:37.860Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
          '{ using: \'css selector\', value: \'button[type=submit]\' }'
        ],
        [
          '2023-04-06T10:18:37.864Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (4ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'dfe9ef82-4e7e-407d-b76b-86de1443ac1b\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:37.865Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/element/dfe9ef82-4e7e-407d-b76b-86de1443ac1b/click  ',
          '{}'
        ],
        [
          '2023-04-06T10:18:40.497Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/dfe9ef82-4e7e-407d-b76b-86de1443ac1b/click (2632ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:18:40.501Z',
          '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
          '{ using: \'css selector\', value: \'.layout__content\' }'
        ],
        [
          '2023-04-06T10:18:40.507Z',
          '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (6ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'e3557007-ed36-4c86-b27a-7c09e9317276\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:40.509Z',
          '  Request GET /session/5e487662a1e1be6f6d821f923d21af64/element/e3557007-ed36-4c86-b27a-7c09e9317276/text  ',
          '\'\''
        ],
        [
          '2023-04-06T10:18:40.634Z',
          '  Response 200 GET /session/5e487662a1e1be6f6d821f923d21af64/element/e3557007-ed36-4c86-b27a-7c09e9317276/text (125ms)',
          '{\n     value: \'Search\\n\' +\n       \'https://nightwatchjs.org\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwa...\',\n     suppressBase64Data: true\n  }'
        ],
        [
          '2023-04-06T10:18:40.643Z',
          '  Request DELETE /session/5e487662a1e1be6f6d821f923d21af64  ',
          '\'\''
        ],
        [
          '2023-04-06T10:18:40.700Z',
          '  Response 200 DELETE /session/5e487662a1e1be6f6d821f923d21af64 (57ms)',
          '{ value: null }'
        ]
      ]
    },
    'sample-with-relative-locators': {
      reportPrefix: 'CHROME_111.0.5563.146__',
      assertionsCount: 5,
      lastError: null,
      skipped: [
      ],
      time: '0.2180',
      timeMs: 218,
      completed: {
        'locate password input': {
          time: '0.09900',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
              stackTrace: '',
              fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input (29ms)',
              stackTrace: '',
              fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: "password" (37ms)',
              stackTrace: '',
              fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
              failure: false
            }
          ],
          commands: [
          ],
          passed: 3,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 3,
          status: 'pass',
          steps: [
          ],
          stackTrace: '',
          testcases: {
            'locate password input': {
              time: '0.09900',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                  stackTrace: '',
                  fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                  failure: false
                }
              ],
              tests: 3,
              commands: [
              ],
              passed: 3,
              errors: 0,
              failed: 0,
              skipped: 0,
              status: 'pass',
              steps: [
              ],
              stackTrace: '',
              timeMs: 99,
              startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
            }
          },
          timeMs: 99,
          startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
        },
        'fill in password input': {
          time: '0.1190',
          assertions: [
            {
              name: 'NightwatchAssertError',
              message: 'Element <form.login-form> was visible after 17 milliseconds.',
              stackTrace: '',
              fullMsg: 'Element <form.login-form> was visible after 17 milliseconds.',
              failure: false
            },
            {
              name: 'NightwatchAssertError',
              message: 'Testing if value of element <input[type=password]> equals \'password\' (11ms)',
              stackTrace: '',
              fullMsg: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(11ms)\u001b[0m',
              failure: false
            }
          ],
          commands: [
          ],
          passed: 2,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 2,
          status: 'pass',
          steps: [
          ],
          stackTrace: '',
          testcases: {
            'locate password input': {
              time: '0.09900',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                  stackTrace: '',
                  fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                  failure: false
                }
              ],
              tests: 3,
              commands: [
              ],
              passed: 3,
              errors: 0,
              failed: 0,
              skipped: 0,
              status: 'pass',
              steps: [
              ],
              stackTrace: '',
              timeMs: 99,
              startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
            },
            'fill in password input': {
              time: '0.1190',
              assertions: [
                {
                  name: 'NightwatchAssertError',
                  message: 'Element <form.login-form> was visible after 17 milliseconds.',
                  stackTrace: '',
                  fullMsg: 'Element <form.login-form> was visible after 17 milliseconds.',
                  failure: false
                },
                {
                  name: 'NightwatchAssertError',
                  message: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(11ms)\u001b[0m',
                  stackTrace: '',
                  fullMsg: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(11ms)\u001b[0m',
                  failure: false
                }
              ],
              tests: 2,
              commands: [
              ],
              passed: 2,
              errors: 0,
              failed: 0,
              skipped: 0,
              status: 'pass',
              steps: [
              ],
              stackTrace: '',
              timeMs: 119,
              startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
              endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
            }
          },
          timeMs: 119,
          startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
          endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
        }
      },
      completedSections: {
        __global_beforeEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __before_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'navigateTo',
              args: [
                'https://archive.org/account/login'
              ],
              startTime: 1680776312360,
              endTime: 1680776318569,
              elapsedTime: 6209,
              status: 'pass',
              result: {
                status: 0
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        'locate password input': {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'waitForElementVisible',
              args: [
                'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
              ],
              startTime: 1680776318572,
              endTime: 1680776318600,
              elapsedTime: 28,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'expect.element',
              args: [
                'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
              ],
              startTime: 1680776318601,
              endTime: 1680776318630,
              elapsedTime: 29,
              status: 'pass',
              result: {
              }
            },
            {
              name: 'expect.element',
              args: [
                'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
              ],
              startTime: 1680776318630,
              endTime: 1680776318668,
              elapsedTime: 38,
              status: 'pass',
              result: {
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        'fill in password input': {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'waitForElementVisible',
              args: [
                'form.login-form'
              ],
              startTime: 1680776318672,
              endTime: 1680776318689,
              elapsedTime: 17,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'setValue',
              args: [
                'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})',
                'password'
              ],
              startTime: 1680776318689,
              endTime: 1680776318775,
              elapsedTime: 86,
              status: 'pass',
              result: {
                status: 0
              }
            },
            {
              name: 'assert.valueEquals',
              args: [
                'input[type=password]',
                'password'
              ],
              startTime: 1680776318775,
              endTime: 1680776318787,
              elapsedTime: 12,
              status: 'pass',
              result: {
                status: 0
              }
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __after_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
            {
              name: 'end',
              args: [
              ],
              startTime: 1680776318790,
              endTime: 1680776318847,
              elapsedTime: 57,
              status: 'pass'
            }
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        },
        __global_afterEach_hook: {
          time: 0,
          assertions: [
          ],
          commands: [
          ],
          passed: 0,
          errors: 0,
          failed: 0,
          skipped: 0,
          tests: 0,
          status: 'pass'
        }
      },
      errmessages: [
      ],
      testsCount: 2,
      skippedCount: 0,
      failedCount: 0,
      errorsCount: 0,
      passedCount: 5,
      group: '',
      modulePath: '/examples/tests/sample-with-relative-locators.js',
      startTimestamp: 'Thu, 06 Apr 2023 10:18:30 GMT',
      endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
      sessionCapabilities: {
        acceptInsecureCerts: false,
        browserName: 'chrome',
        browserVersion: '111.0.5563.146',
        chrome: {
          chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
          userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.JaFqwI'
        },
        'goog:chromeOptions': {
          debuggerAddress: 'localhost:52856'
        },
        networkConnectionEnabled: false,
        pageLoadStrategy: 'normal',
        platformName: 'mac os x',
        proxy: {
        },
        setWindowRect: true,
        strictFileInteractability: false,
        timeouts: {
          implicit: 0,
          pageLoad: 300000,
          script: 30000
        },
        unhandledPromptBehavior: 'dismiss and notify',
        'webauthn:extension:credBlob': true,
        'webauthn:extension:largeBlob': true,
        'webauthn:extension:minPinLength': true,
        'webauthn:extension:prf': true,
        'webauthn:virtualAuthenticators': true
      },
      sessionId: '00dd2b665dc8d47d951758a8df6aab16',
      projectName: '',
      buildName: '',
      testEnv: 'chrome',
      isMobile: false,
      status: 'pass',
      seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/sample-with-relative-locators_chromedriver.log',
      host: 'localhost',
      tests: 2,
      failures: 0,
      errors: 0,
      httpOutput: [
        [
          '2023-04-06T10:18:30.901Z',
          '  Request <b><span style="color:#0AA">POST /session  </span></b>',
          '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:32.353Z',
          '  Response 200 POST /session (1454ms)',
          '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.JaFqwI&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52856&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;00dd2b665dc8d47d951758a8df6aab16&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:32.362Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/url  </span></b>',
          '{ url: <span style="color:#0A0">&#39;https://archive.org/account/login&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:38.567Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/url (6205ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:18:38.576Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.588Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (13ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;627a1655-8ce4-4fe9-9694-bc4027e6ce99&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;68c381f6-bdd6-4553-8fd2-f849a12688fd&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.590Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.599Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (9ms)',
          '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:38.603Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.616Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (14ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;627a1655-8ce4-4fe9-9694-bc4027e6ce99&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;68c381f6-bdd6-4553-8fd2-f849a12688fd&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.618Z',
          '  Request <b><span style="color:#0AA">GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/name  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:18:38.629Z',
          '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/name (11ms)',
          '{ value: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:38.633Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.654Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (22ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;627a1655-8ce4-4fe9-9694-bc4027e6ce99&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;68c381f6-bdd6-4553-8fd2-f849a12688fd&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.656Z',
          '  Request <b><span style="color:#0AA">GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/attribute/type  </span></b>',
          '<span style="color:#555">undefined<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:18:38.667Z',
          '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/attribute/type (12ms)',
          '{ value: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:38.673Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;form.login-form&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.680Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/elements (8ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8f46bd5c-745a-47f0-a218-d476c573a5cb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.682Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8f46bd5c-745a-47f0-a218-d476c573a5cb&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;8f46bd5c-745a-47f0-a218-d476c573a5cb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.689Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (7ms)',
          '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:38.691Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
          '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.697Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (6ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;627a1655-8ce4-4fe9-9694-bc4027e6ce99&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;68c381f6-bdd6-4553-8fd2-f849a12688fd&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.698Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/clear  </span></b>',
          '{}'
        ],
        [
          '2023-04-06T10:18:38.713Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/clear (15ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:18:38.714Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/value  </span></b>',
          '{\n     text: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;p&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;o&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;r&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;d&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.774Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/value (60ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ],
        [
          '2023-04-06T10:18:38.778Z',
          '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/elements  </span></b>',
          '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=password]&#39;<span style="color:#FFF"> }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.783Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/elements (5ms)',
          '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
        ],
        [
          '2023-04-06T10:18:38.784Z',
          '  Request <b><span style="color:#0AA">GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/property/value  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:18:38.786Z',
          '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/property/value (2ms)',
          '{ value: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF"> }</span></span>'
        ],
        [
          '2023-04-06T10:18:38.793Z',
          '  Request <b><span style="color:#0AA">DELETE /session/00dd2b665dc8d47d951758a8df6aab16  </span></b>',
          '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
        ],
        [
          '2023-04-06T10:18:38.846Z',
          '  Response 200 DELETE /session/00dd2b665dc8d47d951758a8df6aab16 (53ms)',
          '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
        ]
      ],
      rawHttpOutput: [
        [
          '2023-04-06T10:18:30.901Z',
          '  Request POST /session  ',
          '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
        ],
        [
          '2023-04-06T10:18:32.353Z',
          '  Response 200 POST /session (1454ms)',
          '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.JaFqwI\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52856\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'00dd2b665dc8d47d951758a8df6aab16\'\n     }\n  }'
        ],
        [
          '2023-04-06T10:18:32.362Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/url  ',
          '{ url: \'https://archive.org/account/login\' }'
        ],
        [
          '2023-04-06T10:18:38.567Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/url (6205ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:18:38.576Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.588Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (13ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'627a1655-8ce4-4fe9-9694-bc4027e6ce99\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'68c381f6-bdd6-4553-8fd2-f849a12688fd\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.590Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\',\n         ELEMENT: \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.599Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (9ms)',
          '{ value: true }'
        ],
        [
          '2023-04-06T10:18:38.603Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.616Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (14ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'627a1655-8ce4-4fe9-9694-bc4027e6ce99\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'68c381f6-bdd6-4553-8fd2-f849a12688fd\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.618Z',
          '  Request GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/name  ',
          '\'\''
        ],
        [
          '2023-04-06T10:18:38.629Z',
          '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/name (11ms)',
          '{ value: \'input\' }'
        ],
        [
          '2023-04-06T10:18:38.633Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.654Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (22ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'627a1655-8ce4-4fe9-9694-bc4027e6ce99\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'68c381f6-bdd6-4553-8fd2-f849a12688fd\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.656Z',
          '  Request GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/attribute/type  ',
          'undefined'
        ],
        [
          '2023-04-06T10:18:38.667Z',
          '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/attribute/type (12ms)',
          '{ value: \'password\' }'
        ],
        [
          '2023-04-06T10:18:38.673Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/elements  ',
          '{ using: \'css selector\', value: \'form.login-form\' }'
        ],
        [
          '2023-04-06T10:18:38.680Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/elements (8ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'8f46bd5c-745a-47f0-a218-d476c573a5cb\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.682Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'8f46bd5c-745a-47f0-a218-d476c573a5cb\',\n         ELEMENT: \'8f46bd5c-745a-47f0-a218-d476c573a5cb\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.689Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (7ms)',
          '{ value: true }'
        ],
        [
          '2023-04-06T10:18:38.691Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
          '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.697Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (6ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'627a1655-8ce4-4fe9-9694-bc4027e6ce99\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'68c381f6-bdd6-4553-8fd2-f849a12688fd\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.698Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/clear  ',
          '{}'
        ],
        [
          '2023-04-06T10:18:38.713Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/clear (15ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:18:38.714Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/value  ',
          '{\n     text: \'password\',\n     value: [\n       \'p\', \'a\', \'s\',\n       \'s\', \'w\', \'o\',\n       \'r\', \'d\'\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.774Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/value (60ms)',
          '{ value: null }'
        ],
        [
          '2023-04-06T10:18:38.778Z',
          '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/elements  ',
          '{ using: \'css selector\', value: \'input[type=password]\' }'
        ],
        [
          '2023-04-06T10:18:38.783Z',
          '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/elements (5ms)',
          '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       }\n     ]\n  }'
        ],
        [
          '2023-04-06T10:18:38.784Z',
          '  Request GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/property/value  ',
          '\'\''
        ],
        [
          '2023-04-06T10:18:38.786Z',
          '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/property/value (2ms)',
          '{ value: \'password\' }'
        ],
        [
          '2023-04-06T10:18:38.793Z',
          '  Request DELETE /session/00dd2b665dc8d47d951758a8df6aab16  ',
          '\'\''
        ],
        [
          '2023-04-06T10:18:38.846Z',
          '  Response 200 DELETE /session/00dd2b665dc8d47d951758a8df6aab16 (53ms)',
          '{ value: null }'
        ]
      ]
    }
  },
  modulesWithEnv: {
    chrome: {
      selectElement: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 1,
        lastError: null,
        skipped: [
        ],
        time: '2.865',
        timeMs: 2865,
        completed: {
          demoTest: {
            time: '2.865',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Forth option is selected (130ms)',
                stackTrace: '',
                fullMsg: 'Forth option is selected \u001b[0;90m(130ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 1,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 1,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              demoTest: {
                time: '2.865',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Forth option is selected \u001b[0;90m(130ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Forth option is selected \u001b[0;90m(130ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 1,
                commands: [
                ],
                passed: 1,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 2865,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:33 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT'
              }
            },
            timeMs: 2865,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:33 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          demoTest: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'url',
                args: [
                  'https://www.selenium.dev/selenium/web/formPage.html'
                ],
                startTime: 1680776313720,
                endTime: 1680776316325,
                elapsedTime: 2605,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'element().getAttribute',
                args: [
                  'tagName'
                ],
                startTime: 1680776316337,
                endTime: 1680776316373,
                elapsedTime: 36,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().findElement',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776316374,
                endTime: 1680776316383,
                elapsedTime: 9,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'perform',
                args: [
                  'function () { [native code] }'
                ],
                startTime: 1680776316330,
                endTime: 1680776316429,
                elapsedTime: 99,
                status: 'pass'
              },
              {
                name: 'element().findElement',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776316429,
                endTime: 1680776316439,
                elapsedTime: 10,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'assert.selected',
                args: [
                  '[object Object]',
                  'Forth option is selected'
                ],
                startTime: 1680776316440,
                endTime: 1680776316579,
                elapsedTime: 139,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776316589,
                endTime: 1680776316663,
                elapsedTime: 74,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 1,
        group: '',
        modulePath: '/examples/tests/selectElement.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:18:31 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.sR1HWF'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:52889'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: '94e5716f8bba3e2833067803902caa56',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/selectElement_chromedriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:18:31.939Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:33.711Z',
            '  Response 200 POST /session (1771ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.sR1HWF&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52889&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;94e5716f8bba3e2833067803902caa56&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:33.723Z',
            '  Request <b><span style="color:#0AA">POST /session/94e5716f8bba3e2833067803902caa56/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://www.selenium.dev/selenium/web/formPage.html&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:36.321Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/url (2598ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:36.340Z',
            '  Request <b><span style="color:#0AA">POST /session/94e5716f8bba3e2833067803902caa56/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;select[name=selectomatic]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.357Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/elements (17ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;89d09eaa-d9de-4096-a147-e9b869129fc5&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.359Z',
            '  Request <b><span style="color:#0AA">POST /session/94e5716f8bba3e2833067803902caa56/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var h=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=h;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (43188 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;89d09eaa-d9de-4096-a147-e9b869129fc5&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;89d09eaa-d9de-4096-a147-e9b869129fc5&#39;<span style="color:#FFF">\n       },\n       <span style="color:#0A0">&#39;tagName&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.372Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/execute/sync (13ms)',
            '{ value: <span style="color:#0A0">&#39;SELECT&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:36.375Z',
            '  Request <b><span style="color:#0AA">POST /session/94e5716f8bba3e2833067803902caa56/element/89d09eaa-d9de-4096-a147-e9b869129fc5/element  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;xpath&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;./option[. = &quot;Four&quot;]|./option[normalize-space(text()) = &quot;Four&quot;]|./optgroup/option[. = &quot;Four&quot;]|./optgroup/option[normalize-space(text()) = &quot;Four&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.383Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/element/89d09eaa-d9de-4096-a147-e9b869129fc5/element (8ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;5e26d261-54b0-4e9a-8896-4130d2dcb98f&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.384Z',
            '  Request <b><span style="color:#0AA">GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/selected  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:36.397Z',
            '  Response 200 GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/selected (13ms)',
            '{ value: <span style="color:#A50">false<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:36.399Z',
            '  Request <b><span style="color:#0AA">GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/enabled  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:36.407Z',
            '  Response 200 GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/enabled (8ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:36.408Z',
            '  Request <b><span style="color:#0AA">POST /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:18:36.428Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/click (20ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:36.431Z',
            '  Request <b><span style="color:#0AA">POST /session/94e5716f8bba3e2833067803902caa56/element/89d09eaa-d9de-4096-a147-e9b869129fc5/element  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;option[value=four]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.439Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/element/89d09eaa-d9de-4096-a147-e9b869129fc5/element (9ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;5e26d261-54b0-4e9a-8896-4130d2dcb98f&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.497Z',
            '  Request <b><span style="color:#0AA">GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/selected  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:36.570Z',
            '  Response 200 GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/selected (73ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:36.594Z',
            '  Request <b><span style="color:#0AA">DELETE /session/94e5716f8bba3e2833067803902caa56  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:36.653Z',
            '  Response 200 DELETE /session/94e5716f8bba3e2833067803902caa56 (59ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:18:31.939Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:33.711Z',
            '  Response 200 POST /session (1771ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.sR1HWF\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52889\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'94e5716f8bba3e2833067803902caa56\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:33.723Z',
            '  Request POST /session/94e5716f8bba3e2833067803902caa56/url  ',
            '{ url: \'https://www.selenium.dev/selenium/web/formPage.html\' }'
          ],
          [
            '2023-04-06T10:18:36.321Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/url (2598ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:36.340Z',
            '  Request POST /session/94e5716f8bba3e2833067803902caa56/elements  ',
            '{ using: \'css selector\', value: \'select[name=selectomatic]\' }'
          ],
          [
            '2023-04-06T10:18:36.357Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/elements (17ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'89d09eaa-d9de-4096-a147-e9b869129fc5\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:36.359Z',
            '  Request POST /session/94e5716f8bba3e2833067803902caa56/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var h=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=h;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (43188 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'89d09eaa-d9de-4096-a147-e9b869129fc5\',\n         ELEMENT: \'89d09eaa-d9de-4096-a147-e9b869129fc5\'\n       },\n       \'tagName\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:36.372Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/execute/sync (13ms)',
            '{ value: \'SELECT\' }'
          ],
          [
            '2023-04-06T10:18:36.375Z',
            '  Request POST /session/94e5716f8bba3e2833067803902caa56/element/89d09eaa-d9de-4096-a147-e9b869129fc5/element  ',
            '{\n     using: \'xpath\',\n     value: \'./option[. = &quot;Four&quot;]|./option[normalize-space(text()) = &quot;Four&quot;]|./optgroup/option[. = &quot;Four&quot;]|./optgroup/option[normalize-space(text()) = &quot;Four&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:36.383Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/element/89d09eaa-d9de-4096-a147-e9b869129fc5/element (8ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'5e26d261-54b0-4e9a-8896-4130d2dcb98f\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:36.384Z',
            '  Request GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/selected  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:36.397Z',
            '  Response 200 GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/selected (13ms)',
            '{ value: false }'
          ],
          [
            '2023-04-06T10:18:36.399Z',
            '  Request GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/enabled  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:36.407Z',
            '  Response 200 GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/enabled (8ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:18:36.408Z',
            '  Request POST /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:18:36.428Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/click (20ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:36.431Z',
            '  Request POST /session/94e5716f8bba3e2833067803902caa56/element/89d09eaa-d9de-4096-a147-e9b869129fc5/element  ',
            '{ using: \'css selector\', value: \'option[value=four]\' }'
          ],
          [
            '2023-04-06T10:18:36.439Z',
            '  Response 200 POST /session/94e5716f8bba3e2833067803902caa56/element/89d09eaa-d9de-4096-a147-e9b869129fc5/element (9ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'5e26d261-54b0-4e9a-8896-4130d2dcb98f\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:36.497Z',
            '  Request GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/selected  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:36.570Z',
            '  Response 200 GET /session/94e5716f8bba3e2833067803902caa56/element/5e26d261-54b0-4e9a-8896-4130d2dcb98f/selected (73ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:18:36.594Z',
            '  Request DELETE /session/94e5716f8bba3e2833067803902caa56  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:36.653Z',
            '  Response 200 DELETE /session/94e5716f8bba3e2833067803902caa56 (59ms)',
            '{ value: null }'
          ]
        ]
      },
      chromeCDP_example: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 1,
        lastError: null,
        skipped: [
        ],
        time: '4.659',
        timeMs: 4659,
        completed: {
          'using CDP DOM Snapshot': {
            time: '4.659',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Passed [deepStrictEqual]: [ \'documents\', \'strings\' ] deep strict equal [ \'documents\', \'strings\' ]',
                stackTrace: '',
                fullMsg: 'Passed [deepStrictEqual]: [ \'documents\', \'strings\' ] deep strict equal [ \'documents\', \'strings\' ]',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 1,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 1,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'using CDP DOM Snapshot': {
                time: '4.659',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Passed [deepStrictEqual]: [ \'documents\', \'strings\' ] deep strict equal [ \'documents\', \'strings\' ]',
                    stackTrace: '',
                    fullMsg: 'Passed [deepStrictEqual]: [ \'documents\', \'strings\' ] deep strict equal [ \'documents\', \'strings\' ]',
                    failure: false
                  }
                ],
                tests: 1,
                commands: [
                ],
                passed: 1,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 4659,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:32 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT'
              }
            },
            timeMs: 4659,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:32 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'using CDP DOM Snapshot': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://nightwatchjs.org'
                ],
                startTime: 1680776312030,
                endTime: 1680776316532,
                elapsedTime: 4502,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'chrome.sendAndGetDevToolsCommand',
                args: [
                  'DOMSnapshot.captureSnapshot',
                  '[object Object]'
                ],
                startTime: 1680776316535,
                endTime: 1680776316678,
                elapsedTime: 143,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'assert.deepStrictEqual',
                args: [
                ],
                startTime: 1680776316682,
                endTime: 1680776316683,
                elapsedTime: 1,
                status: 'pass',
                result: {
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776316691,
                endTime: 1680776316763,
                elapsedTime: 72,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 1,
        group: '',
        modulePath: '/examples/tests/chromeCDP_example.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:18:30 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.skcAKm'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:52846'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: '763e49ab4471f28def3e033fb0d643bd',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/chromeCDP_example_chromedriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:18:30.487Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:32.015Z',
            '  Response 200 POST /session (1530ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.skcAKm&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52846&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;763e49ab4471f28def3e033fb0d643bd&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:32.056Z',
            '  Request <b><span style="color:#0AA">POST /session/763e49ab4471f28def3e033fb0d643bd/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://nightwatchjs.org&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:36.529Z',
            '  Response 200 POST /session/763e49ab4471f28def3e033fb0d643bd/url (4475ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:36.537Z',
            '  Request <b><span style="color:#0AA">POST /session/763e49ab4471f28def3e033fb0d643bd/chromium/send_command_and_get_result  </span></b>',
            '{ cmd: <span style="color:#0A0">&#39;DOMSnapshot.captureSnapshot&#39;<span style="color:#FFF">, params: { computedStyles: [] } }</span></span>'
          ],
          [
            '2023-04-06T10:18:36.666Z',
            '  Response 200 POST /session/763e49ab4471f28def3e033fb0d643bd/chromium/send_command_and_get_result (112ms)',
            '{\n     value: {\n       documents: [\n         {\n           baseURL: <span style="color:#A50">0<span style="color:#FFF">,\n           contentHeight: <span style="color:#A50">3974<span style="color:#FFF">,\n           contentLanguage: <span style="color:#A50">-1<span style="color:#FFF">,\n           contentWidth: <span style="color:#A50">1185<span style="color:#FFF">,\n           documentURL: <span style="color:#A50">0<span style="color:#FFF">,\n           encodingName: <span style="color:#A50">2<span style="color:#FFF">,\n           frameId: <span style="color:#A50">3<span style="color:#FFF">,\n           layout: {\n             bounds: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             nodeIndex: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             stackingContexts: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             styles: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             text: <span style="color:#0AA">[Array]<span style="color:#FFF">\n           },\n           nodes: {\n             attributes: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             backendNodeId: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             contentDocumentIndex: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             currentSourceURL: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             inputChecked: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             inputValue: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             isClickable: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             nodeName: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             nodeType: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             nodeValue: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             optionSelected: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             originURL: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             parentIndex: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             pseudoIdentifier: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             pseudoType: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             shadowRootType: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             textValue: <span style="color:#0AA">[Object]<span style="color:#FFF">\n           },\n           publicId: <span style="color:#A50">-1<span style="color:#FFF">,\n           scrollOffsetX: <span style="color:#A50">0<span style="color:#FFF">,\n           scrollOffsetY: <span style="color:#A50">0<span style="color:#FFF">,\n           systemId: <span style="color:#A50">-1<span style="color:#FFF">,\n           textBoxes: {\n             bounds: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             layoutIndex: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             length: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             start: <span style="color:#0AA">[Array]<span style="color:#FFF">\n           },\n           title: <span style="color:#A50">1<span style="color:#FFF">\n         },\n         {\n           baseURL: <span style="color:#A50">0<span style="color:#FFF">,\n           contentHeight: <span style="color:#A50">125<span style="color:#FFF">,\n           contentLanguage: <span style="color:#A50">-1<span style="color:#FFF">,\n           contentWidth: <span style="color:#A50">275<span style="color:#FFF">,\n           documentURL: <span style="color:#A50">695<span style="color:#FFF">,\n           encodingName: <span style="color:#A50">2<span style="color:#FFF">,\n           frameId: <span style="color:#A50">696<span style="color:#FFF">,\n           layout: {\n             bounds: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             nodeIndex: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             stackingContexts: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             styles: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             text: <span style="color:#0AA">[Array]<span style="color:#FFF">\n           },\n           nodes: {\n             attributes: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             backendNodeId: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             contentDocumentIndex: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             currentSourceURL: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             inputChecked: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             inputValue: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             isClickable: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             nodeName: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             nodeType: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             nodeValue: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             optionSelected: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             originURL: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             parentIndex: <span style="color:#0AA">[Array]<span style="color:#FFF">,\n             pseudoIdentifier: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             pseudoType: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             shadowRootType: <span style="color:#0AA">[Object]<span style="color:#FFF">,\n             textValue: <span style="color:#0AA">[Object]<span style="color:#FFF">\n           },\n           publicId: <span style="color:#A50">-1<span style="color:#FFF">,\n           scrollOffsetX: <span style="color:#A50">0<span style="color:#FFF">,\n           scrollOffsetY: <span style="color:#A50">0<span style="color:#FFF">,\n           systemId: <span style="color:#A50">-1<span style="color:#FFF">,\n           textBoxes: { bounds: [], layoutIndex: [], length: [], start: [] },\n           title: <span style="color:#A50">-1<span style="color:#FFF">\n         }\n       ],\n       strings: [\n         <span style="color:#0A0">&#39;https://nightwatchjs.org/&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;UTF-8&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;5C751C5A821E5E78F3EBEACD0F8DB3AE&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;#document&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;html&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;HTML&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;lang&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;en&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;data-uri&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;HEAD&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;#text&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;\\n  &#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;META&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;charset&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;utf-8&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;\\n&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;TITLE&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;name&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;description&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;content&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;Write efficient end-to-end tests in Node.js and run them against W3C WebDriver.&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;http-equiv&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;X-UA-Compatible&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;IE=edge&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;viewport&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;width=device-width, initial-scale=1, shrink-to-fit=no&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;\\n\\n&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;property&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;og:title&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;Nightwatch.js |  Node.js powered End-to-End testing framework&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;og:image&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/img/banners/nightwatch.jpg&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;og:site_name&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;Nightwatch.js&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;og:type&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;website&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;og:description&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;og:url&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;twitter:title&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;twitter:description&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;twitter:image&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;twitter:card&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;summary_large_image&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;twitter:site&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;@nightwatchjs&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;twitter:creator&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;referrer&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;no-referrer-when-downgrade&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;google-site-verification&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;LGNZ66nvi-gru5DR_bV3jry2hqvlMoijhdWZkVT41ZM&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;docsearch:language&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;docsearch:version&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;1.0.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;LINK&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;rel&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;preconnect&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;href&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://fonts.googleapis.com&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://fonts.gstatic.com&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;crossorigin&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;SCRIPT&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;type&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;text/javascript&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;async&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;src&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://www.googletagmanager.com/gtag/js?id=G-NJ5GYXJRCQ&amp;l=dataLayer&amp;cx=c&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;(function(p,h) {\\n&#39;<span style="color:#FFF"> +\n           <span style="color:#0A0">&quot;  p=p.replace(/\\\\/api\\\\/.+\\\\.html$/,&#39;/api/$method&#39;);\\n&quot;<span style="color:#FFF"> +\n           <span style="color:#0A0">&quot;  p=p.replace(/\\\\/blog\\\\/.+\\\\.html$/,&#39;/blog/article&#39;);\\n&quot;<span style="color:#FFF"> +\n           <span style="color:#0A0">&quot;  var q = p.split(&#39;/&#39;); q.shift();\\n&quot;<span style="color:#FFF"> +\n           <span style="color:#0A0">&quot;  h.setAttribute(&#39;data-uri&#39;,(p!=&#39;/&#39;?&#39;/&#39;+q.join(&#39;/&#39;):p));\\n&quot;<span style="color:#FFF"> +\n           <span style="color:#0A0">&#39;})(location.pathname,document.documentElement);\\n&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&quot;\\n  document.domain = &#39;nightwatchjs.org&#39;;\\n&quot;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/themes/prism.css&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;stylesheet&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;integrity&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;anonymous&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/main.css?v=1103522931&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/sidebar.css?v=1103521931&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/style.css?v=1103620931&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/mobile.css&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/docsearch.css&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&amp;display=swap&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;data-tag&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;font&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://fonts.googleapis.com/css2?family=Spartan:wght@500;600;700&amp;display=swap&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/style1.css?v=1103620931&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/desktop.css?v=1103620931&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/tablet.css?v=1103620931&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;/css/mobile1.css?v=1103620931&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://unpkg.com/@stackblitz/sdk@1.8.2/bundles/sdk.umd.js&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;#comment&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39; Adding synchronous VWO snippet to  prevent flickering issue &#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://dev.visualwebsiteoptimizer.com/lib/366135.js&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;id&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;vwoCode&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;onerror&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;window.vwoSyncTpcFailed=true&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;https://dev.visualwebsiteoptimizer.com/tpc?a=366135&amp;r=0.7714095575006725&#39;<span style="color:#FFF">,\n         ... 597 more items\n       ]\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.696Z',
            '  Request <b><span style="color:#0AA">DELETE /session/763e49ab4471f28def3e033fb0d643bd  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:36.756Z',
            '  Response 200 DELETE /session/763e49ab4471f28def3e033fb0d643bd (59ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:18:30.487Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:32.015Z',
            '  Response 200 POST /session (1530ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.skcAKm\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52846\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'763e49ab4471f28def3e033fb0d643bd\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:32.056Z',
            '  Request POST /session/763e49ab4471f28def3e033fb0d643bd/url  ',
            '{ url: \'https://nightwatchjs.org\' }'
          ],
          [
            '2023-04-06T10:18:36.529Z',
            '  Response 200 POST /session/763e49ab4471f28def3e033fb0d643bd/url (4475ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:36.537Z',
            '  Request POST /session/763e49ab4471f28def3e033fb0d643bd/chromium/send_command_and_get_result  ',
            '{ cmd: \'DOMSnapshot.captureSnapshot\', params: { computedStyles: [] } }'
          ],
          [
            '2023-04-06T10:18:36.666Z',
            '  Response 200 POST /session/763e49ab4471f28def3e033fb0d643bd/chromium/send_command_and_get_result (112ms)',
            '{\n     value: {\n       documents: [\n         {\n           baseURL: 0,\n           contentHeight: 3974,\n           contentLanguage: -1,\n           contentWidth: 1185,\n           documentURL: 0,\n           encodingName: 2,\n           frameId: 3,\n           layout: {\n             bounds: [Array],\n             nodeIndex: [Array],\n             stackingContexts: [Object],\n             styles: [Array],\n             text: [Array]\n           },\n           nodes: {\n             attributes: [Array],\n             backendNodeId: [Array],\n             contentDocumentIndex: [Object],\n             currentSourceURL: [Object],\n             inputChecked: [Object],\n             inputValue: [Object],\n             isClickable: [Object],\n             nodeName: [Array],\n             nodeType: [Array],\n             nodeValue: [Array],\n             optionSelected: [Object],\n             originURL: [Object],\n             parentIndex: [Array],\n             pseudoIdentifier: [Object],\n             pseudoType: [Object],\n             shadowRootType: [Object],\n             textValue: [Object]\n           },\n           publicId: -1,\n           scrollOffsetX: 0,\n           scrollOffsetY: 0,\n           systemId: -1,\n           textBoxes: {\n             bounds: [Array],\n             layoutIndex: [Array],\n             length: [Array],\n             start: [Array]\n           },\n           title: 1\n         },\n         {\n           baseURL: 0,\n           contentHeight: 125,\n           contentLanguage: -1,\n           contentWidth: 275,\n           documentURL: 695,\n           encodingName: 2,\n           frameId: 696,\n           layout: {\n             bounds: [Array],\n             nodeIndex: [Array],\n             stackingContexts: [Object],\n             styles: [Array],\n             text: [Array]\n           },\n           nodes: {\n             attributes: [Array],\n             backendNodeId: [Array],\n             contentDocumentIndex: [Object],\n             currentSourceURL: [Object],\n             inputChecked: [Object],\n             inputValue: [Object],\n             isClickable: [Object],\n             nodeName: [Array],\n             nodeType: [Array],\n             nodeValue: [Array],\n             optionSelected: [Object],\n             originURL: [Object],\n             parentIndex: [Array],\n             pseudoIdentifier: [Object],\n             pseudoType: [Object],\n             shadowRootType: [Object],\n             textValue: [Object]\n           },\n           publicId: -1,\n           scrollOffsetX: 0,\n           scrollOffsetY: 0,\n           systemId: -1,\n           textBoxes: { bounds: [], layoutIndex: [], length: [], start: [] },\n           title: -1\n         }\n       ],\n       strings: [\n         \'https://nightwatchjs.org/\',\n         \'Nightwatch.js | Node.js powered End-to-End testing framework\',\n         \'UTF-8\',\n         \'5C751C5A821E5E78F3EBEACD0F8DB3AE\',\n         \'#document\',\n         \'html\',\n         \'HTML\',\n         \'lang\',\n         \'en\',\n         \'data-uri\',\n         \'/\',\n         \'HEAD\',\n         \'#text\',\n         \'\\n  \',\n         \'META\',\n         \'charset\',\n         \'utf-8\',\n         \'\\n\',\n         \'TITLE\',\n         \'name\',\n         \'description\',\n         \'content\',\n         \'Write efficient end-to-end tests in Node.js and run them against W3C WebDriver.\',\n         \'http-equiv\',\n         \'X-UA-Compatible\',\n         \'IE=edge\',\n         \'viewport\',\n         \'width=device-width, initial-scale=1, shrink-to-fit=no\',\n         \'\\n\\n\',\n         \'property\',\n         \'og:title\',\n         \'Nightwatch.js |  Node.js powered End-to-End testing framework\',\n         \'og:image\',\n         \'/img/banners/nightwatch.jpg\',\n         \'og:site_name\',\n         \'Nightwatch.js\',\n         \'og:type\',\n         \'website\',\n         \'og:description\',\n         \'og:url\',\n         \'twitter:title\',\n         \'twitter:description\',\n         \'twitter:image\',\n         \'twitter:card\',\n         \'summary_large_image\',\n         \'twitter:site\',\n         \'@nightwatchjs\',\n         \'twitter:creator\',\n         \'referrer\',\n         \'no-referrer-when-downgrade\',\n         \'google-site-verification\',\n         \'LGNZ66nvi-gru5DR_bV3jry2hqvlMoijhdWZkVT41ZM\',\n         \'docsearch:language\',\n         \'docsearch:version\',\n         \'1.0.0\',\n         \'LINK\',\n         \'rel\',\n         \'preconnect\',\n         \'href\',\n         \'https://fonts.googleapis.com\',\n         \'https://fonts.gstatic.com\',\n         \'crossorigin\',\n         \'SCRIPT\',\n         \'type\',\n         \'text/javascript\',\n         \'async\',\n         \'src\',\n         \'https://www.googletagmanager.com/gtag/js?id=G-NJ5GYXJRCQ&amp;l=dataLayer&amp;cx=c\',\n         \'(function(p,h) {\\n\' +\n           &quot;  p=p.replace(/\\\\/api\\\\/.+\\\\.html$/,\'/api/$method\');\\n&quot; +\n           &quot;  p=p.replace(/\\\\/blog\\\\/.+\\\\.html$/,\'/blog/article\');\\n&quot; +\n           &quot;  var q = p.split(\'/\'); q.shift();\\n&quot; +\n           &quot;  h.setAttribute(\'data-uri\',(p!=\'/\'?\'/\'+q.join(\'/\'):p));\\n&quot; +\n           \'})(location.pathname,document.documentElement);\\n\',\n         &quot;\\n  document.domain = \'nightwatchjs.org\';\\n&quot;,\n         \'/css/themes/prism.css\',\n         \'stylesheet\',\n         \'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\',\n         \'integrity\',\n         \'sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\',\n         \'anonymous\',\n         \'/css/main.css?v=1103522931\',\n         \'/css/sidebar.css?v=1103521931\',\n         \'/css/style.css?v=1103620931\',\n         \'/css/mobile.css\',\n         \'/css/docsearch.css\',\n         \'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&amp;display=swap\',\n         \'data-tag\',\n         \'font\',\n         \'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&amp;display=swap\',\n         \'https://fonts.googleapis.com/css2?family=Spartan:wght@500;600;700&amp;display=swap\',\n         \'/css/style1.css?v=1103620931\',\n         \'/css/desktop.css?v=1103620931\',\n         \'/css/tablet.css?v=1103620931\',\n         \'/css/mobile1.css?v=1103620931\',\n         \'//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js\',\n         \'https://unpkg.com/@stackblitz/sdk@1.8.2/bundles/sdk.umd.js\',\n         \'#comment\',\n         \' Adding synchronous VWO snippet to  prevent flickering issue \',\n         \'https://dev.visualwebsiteoptimizer.com/lib/366135.js\',\n         \'id\',\n         \'vwoCode\',\n         \'onerror\',\n         \'window.vwoSyncTpcFailed=true\',\n         \'https://dev.visualwebsiteoptimizer.com/tpc?a=366135&amp;r=0.7714095575006725\',\n         ... 597 more items\n       ]\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:36.696Z',
            '  Request DELETE /session/763e49ab4471f28def3e033fb0d643bd  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:36.756Z',
            '  Response 200 DELETE /session/763e49ab4471f28def3e033fb0d643bd (59ms)',
            '{ value: null }'
          ]
        ]
      },
      angularTodoTest: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 2,
        lastError: null,
        skipped: [
        ],
        time: '3.868',
        timeMs: 3868,
        completed: {
          'should add a todo using custom commands': {
            time: '3.868',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <web element{eb6ac9cd-78c6-4755-befd-add49d3d25f4}> text to equal: "what is nightwatch?" (14ms)',
                stackTrace: '',
                fullMsg: 'Expected element <web element{eb6ac9cd-78c6-4755-befd-add49d3d25f4}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (14ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected elements <*[module=todoApp] li .done-true> count to equal: "2" (11ms)',
                stackTrace: '',
                fullMsg: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (11ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 2,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 2,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'should add a todo using custom commands': {
                time: '3.868',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <web element{eb6ac9cd-78c6-4755-befd-add49d3d25f4}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (14ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <web element{eb6ac9cd-78c6-4755-befd-add49d3d25f4}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (14ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (11ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (11ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 2,
                commands: [
                ],
                passed: 2,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 3868,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:32 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT'
              }
            },
            timeMs: 3868,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:32 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'should add a todo using custom commands': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://angularjs.org'
                ],
                startTime: 1680776312935,
                endTime: 1680776315920,
                elapsedTime: 2985,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'sendKeys',
                args: [
                  '[ng-model="todoList.todoText"]',
                  'what is nightwatch?'
                ],
                startTime: 1680776315922,
                endTime: 1680776316268,
                elapsedTime: 346,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'click',
                args: [
                  '[value="add"]'
                ],
                startTime: 1680776316269,
                endTime: 1680776316537,
                elapsedTime: 268,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'getElementsInList',
                args: [
                  'todoList.todos'
                ],
                startTime: 1680776316537,
                endTime: 1680776316724,
                elapsedTime: 187,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'expect.element',
                args: [
                  'web element{eb6ac9cd-78c6-4755-befd-add49d3d25f4}'
                ],
                startTime: 1680776316730,
                endTime: 1680776316744,
                elapsedTime: 14,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().findElement',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776316745,
                endTime: 1680776316759,
                elapsedTime: 14,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'click',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776316761,
                endTime: 1680776316784,
                elapsedTime: 23,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.elements',
                args: [
                  '*[module=todoApp] li .done-true'
                ],
                startTime: 1680776316785,
                endTime: 1680776316797,
                elapsedTime: 12,
                status: 'pass',
                result: {
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776316804,
                endTime: 1680776316866,
                elapsedTime: 62,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 2,
        group: '',
        modulePath: '/examples/tests/angularTodoTest.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:18:31 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:18:36 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.M6WcDk'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:52862'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: 'e5d3ec370d703ed8b3e183646feca185',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/angularTodoTest_chromedriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:18:31.172Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:32.923Z',
            '  Response 200 POST /session (1754ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.M6WcDk&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52862&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;e5d3ec370d703ed8b3e183646feca185&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:32.937Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://angularjs.org&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:35.916Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/url (2979ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:35.934Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[ng-model=&quot;todoList.todoText&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.081Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/elements (149ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;c50fa868-aafd-473a-a56c-95ffaf96d2cf&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.084Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/element/c50fa868-aafd-473a-a56c-95ffaf96d2cf/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;?&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.267Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/element/c50fa868-aafd-473a-a56c-95ffaf96d2cf/value (184ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:36.271Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[value=&quot;add&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.287Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/elements (17ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;525d123b-4f69-4d7b-ab2b-003108e17304&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.290Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/element/525d123b-4f69-4d7b-ab2b-003108e17304/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:18:36.536Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/element/525d123b-4f69-4d7b-ab2b-003108e17304/click (246ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:36.540Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;var passedArgs = Array.prototype.slice.call(arguments,0); return (function(listName) {\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      // executed in the browser context\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      // eslint-disable-next-line\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      var elements = document.querySel... (366 characters)&#39;<span style="color:#FFF">,\n     args: [ <span style="color:#0A0">&#39;todoList.todos&#39;<span style="color:#FFF"> ]\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.723Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/execute/sync (183ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2e22efb9-0a46-4516-81b0-a993c7c989f3&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;4f63fa26-dfdc-45c1-97a0-15dc316f826d&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;eb6ac9cd-78c6-4755-befd-add49d3d25f4&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.732Z',
            '  Request <b><span style="color:#0AA">GET /session/e5d3ec370d703ed8b3e183646feca185/element/eb6ac9cd-78c6-4755-befd-add49d3d25f4/text  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:36.742Z',
            '  Response 200 GET /session/e5d3ec370d703ed8b3e183646feca185/element/eb6ac9cd-78c6-4755-befd-add49d3d25f4/text (11ms)',
            '{ value: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:36.746Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/element/eb6ac9cd-78c6-4755-befd-add49d3d25f4/element  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.758Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/element/eb6ac9cd-78c6-4755-befd-add49d3d25f4/element (12ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;e8e3ad00-c40d-454a-b04c-c8f8480f1cc9&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.762Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/element/e8e3ad00-c40d-454a-b04c-c8f8480f1cc9/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:18:36.784Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/element/e8e3ad00-c40d-454a-b04c-c8f8480f1cc9/click (22ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:36.786Z',
            '  Request <b><span style="color:#0AA">POST /session/e5d3ec370d703ed8b3e183646feca185/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;*[module=todoApp] li .done-true&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.796Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/elements (10ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed8be05e-d30f-41c0-abc9-de5cf301c122&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;53da4b20-ed6f-47f0-ad0f-fd48a68edfe7&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.808Z',
            '  Request <b><span style="color:#0AA">DELETE /session/e5d3ec370d703ed8b3e183646feca185  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:36.863Z',
            '  Response 200 DELETE /session/e5d3ec370d703ed8b3e183646feca185 (55ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:18:31.172Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:32.923Z',
            '  Response 200 POST /session (1754ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.M6WcDk\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52862\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'e5d3ec370d703ed8b3e183646feca185\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:32.937Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/url  ',
            '{ url: \'https://angularjs.org\' }'
          ],
          [
            '2023-04-06T10:18:35.916Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/url (2979ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:35.934Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/elements  ',
            '{ using: \'css selector\', value: \'[ng-model=&quot;todoList.todoText&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:36.081Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/elements (149ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'c50fa868-aafd-473a-a56c-95ffaf96d2cf\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:36.084Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/element/c50fa868-aafd-473a-a56c-95ffaf96d2cf/value  ',
            '{\n     text: \'what is nightwatch?\',\n     value: [\n       \'w\', \'h\', \'a\', \'t\', \' \',\n       \'i\', \'s\', \' \', \'n\', \'i\',\n       \'g\', \'h\', \'t\', \'w\', \'a\',\n       \'t\', \'c\', \'h\', \'?\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:36.267Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/element/c50fa868-aafd-473a-a56c-95ffaf96d2cf/value (184ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:36.271Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/elements  ',
            '{ using: \'css selector\', value: \'[value=&quot;add&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:36.287Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/elements (17ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'525d123b-4f69-4d7b-ab2b-003108e17304\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:36.290Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/element/525d123b-4f69-4d7b-ab2b-003108e17304/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:18:36.536Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/element/525d123b-4f69-4d7b-ab2b-003108e17304/click (246ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:36.540Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/execute/sync  ',
            '{\n     script: \'var passedArgs = Array.prototype.slice.call(arguments,0); return (function(listName) {\\n\' +\n       \'      // executed in the browser context\\n\' +\n       \'      // eslint-disable-next-line\\n\' +\n       \'      var elements = document.querySel... (366 characters)\',\n     args: [ \'todoList.todos\' ]\n  }'
          ],
          [
            '2023-04-06T10:18:36.723Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/execute/sync (183ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2e22efb9-0a46-4516-81b0-a993c7c989f3\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'4f63fa26-dfdc-45c1-97a0-15dc316f826d\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'eb6ac9cd-78c6-4755-befd-add49d3d25f4\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:36.732Z',
            '  Request GET /session/e5d3ec370d703ed8b3e183646feca185/element/eb6ac9cd-78c6-4755-befd-add49d3d25f4/text  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:36.742Z',
            '  Response 200 GET /session/e5d3ec370d703ed8b3e183646feca185/element/eb6ac9cd-78c6-4755-befd-add49d3d25f4/text (11ms)',
            '{ value: \'what is nightwatch?\' }'
          ],
          [
            '2023-04-06T10:18:36.746Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/element/eb6ac9cd-78c6-4755-befd-add49d3d25f4/element  ',
            '{ using: \'css selector\', value: \'input\' }'
          ],
          [
            '2023-04-06T10:18:36.758Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/element/eb6ac9cd-78c6-4755-befd-add49d3d25f4/element (12ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'e8e3ad00-c40d-454a-b04c-c8f8480f1cc9\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:36.762Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/element/e8e3ad00-c40d-454a-b04c-c8f8480f1cc9/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:18:36.784Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/element/e8e3ad00-c40d-454a-b04c-c8f8480f1cc9/click (22ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:36.786Z',
            '  Request POST /session/e5d3ec370d703ed8b3e183646feca185/elements  ',
            '{ using: \'css selector\', value: \'*[module=todoApp] li .done-true\' }'
          ],
          [
            '2023-04-06T10:18:36.796Z',
            '  Response 200 POST /session/e5d3ec370d703ed8b3e183646feca185/elements (10ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed8be05e-d30f-41c0-abc9-de5cf301c122\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'53da4b20-ed6f-47f0-ad0f-fd48a68edfe7\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:36.808Z',
            '  Request DELETE /session/e5d3ec370d703ed8b3e183646feca185  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:36.863Z',
            '  Response 200 DELETE /session/e5d3ec370d703ed8b3e183646feca185 (55ms)',
            '{ value: null }'
          ]
        ]
      },
      duckDuckGo: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 1,
        lastError: {
          name: 'NightwatchAssertError',
          message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5108ms)\u001b[0m',
          showDiff: false,
          abortOnFailure: true,
          waitFor: true,
          stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
        },
        skipped: [
        ],
        time: '8.932',
        timeMs: 8932,
        completed: {
          'Search Nightwatch.js and check results': {
            time: '8.932',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5108ms)',
                stackTrace: '    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                fullMsg: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5108ms)\u001b[0m',
                failure: 'Expected "visible" but got: "not found"',
                screenshots: [
                  '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154840-GMT+0530.png'
                ]
              }
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 1,
            skipped: 0,
            tests: 1,
            status: 'fail',
            steps: [
            ],
            stackTrace: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
            testcases: {
              'Search Nightwatch.js and check results': {
                time: '8.932',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5108ms)\u001b[0m',
                    stackTrace: '    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                    fullMsg: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5108ms)\u001b[0m',
                    failure: 'Expected "visible" but got: "not found"',
                    screenshots: [
                      '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154840-GMT+0530.png'
                    ]
                  }
                ],
                tests: 1,
                commands: [
                ],
                passed: 0,
                errors: 0,
                failed: 1,
                skipped: 0,
                status: 'fail',
                steps: [
                ],
                stackTrace: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                lastError: {
                  name: 'NightwatchAssertError',
                  message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5108ms)\u001b[0m',
                  showDiff: false,
                  abortOnFailure: true,
                  waitFor: true,
                  stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
                },
                timeMs: 8932,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:31 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT'
              }
            },
            lastError: {
              name: 'NightwatchAssertError',
              message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5108ms)\u001b[0m',
              showDiff: false,
              abortOnFailure: true,
              waitFor: true,
              stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
            },
            timeMs: 8932,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:31 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'Search Nightwatch.js and check results': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://duckduckgo.com'
                ],
                startTime: 1680776311602,
                endTime: 1680776315235,
                elapsedTime: 3633,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'waitForElementVisible',
                args: [
                  '#search_form_input_homepage'
                ],
                startTime: 1680776315238,
                endTime: 1680776320353,
                elapsedTime: 5115,
                status: 'fail',
                result: {
                  message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5108ms)',
                  showDiff: false,
                  name: 'NightwatchAssertError',
                  abortOnFailure: true,
                  stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                  beautifiedStack: {
                    filePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js',
                    error_line_number: 8,
                    codeSnippet: [
                      {
                        line_number: 6,
                        code: '    browser'
                      },
                      {
                        line_number: 7,
                        code: '      .navigateTo(\'https://duckduckgo.com\')'
                      },
                      {
                        line_number: 8,
                        code: '      .waitForElementVisible(\'#search_form_input_homepage\')'
                      },
                      {
                        line_number: 9,
                        code: '      .sendKeys(\'#search_form_input_homepage\', [\'Nightwatch.js\'])'
                      },
                      {
                        line_number: 10,
                        code: '      .click(\'#search_button_homepage\')'
                      }
                    ]
                  }
                },
                screenshot: '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154840-GMT+0530.png'
              },
              {
                name: 'saveScreenshot',
                args: [
                  '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154840-GMT+0530.png',
                  'function () { [native code] }'
                ],
                startTime: 1680776320407,
                endTime: 1680776320529,
                elapsedTime: 122,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'fail'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776320533,
                endTime: 1680776320599,
                elapsedTime: 66,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 1,
        errorsCount: 0,
        passedCount: 0,
        group: '',
        modulePath: '/examples/tests/duckDuckGo.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:18:29 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.91vxAl'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:52839'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: '9a61f4d0e9b27287c69a1932a5ce9f29',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'fail',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/duckDuckGo_chromedriver.log',
        host: 'localhost',
        tests: 1,
        failures: 1,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:18:29.971Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:31.594Z',
            '  Response 200 POST /session (1624ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.91vxAl&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52839&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;9a61f4d0e9b27287c69a1932a5ce9f29&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:31.604Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://duckduckgo.com&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:35.227Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/url (3624ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:35.251Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:35.282Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (33ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:35.785Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:35.789Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:36.292Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.297Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:36.800Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:36.804Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:37.305Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.309Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:37.812Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.818Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (7ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.321Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.326Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.828Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.833Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.335Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:39.339Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.839Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:39.844Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.346Z',
            '  Request <b><span style="color:#0AA">POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.350Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.410Z',
            '  Request <b><span style="color:#0AA">GET /session/9a61f4d0e9b27287c69a1932a5ce9f29/screenshot  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:40.526Z',
            '  Response 200 GET /session/9a61f4d0e9b27287c69a1932a5ce9f29/screenshot (110ms)',
            '{\n     value: <span style="color:#0A0">&#39;iVBORw0KGgoAAAANSUhEUgAABLAAAAN3CAYAAAAia6NNAAABKGlDQ1BTa2lhAAAokX2QPUvDUBSGH0sX0aGiooNDNruo/bDVQpcm...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.535Z',
            '  Request <b><span style="color:#0AA">DELETE /session/9a61f4d0e9b27287c69a1932a5ce9f29  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:40.596Z',
            '  Response 200 DELETE /session/9a61f4d0e9b27287c69a1932a5ce9f29 (60ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:18:29.971Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:31.594Z',
            '  Response 200 POST /session (1624ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.91vxAl\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52839\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'9a61f4d0e9b27287c69a1932a5ce9f29\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:31.604Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/url  ',
            '{ url: \'https://duckduckgo.com\' }'
          ],
          [
            '2023-04-06T10:18:35.227Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/url (3624ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:35.251Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:35.282Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (33ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:35.785Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:35.789Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:36.292Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:36.297Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:36.800Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:36.804Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:37.305Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:37.309Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:37.812Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:37.818Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (7ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.321Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:38.326Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.828Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:38.833Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.335Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:39.339Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.839Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:39.844Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.346Z',
            '  Request POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:18:40.350Z',
            '  Response 200 POST /session/9a61f4d0e9b27287c69a1932a5ce9f29/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.410Z',
            '  Request GET /session/9a61f4d0e9b27287c69a1932a5ce9f29/screenshot  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:40.526Z',
            '  Response 200 GET /session/9a61f4d0e9b27287c69a1932a5ce9f29/screenshot (110ms)',
            '{\n     value: \'iVBORw0KGgoAAAANSUhEUgAABLAAAAN3CAYAAAAia6NNAAABKGlDQ1BTa2lhAAAokX2QPUvDUBSGH0sX0aGiooNDNruo/bDVQpcm...\',\n     suppressBase64Data: true\n  }'
          ],
          [
            '2023-04-06T10:18:40.535Z',
            '  Request DELETE /session/9a61f4d0e9b27287c69a1932a5ce9f29  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:40.596Z',
            '  Response 200 DELETE /session/9a61f4d0e9b27287c69a1932a5ce9f29 (60ms)',
            '{ value: null }'
          ]
        ]
      },
      googlePageObject: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 0,
        lastError: null,
        skipped: [
        ],
        time: '5.086',
        timeMs: 5086,
        completed: {
          'should complete the consent form': {
            time: '5.086',
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'should complete the consent form': {
                time: '5.086',
                assertions: [
                ],
                tests: 0,
                commands: [
                ],
                passed: 0,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 5086,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:37 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:42 GMT'
              }
            },
            timeMs: 5086,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:37 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:18:42 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'url',
                args: [
                  'https://google.no',
                  null
                ],
                startTime: 1680776313471,
                endTime: 1680776317554,
                elapsedTime: 4083,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'should complete the consent form': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'isPresent',
                args: [
                  'Element [name=@consentModal]'
                ],
                startTime: 1680776317560,
                endTime: 1680776322642,
                elapsedTime: 5082,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'quit',
                args: [
                ],
                startTime: 1680776322643,
                endTime: 1680776322701,
                elapsedTime: 58,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 0,
        group: '',
        modulePath: '/examples/tests/googlePageObject.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:18:31 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:18:42 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.39FoXo'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:52882'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: '95004e1d90a7d381a02021ba1160569b',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'skip',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/googlePageObject_chromedriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:18:31.838Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:33.459Z',
            '  Response 200 POST /session (1623ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.39FoXo&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52882&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;95004e1d90a7d381a02021ba1160569b&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:33.475Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://google.no&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:37.553Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/url (4079ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:37.563Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.571Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (9ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.074Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.081Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (7ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.583Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.588Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.091Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:39.096Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.598Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:39.603Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.105Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.108Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.611Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.615Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:41.117Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:41.122Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:41.624Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:41.628Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.130Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.134Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.635Z',
            '  Request <b><span style="color:#0AA">POST /session/95004e1d90a7d381a02021ba1160569b/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.640Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.644Z',
            '  Request <b><span style="color:#0AA">DELETE /session/95004e1d90a7d381a02021ba1160569b  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:42.700Z',
            '  Response 200 DELETE /session/95004e1d90a7d381a02021ba1160569b (56ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:18:31.838Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:33.459Z',
            '  Response 200 POST /session (1623ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.39FoXo\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52882\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'95004e1d90a7d381a02021ba1160569b\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:33.475Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/url  ',
            '{ url: \'https://google.no\' }'
          ],
          [
            '2023-04-06T10:18:37.553Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/url (4079ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:37.563Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:37.571Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (9ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.074Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:38.081Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (7ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.583Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:38.588Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.091Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:39.096Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.598Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:39.603Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.105Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:40.108Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.611Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:40.615Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:41.117Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:41.122Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:41.624Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:41.628Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.130Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:42.134Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.635Z',
            '  Request POST /session/95004e1d90a7d381a02021ba1160569b/elements  ',
            '{ using: \'css selector\', value: \'[aria-modal=&quot;true&quot;]\' }'
          ],
          [
            '2023-04-06T10:18:42.640Z',
            '  Response 200 POST /session/95004e1d90a7d381a02021ba1160569b/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.644Z',
            '  Request DELETE /session/95004e1d90a7d381a02021ba1160569b  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:42.700Z',
            '  Response 200 DELETE /session/95004e1d90a7d381a02021ba1160569b (56ms)',
            '{ value: null }'
          ]
        ]
      },
      google: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 2,
        lastError: null,
        skipped: [
        ],
        time: '49.04',
        timeMs: 49044,
        completed: {
          'demo test using expect apis': {
            time: '49.04',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if element <#rso>:first-child> contains text \'Nightwatch.js\' (25ms)',
                stackTrace: '',
                fullMsg: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(25ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 2,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 2,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'demo test using expect apis': {
                time: '49.04',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(25ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(25ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 2,
                commands: [
                ],
                passed: 2,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 49044,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:32 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:22 GMT'
              }
            },
            timeMs: 49044,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:32 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:22 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'demo test using expect apis': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'http://google.no'
                ],
                startTime: 1680776312974,
                endTime: 1680776317572,
                elapsedTime: 4598,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'isPresent',
                args: [
                  '[aria-modal="true"][title="Before you continue to Google Search"]'
                ],
                startTime: 1680776317575,
                endTime: 1680776322707,
                elapsedTime: 5132,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'waitForElementVisible',
                args: [
                  'form[action="/search"] input[type=text]'
                ],
                startTime: 1680776322708,
                endTime: 1680776322723,
                elapsedTime: 15,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'sendKeys',
                args: [
                  'form[action="/search"] input[type=text]',
                  'Nightwatch.js,'
                ],
                startTime: 1680776322723,
                endTime: 1680776327243,
                elapsedTime: 4520,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.textContains',
                args: [
                  '#rso>:first-child',
                  'Nightwatch.js'
                ],
                startTime: 1680776327243,
                endTime: 1680776327271,
                elapsedTime: 28,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'end',
                args: [
                ],
                startTime: 1680776327271,
                endTime: 1680776327331,
                elapsedTime: 60,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 2,
        group: '',
        modulePath: '/examples/tests/google.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:18:30 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:22 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.IYBK05'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:52863'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: '6d93a1410a8c1cb1a3ebd1ab9772b5bb',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'pass',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:18:31.040Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:32.967Z',
            '  Response 200 POST /session (1929ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.IYBK05&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52863&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;6d93a1410a8c1cb1a3ebd1ab9772b5bb&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:32.976Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;http://google.no&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:37.570Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/url (4594ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:37.579Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.622Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (44ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.126Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.131Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.636Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.654Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (20ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.157Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:39.162Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.664Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:39.669Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.170Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.175Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.678Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.682Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:41.184Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:41.188Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:41.690Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:41.694Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.195Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.199Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.702Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.706Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.709Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;form[action=&quot;/search&quot;] input[type=text]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.714Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.716Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.722Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/execute/sync (6ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:42.725Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;form[action=&quot;/search&quot;] input[type=text]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.729Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:42.731Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/element/1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;Nightwatch.js&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;N&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;.&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;j&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:47.242Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/element/1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4/value (4512ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:47.245Z',
            '  Request <b><span style="color:#0AA">POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#rso&gt;:first-child&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:47.250Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;a8c9c2b4-ff04-44ee-bab0-2c0346ca5a9a&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:47.251Z',
            '  Request <b><span style="color:#0AA">GET /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/element/a8c9c2b4-ff04-44ee-bab0-2c0346ca5a9a/text  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:47.268Z',
            '  Response 200 GET /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/element/a8c9c2b4-ff04-44ee-bab0-2c0346ca5a9a/text (17ms)',
            '{\n     value: <span style="color:#0A0">&#39;Web result with site links\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch....&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:47.274Z',
            '  Request <b><span style="color:#0AA">DELETE /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:47.330Z',
            '  Response 200 DELETE /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb (57ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:18:31.040Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:32.967Z',
            '  Response 200 POST /session (1929ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.IYBK05\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52863\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'6d93a1410a8c1cb1a3ebd1ab9772b5bb\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:32.976Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/url  ',
            '{ url: \'http://google.no\' }'
          ],
          [
            '2023-04-06T10:18:37.570Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/url (4594ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:37.579Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:37.622Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (44ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.126Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:38.131Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:38.636Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:38.654Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (20ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.157Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:39.162Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:39.664Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:39.669Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.170Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:40.175Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:40.678Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:40.682Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:41.184Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:41.188Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:41.690Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:41.694Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.195Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:42.199Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.702Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:18:42.706Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:18:42.709Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'form[action=&quot;/search&quot;] input[type=text]\'\n  }'
          ],
          [
            '2023-04-06T10:18:42.714Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:42.716Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4\',\n         ELEMENT: \'1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:42.722Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/execute/sync (6ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:18:42.725Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{\n     using: \'css selector\',\n     value: \'form[action=&quot;/search&quot;] input[type=text]\'\n  }'
          ],
          [
            '2023-04-06T10:18:42.729Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:42.731Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/element/1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4/value  ',
            '{\n     text: \'Nightwatch.js\',\n     value: [\n       \'N\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\', \'.\', \'j\',\n       \'s\', \'\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:47.242Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/element/1f8bfa3c-6bee-4e0d-9622-d75e81e8e8c4/value (4512ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:47.245Z',
            '  Request POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements  ',
            '{ using: \'css selector\', value: \'#rso&gt;:first-child\' }'
          ],
          [
            '2023-04-06T10:18:47.250Z',
            '  Response 200 POST /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/elements (5ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'a8c9c2b4-ff04-44ee-bab0-2c0346ca5a9a\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:47.251Z',
            '  Request GET /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/element/a8c9c2b4-ff04-44ee-bab0-2c0346ca5a9a/text  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:47.268Z',
            '  Response 200 GET /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb/element/a8c9c2b4-ff04-44ee-bab0-2c0346ca5a9a/text (17ms)',
            '{\n     value: \'Web result with site links\\n\' +\n       \'\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwatch....\',\n     suppressBase64Data: true\n  }'
          ],
          [
            '2023-04-06T10:18:47.274Z',
            '  Request DELETE /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:47.330Z',
            '  Response 200 DELETE /session/6d93a1410a8c1cb1a3ebd1ab9772b5bb (57ms)',
            '{ value: null }'
          ]
        ]
      },
      shadowRootExample: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 3,
        lastError: null,
        skipped: [
        ],
        time: '1.116',
        timeMs: 1116,
        completed: {
          'retrieve the shadowRoot': {
            time: '1.116',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <form> was visible after 21 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <form> was visible after 21 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected \'Your card validation code (CVC) is an…\'  to be a(\'string\') and to include(\'card validation code\'): ',
                stackTrace: '',
                fullMsg: 'Expected \'Your card validation code (CVC) is an…\'  to be a(\'string\') and to include(\'card validation code\'): ',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <unknown selector> to be an img (5ms)',
                stackTrace: '',
                fullMsg: 'Expected element <unknown selector> to be an img\u001b[0;90m (5ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 3,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 3,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'retrieve the shadowRoot': {
                time: '1.116',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <form> was visible after 21 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <form> was visible after 21 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected \'Your card validation code (CVC) is an…\'  to be a(\'string\') and to include(\'card validation code\'): ',
                    stackTrace: '',
                    fullMsg: 'Expected \'Your card validation code (CVC) is an…\'  to be a(\'string\') and to include(\'card validation code\'): ',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <unknown selector> to be an img\u001b[0;90m (5ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <unknown selector> to be an img\u001b[0;90m (5ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 3,
                commands: [
                ],
                passed: 3,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 1116,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:22 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:23 GMT'
              }
            },
            timeMs: 1116,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:22 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:23 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'retrieve the shadowRoot': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://mdn.github.io/web-components-examples/popup-info-box-web-component/'
                ],
                startTime: 1680776362014,
                endTime: 1680776363051,
                elapsedTime: 1037,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'waitForElementVisible',
                args: [
                  'form'
                ],
                startTime: 1680776363052,
                endTime: 1680776363074,
                elapsedTime: 22,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'getShadowRoot',
                args: [
                  'popup-info'
                ],
                startTime: 1680776363076,
                endTime: 1680776363089,
                elapsedTime: 13,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().find',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776363091,
                endTime: 1680776363098,
                elapsedTime: 7,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().property',
                args: [
                  'innerHTML'
                ],
                startTime: 1680776363101,
                endTime: 1680776363105,
                elapsedTime: 4,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().find',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776363105,
                endTime: 1680776363113,
                elapsedTime: 8,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'getFirstElementChild',
                args: [
                  'web element{3c89c9b5-8fd4-4b78-b2d7-c88f75569ffb}'
                ],
                startTime: 1680776363113,
                endTime: 1680776363117,
                elapsedTime: 4,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.element',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776363121,
                endTime: 1680776363127,
                elapsedTime: 6,
                status: 'pass',
                result: {
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776363135,
                endTime: 1680776363190,
                elapsedTime: 55,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 3,
        group: '',
        modulePath: '/examples/tests/shadowRootExample.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:21 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:23 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.Nvnx84'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:53167'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: '8fa96f7ec7ee22f4ac363f003489ea0c',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/shadowRootExample_chromedriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:21.124Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:22.006Z',
            '  Response 200 POST /session (883ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.Nvnx84&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:53167&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;8fa96f7ec7ee22f4ac363f003489ea0c&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:22.016Z',
            '  Request <b><span style="color:#0AA">POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/url  </span></b>',
            '{\n     url: <span style="color:#0A0">&#39;https://mdn.github.io/web-components-examples/popup-info-box-web-component/&#39;<span style="color:#FFF">\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:23.050Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/url (1035ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:23.053Z',
            '  Request <b><span style="color:#0AA">POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;form&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.061Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/elements (8ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;1e95cf14-4e05-4b2b-bcb7-298446591a2e&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.063Z',
            '  Request <b><span style="color:#0AA">POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;1e95cf14-4e05-4b2b-bcb7-298446591a2e&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;1e95cf14-4e05-4b2b-bcb7-298446591a2e&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.073Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync (11ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:23.077Z',
            '  Request <b><span style="color:#0AA">POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;popup-info&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.083Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/elements (6ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;31537dad-d980-4c26-9eb4-948c0cf328e8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.085Z',
            '  Request <b><span style="color:#0AA">POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(element) {\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;            return element &amp;&amp; element.shadowRoot;\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;          }).apply(null, arguments);... (114 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;31537dad-d980-4c26-9eb4-948c0cf328e8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.088Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync (4ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;shadow-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;067b78f3-a72a-498f-8f5e-ddb4c7024316&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.092Z',
            '  Request <b><span style="color:#0AA">POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/067b78f3-a72a-498f-8f5e-ddb4c7024316/element  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;.info&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.098Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/067b78f3-a72a-498f-8f5e-ddb4c7024316/element (7ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;30144c92-7c71-4e06-901e-467463c951bf&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.101Z',
            '  Request <b><span style="color:#0AA">GET /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/30144c92-7c71-4e06-901e-467463c951bf/property/innerHTML  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:23.104Z',
            '  Response 200 GET /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/30144c92-7c71-4e06-901e-467463c951bf/property/innerHTML (3ms)',
            '{\n     value: <span style="color:#0A0">&#39;Your card validation code (CVC) is an extra security feature — it is the last 3 or 4 numbers on the ...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.106Z',
            '  Request <b><span style="color:#0AA">POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/067b78f3-a72a-498f-8f5e-ddb4c7024316/element  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;.icon&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.112Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/067b78f3-a72a-498f-8f5e-ddb4c7024316/element (6ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;3c89c9b5-8fd4-4b78-b2d7-c88f75569ffb&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.114Z',
            '  Request <b><span style="color:#0AA">POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(element) {\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;            return element &amp;&amp; element.firstElementChild;\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;          }).apply(null, arguments);... (121 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;3c89c9b5-8fd4-4b78-b2d7-c88f75569ffb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.117Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync (3ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;377bb71f-6069-4e44-9c11-ad467daa912f&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:23.123Z',
            '  Request <b><span style="color:#0AA">GET /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/377bb71f-6069-4e44-9c11-ad467daa912f/name  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:23.125Z',
            '  Response 200 GET /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/377bb71f-6069-4e44-9c11-ad467daa912f/name (3ms)',
            '{ value: <span style="color:#0A0">&#39;img&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:23.138Z',
            '  Request <b><span style="color:#0AA">DELETE /session/8fa96f7ec7ee22f4ac363f003489ea0c  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:23.189Z',
            '  Response 200 DELETE /session/8fa96f7ec7ee22f4ac363f003489ea0c (52ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:21.124Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:22.006Z',
            '  Response 200 POST /session (883ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.Nvnx84\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:53167\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'8fa96f7ec7ee22f4ac363f003489ea0c\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:22.016Z',
            '  Request POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/url  ',
            '{\n     url: \'https://mdn.github.io/web-components-examples/popup-info-box-web-component/\'\n  }'
          ],
          [
            '2023-04-06T10:19:23.050Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/url (1035ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:23.053Z',
            '  Request POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/elements  ',
            '{ using: \'css selector\', value: \'form\' }'
          ],
          [
            '2023-04-06T10:19:23.061Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/elements (8ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'1e95cf14-4e05-4b2b-bcb7-298446591a2e\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:23.063Z',
            '  Request POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'1e95cf14-4e05-4b2b-bcb7-298446591a2e\',\n         ELEMENT: \'1e95cf14-4e05-4b2b-bcb7-298446591a2e\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:23.073Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync (11ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:23.077Z',
            '  Request POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/elements  ',
            '{ using: \'css selector\', value: \'popup-info\' }'
          ],
          [
            '2023-04-06T10:19:23.083Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/elements (6ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'31537dad-d980-4c26-9eb4-948c0cf328e8\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:23.085Z',
            '  Request POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync  ',
            '{\n     script: \'return (function(element) {\\n\' +\n       \'            return element &amp;&amp; element.shadowRoot;\\n\' +\n       \'          }).apply(null, arguments);... (114 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'31537dad-d980-4c26-9eb4-948c0cf328e8\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:23.088Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync (4ms)',
            '{\n     value: {\n       \'shadow-6066-11e4-a52e-4f735466cecf\': \'067b78f3-a72a-498f-8f5e-ddb4c7024316\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:23.092Z',
            '  Request POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/067b78f3-a72a-498f-8f5e-ddb4c7024316/element  ',
            '{ using: \'css selector\', value: \'.info\' }'
          ],
          [
            '2023-04-06T10:19:23.098Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/067b78f3-a72a-498f-8f5e-ddb4c7024316/element (7ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'30144c92-7c71-4e06-901e-467463c951bf\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:23.101Z',
            '  Request GET /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/30144c92-7c71-4e06-901e-467463c951bf/property/innerHTML  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:23.104Z',
            '  Response 200 GET /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/30144c92-7c71-4e06-901e-467463c951bf/property/innerHTML (3ms)',
            '{\n     value: \'Your card validation code (CVC) is an extra security feature — it is the last 3 or 4 numbers on the ...\',\n     suppressBase64Data: true\n  }'
          ],
          [
            '2023-04-06T10:19:23.106Z',
            '  Request POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/067b78f3-a72a-498f-8f5e-ddb4c7024316/element  ',
            '{ using: \'css selector\', value: \'.icon\' }'
          ],
          [
            '2023-04-06T10:19:23.112Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/067b78f3-a72a-498f-8f5e-ddb4c7024316/element (6ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'3c89c9b5-8fd4-4b78-b2d7-c88f75569ffb\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:23.114Z',
            '  Request POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync  ',
            '{\n     script: \'return (function(element) {\\n\' +\n       \'            return element &amp;&amp; element.firstElementChild;\\n\' +\n       \'          }).apply(null, arguments);... (121 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'3c89c9b5-8fd4-4b78-b2d7-c88f75569ffb\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:23.117Z',
            '  Response 200 POST /session/8fa96f7ec7ee22f4ac363f003489ea0c/execute/sync (3ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'377bb71f-6069-4e44-9c11-ad467daa912f\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:23.123Z',
            '  Request GET /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/377bb71f-6069-4e44-9c11-ad467daa912f/name  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:23.125Z',
            '  Response 200 GET /session/8fa96f7ec7ee22f4ac363f003489ea0c/element/377bb71f-6069-4e44-9c11-ad467daa912f/name (3ms)',
            '{ value: \'img\' }'
          ],
          [
            '2023-04-06T10:19:23.138Z',
            '  Request DELETE /session/8fa96f7ec7ee22f4ac363f003489ea0c  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:23.189Z',
            '  Response 200 DELETE /session/8fa96f7ec7ee22f4ac363f003489ea0c (52ms)',
            '{ value: null }'
          ]
        ]
      },
      vueTodoList: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 3,
        lastError: null,
        skipped: [
        ],
        time: '0.8370',
        timeMs: 837,
        completed: {
          'should add a todo using global element()': {
            time: '0.8370',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Expected elements <#todo-list ul li> count to equal: "5" (9ms)',
                stackTrace: '',
                fullMsg: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (9ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <#todo-list ul li> text to contain: "what is nightwatch?" (29ms)',
                stackTrace: '',
                fullMsg: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (29ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected elements <#todo-list ul li input:checked> count to equal: "3" (13ms)',
                stackTrace: '',
                fullMsg: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (13ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 3,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 3,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'should add a todo using global element()': {
                time: '0.8370',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (9ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (9ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (29ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (29ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (13ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (13ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 3,
                commands: [
                ],
                passed: 3,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 837,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:24 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:24 GMT'
              }
            },
            timeMs: 837,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:24 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:24 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'should add a todo using global element()': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://todo-vue3-vite.netlify.app/'
                ],
                startTime: 1680776364046,
                endTime: 1680776364619,
                elapsedTime: 573,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'sendKeys',
                args: [
                  '#new-todo-input',
                  'what is nightwatch?'
                ],
                startTime: 1680776364620,
                endTime: 1680776364733,
                elapsedTime: 113,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'click',
                args: [
                  'form button[type="submit"]'
                ],
                startTime: 1680776364733,
                endTime: 1680776364771,
                elapsedTime: 38,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.elements',
                args: [
                  '#todo-list ul li'
                ],
                startTime: 1680776364775,
                endTime: 1680776364785,
                elapsedTime: 10,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'expect.element',
                args: [
                  '#todo-list ul li'
                ],
                startTime: 1680776364785,
                endTime: 1680776364815,
                elapsedTime: 30,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().findElement',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776364815,
                endTime: 1680776364823,
                elapsedTime: 8,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'click',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776364823,
                endTime: 1680776364863,
                elapsedTime: 40,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.elements',
                args: [
                  '#todo-list ul li input:checked'
                ],
                startTime: 1680776364867,
                endTime: 1680776364881,
                elapsedTime: 14,
                status: 'pass',
                result: {
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776364887,
                endTime: 1680776364948,
                elapsedTime: 61,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 3,
        group: '',
        modulePath: '/examples/tests/vueTodoList.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:23 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:24 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.W2KVEX'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:53194'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: 'f3ec74bf3829675b4d3a0431221daa4f',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/vueTodoList_chromedriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:23.195Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.038Z',
            '  Response 200 POST /session (844ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.W2KVEX&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:53194&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;f3ec74bf3829675b4d3a0431221daa4f&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.048Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://todo-vue3-vite.netlify.app/&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:24.618Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/url (571ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:24.621Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#new-todo-input&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.633Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (12ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;4bac2891-cb8f-4d71-9754-9ba17acab456&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.635Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/4bac2891-cb8f-4d71-9754-9ba17acab456/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;?&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.732Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/4bac2891-cb8f-4d71-9754-9ba17acab456/value (97ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:24.734Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;form button[type=&quot;submit&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.741Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (7ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;a051cb42-6696-44ea-8d6a-77c55b0440c1&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.743Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/a051cb42-6696-44ea-8d6a-77c55b0440c1/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:24.770Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/a051cb42-6696-44ea-8d6a-77c55b0440c1/click (27ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:24.776Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.784Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (8ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;3f698484-5c27-4c9e-b834-5b01c93eecd6&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2476bf09-a2f0-4475-a807-467cf541fd79&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;08f7d964-53c3-4e38-b4e8-a5f5a4b0bdd2&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;87493ead-1c61-48de-8a14-1079b940015a&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;e232016a-f7ad-4a66-8ad0-0d466a68cd9a&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.786Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.790Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (4ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;3f698484-5c27-4c9e-b834-5b01c93eecd6&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2476bf09-a2f0-4475-a807-467cf541fd79&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;08f7d964-53c3-4e38-b4e8-a5f5a4b0bdd2&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;87493ead-1c61-48de-8a14-1079b940015a&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;e232016a-f7ad-4a66-8ad0-0d466a68cd9a&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.792Z',
            '  Request <b><span style="color:#0AA">GET /session/f3ec74bf3829675b4d3a0431221daa4f/element/e232016a-f7ad-4a66-8ad0-0d466a68cd9a/text  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:24.814Z',
            '  Response 200 GET /session/f3ec74bf3829675b4d3a0431221daa4f/element/e232016a-f7ad-4a66-8ad0-0d466a68cd9a/text (23ms)',
            '{\n     value: <span style="color:#0A0">&#39;new taskwhat is nightwatch?\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Edit\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;New Taskwhat Is Nightwatch?\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Delete\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;New Taskwhat Is Nightwatch?&#39;<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.816Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/e232016a-f7ad-4a66-8ad0-0d466a68cd9a/element  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=&quot;checkbox&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.822Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/e232016a-f7ad-4a66-8ad0-0d466a68cd9a/element (6ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;7fbbfbbe-ad13-441e-a05e-fb6d3dfa7ded&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.824Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/7fbbfbbe-ad13-441e-a05e-fb6d3dfa7ded/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:24.862Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/7fbbfbbe-ad13-441e-a05e-fb6d3dfa7ded/click (38ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:24.870Z',
            '  Request <b><span style="color:#0AA">POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li input:checked&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.880Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (11ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9313f9c9-2ffa-4132-9e70-de03bc78981c&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;217ad052-c671-4fc9-9760-de59964629bf&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;7fbbfbbe-ad13-441e-a05e-fb6d3dfa7ded&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:24.892Z',
            '  Request <b><span style="color:#0AA">DELETE /session/f3ec74bf3829675b4d3a0431221daa4f  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:24.947Z',
            '  Response 200 DELETE /session/f3ec74bf3829675b4d3a0431221daa4f (56ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:23.195Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:24.038Z',
            '  Response 200 POST /session (844ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.W2KVEX\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:53194\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'f3ec74bf3829675b4d3a0431221daa4f\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:24.048Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/url  ',
            '{ url: \'https://todo-vue3-vite.netlify.app/\' }'
          ],
          [
            '2023-04-06T10:19:24.618Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/url (571ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:24.621Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  ',
            '{ using: \'css selector\', value: \'#new-todo-input\' }'
          ],
          [
            '2023-04-06T10:19:24.633Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (12ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'4bac2891-cb8f-4d71-9754-9ba17acab456\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:24.635Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/4bac2891-cb8f-4d71-9754-9ba17acab456/value  ',
            '{\n     text: \'what is nightwatch?\',\n     value: [\n       \'w\', \'h\', \'a\', \'t\', \' \',\n       \'i\', \'s\', \' \', \'n\', \'i\',\n       \'g\', \'h\', \'t\', \'w\', \'a\',\n       \'t\', \'c\', \'h\', \'?\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:24.732Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/4bac2891-cb8f-4d71-9754-9ba17acab456/value (97ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:24.734Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  ',
            '{ using: \'css selector\', value: \'form button[type=&quot;submit&quot;]\' }'
          ],
          [
            '2023-04-06T10:19:24.741Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (7ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'a051cb42-6696-44ea-8d6a-77c55b0440c1\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:24.743Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/a051cb42-6696-44ea-8d6a-77c55b0440c1/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:24.770Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/a051cb42-6696-44ea-8d6a-77c55b0440c1/click (27ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:24.776Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  ',
            '{ using: \'css selector\', value: \'#todo-list ul li\' }'
          ],
          [
            '2023-04-06T10:19:24.784Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (8ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'3f698484-5c27-4c9e-b834-5b01c93eecd6\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2476bf09-a2f0-4475-a807-467cf541fd79\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'08f7d964-53c3-4e38-b4e8-a5f5a4b0bdd2\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'87493ead-1c61-48de-8a14-1079b940015a\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'e232016a-f7ad-4a66-8ad0-0d466a68cd9a\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:24.786Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  ',
            '{ using: \'css selector\', value: \'#todo-list ul li\' }'
          ],
          [
            '2023-04-06T10:19:24.790Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (4ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'3f698484-5c27-4c9e-b834-5b01c93eecd6\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2476bf09-a2f0-4475-a807-467cf541fd79\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'08f7d964-53c3-4e38-b4e8-a5f5a4b0bdd2\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'87493ead-1c61-48de-8a14-1079b940015a\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'e232016a-f7ad-4a66-8ad0-0d466a68cd9a\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:24.792Z',
            '  Request GET /session/f3ec74bf3829675b4d3a0431221daa4f/element/e232016a-f7ad-4a66-8ad0-0d466a68cd9a/text  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:24.814Z',
            '  Response 200 GET /session/f3ec74bf3829675b4d3a0431221daa4f/element/e232016a-f7ad-4a66-8ad0-0d466a68cd9a/text (23ms)',
            '{\n     value: \'new taskwhat is nightwatch?\\n\' +\n       \'Edit\\n\' +\n       \'New Taskwhat Is Nightwatch?\\n\' +\n       \'Delete\\n\' +\n       \'New Taskwhat Is Nightwatch?\'\n  }'
          ],
          [
            '2023-04-06T10:19:24.816Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/e232016a-f7ad-4a66-8ad0-0d466a68cd9a/element  ',
            '{ using: \'css selector\', value: \'input[type=&quot;checkbox&quot;]\' }'
          ],
          [
            '2023-04-06T10:19:24.822Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/e232016a-f7ad-4a66-8ad0-0d466a68cd9a/element (6ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'7fbbfbbe-ad13-441e-a05e-fb6d3dfa7ded\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:24.824Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/7fbbfbbe-ad13-441e-a05e-fb6d3dfa7ded/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:24.862Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/element/7fbbfbbe-ad13-441e-a05e-fb6d3dfa7ded/click (38ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:24.870Z',
            '  Request POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements  ',
            '{ using: \'css selector\', value: \'#todo-list ul li input:checked\' }'
          ],
          [
            '2023-04-06T10:19:24.880Z',
            '  Response 200 POST /session/f3ec74bf3829675b4d3a0431221daa4f/elements (11ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9313f9c9-2ffa-4132-9e70-de03bc78981c\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'217ad052-c671-4fc9-9760-de59964629bf\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'7fbbfbbe-ad13-441e-a05e-fb6d3dfa7ded\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:24.892Z',
            '  Request DELETE /session/f3ec74bf3829675b4d3a0431221daa4f  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:24.947Z',
            '  Response 200 DELETE /session/f3ec74bf3829675b4d3a0431221daa4f (56ms)',
            '{ value: null }'
          ]
        ]
      },
      'sample-with-relative-locators': {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 5,
        lastError: null,
        skipped: [
        ],
        time: '0.2180',
        timeMs: 218,
        completed: {
          'locate password input': {
            time: '0.09900',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input (29ms)',
                stackTrace: '',
                fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: "password" (37ms)',
                stackTrace: '',
                fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 3,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 3,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'locate password input': {
                time: '0.09900',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 3,
                commands: [
                ],
                passed: 3,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 99,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
              }
            },
            timeMs: 99,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
          },
          'fill in password input': {
            time: '0.1190',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <form.login-form> was visible after 17 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <form.login-form> was visible after 17 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if value of element <input[type=password]> equals \'password\' (11ms)',
                stackTrace: '',
                fullMsg: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(11ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 2,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 2,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'locate password input': {
                time: '0.09900',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 27 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (29ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (37ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 3,
                commands: [
                ],
                passed: 3,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 99,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
              },
              'fill in password input': {
                time: '0.1190',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <form.login-form> was visible after 17 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <form.login-form> was visible after 17 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(11ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(11ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 2,
                commands: [
                ],
                passed: 2,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 119,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
              }
            },
            timeMs: 119,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://archive.org/account/login'
                ],
                startTime: 1680776312360,
                endTime: 1680776318569,
                elapsedTime: 6209,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'locate password input': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'waitForElementVisible',
                args: [
                  'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
                ],
                startTime: 1680776318572,
                endTime: 1680776318600,
                elapsedTime: 28,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.element',
                args: [
                  'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
                ],
                startTime: 1680776318601,
                endTime: 1680776318630,
                elapsedTime: 29,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'expect.element',
                args: [
                  'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
                ],
                startTime: 1680776318630,
                endTime: 1680776318668,
                elapsedTime: 38,
                status: 'pass',
                result: {
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'fill in password input': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'waitForElementVisible',
                args: [
                  'form.login-form'
                ],
                startTime: 1680776318672,
                endTime: 1680776318689,
                elapsedTime: 17,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'setValue',
                args: [
                  'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})',
                  'password'
                ],
                startTime: 1680776318689,
                endTime: 1680776318775,
                elapsedTime: 86,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.valueEquals',
                args: [
                  'input[type=password]',
                  'password'
                ],
                startTime: 1680776318775,
                endTime: 1680776318787,
                elapsedTime: 12,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                ],
                startTime: 1680776318790,
                endTime: 1680776318847,
                elapsedTime: 57,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 2,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 5,
        group: '',
        modulePath: '/examples/tests/sample-with-relative-locators.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:18:30 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:18:38 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.JaFqwI'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:52856'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: '00dd2b665dc8d47d951758a8df6aab16',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/sample-with-relative-locators_chromedriver.log',
        host: 'localhost',
        tests: 2,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:18:30.901Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:32.353Z',
            '  Response 200 POST /session (1454ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.JaFqwI&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52856&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;00dd2b665dc8d47d951758a8df6aab16&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:32.362Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://archive.org/account/login&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:38.567Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/url (6205ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:38.576Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.588Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (13ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;627a1655-8ce4-4fe9-9694-bc4027e6ce99&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;68c381f6-bdd6-4553-8fd2-f849a12688fd&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.590Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.599Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (9ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:38.603Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.616Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (14ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;627a1655-8ce4-4fe9-9694-bc4027e6ce99&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;68c381f6-bdd6-4553-8fd2-f849a12688fd&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.618Z',
            '  Request <b><span style="color:#0AA">GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/name  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:38.629Z',
            '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/name (11ms)',
            '{ value: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:38.633Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.654Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (22ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;627a1655-8ce4-4fe9-9694-bc4027e6ce99&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;68c381f6-bdd6-4553-8fd2-f849a12688fd&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.656Z',
            '  Request <b><span style="color:#0AA">GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/attribute/type  </span></b>',
            '<span style="color:#555">undefined<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:38.667Z',
            '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/attribute/type (12ms)',
            '{ value: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:38.673Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;form.login-form&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.680Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/elements (8ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8f46bd5c-745a-47f0-a218-d476c573a5cb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.682Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8f46bd5c-745a-47f0-a218-d476c573a5cb&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;8f46bd5c-745a-47f0-a218-d476c573a5cb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.689Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (7ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:38.691Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.697Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (6ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;627a1655-8ce4-4fe9-9694-bc4027e6ce99&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;68c381f6-bdd6-4553-8fd2-f849a12688fd&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.698Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/clear  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:18:38.713Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/clear (15ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:38.714Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;p&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;o&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;r&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;d&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.774Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/value (60ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:38.778Z',
            '  Request <b><span style="color:#0AA">POST /session/00dd2b665dc8d47d951758a8df6aab16/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=password]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.783Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/elements (5ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9cd7b93b-d84a-4076-808d-69f133084e04&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:38.784Z',
            '  Request <b><span style="color:#0AA">GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/property/value  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:38.786Z',
            '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/property/value (2ms)',
            '{ value: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:38.793Z',
            '  Request <b><span style="color:#0AA">DELETE /session/00dd2b665dc8d47d951758a8df6aab16  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:38.846Z',
            '  Response 200 DELETE /session/00dd2b665dc8d47d951758a8df6aab16 (53ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:18:30.901Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:32.353Z',
            '  Response 200 POST /session (1454ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.JaFqwI\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52856\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'00dd2b665dc8d47d951758a8df6aab16\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:32.362Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/url  ',
            '{ url: \'https://archive.org/account/login\' }'
          ],
          [
            '2023-04-06T10:18:38.567Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/url (6205ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:38.576Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.588Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (13ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'627a1655-8ce4-4fe9-9694-bc4027e6ce99\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'68c381f6-bdd6-4553-8fd2-f849a12688fd\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.590Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\',\n         ELEMENT: \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.599Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (9ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:18:38.603Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.616Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (14ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'627a1655-8ce4-4fe9-9694-bc4027e6ce99\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'68c381f6-bdd6-4553-8fd2-f849a12688fd\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.618Z',
            '  Request GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/name  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:38.629Z',
            '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/name (11ms)',
            '{ value: \'input\' }'
          ],
          [
            '2023-04-06T10:18:38.633Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.654Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (22ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'627a1655-8ce4-4fe9-9694-bc4027e6ce99\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'68c381f6-bdd6-4553-8fd2-f849a12688fd\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.656Z',
            '  Request GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/attribute/type  ',
            'undefined'
          ],
          [
            '2023-04-06T10:18:38.667Z',
            '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/attribute/type (12ms)',
            '{ value: \'password\' }'
          ],
          [
            '2023-04-06T10:18:38.673Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/elements  ',
            '{ using: \'css selector\', value: \'form.login-form\' }'
          ],
          [
            '2023-04-06T10:18:38.680Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/elements (8ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'8f46bd5c-745a-47f0-a218-d476c573a5cb\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.682Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'8f46bd5c-745a-47f0-a218-d476c573a5cb\',\n         ELEMENT: \'8f46bd5c-745a-47f0-a218-d476c573a5cb\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.689Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (7ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:18:38.691Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.697Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/execute/sync (6ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'627a1655-8ce4-4fe9-9694-bc4027e6ce99\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'68c381f6-bdd6-4553-8fd2-f849a12688fd\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.698Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/clear  ',
            '{}'
          ],
          [
            '2023-04-06T10:18:38.713Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/clear (15ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:38.714Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/value  ',
            '{\n     text: \'password\',\n     value: [\n       \'p\', \'a\', \'s\',\n       \'s\', \'w\', \'o\',\n       \'r\', \'d\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.774Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/value (60ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:38.778Z',
            '  Request POST /session/00dd2b665dc8d47d951758a8df6aab16/elements  ',
            '{ using: \'css selector\', value: \'input[type=password]\' }'
          ],
          [
            '2023-04-06T10:18:38.783Z',
            '  Response 200 POST /session/00dd2b665dc8d47d951758a8df6aab16/elements (5ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9cd7b93b-d84a-4076-808d-69f133084e04\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:38.784Z',
            '  Request GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/property/value  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:38.786Z',
            '  Response 200 GET /session/00dd2b665dc8d47d951758a8df6aab16/element/9cd7b93b-d84a-4076-808d-69f133084e04/property/value (2ms)',
            '{ value: \'password\' }'
          ],
          [
            '2023-04-06T10:18:38.793Z',
            '  Request DELETE /session/00dd2b665dc8d47d951758a8df6aab16  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:38.846Z',
            '  Response 200 DELETE /session/00dd2b665dc8d47d951758a8df6aab16 (53ms)',
            '{ value: null }'
          ]
        ]
      },
      ecosia: {
        reportPrefix: 'CHROME_111.0.5563.146__',
        assertionsCount: 5,
        lastError: null,
        skipped: [
        ],
        time: '3.056',
        timeMs: 3056,
        completed: {
          'Demo test ecosia.org': {
            time: '3.056',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <body> was visible after 39 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <body> was visible after 39 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if the page title contains \'Ecosia\' (7ms)',
                stackTrace: '',
                fullMsg: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if element <input[type=search]> is visible (17ms)',
                stackTrace: '',
                fullMsg: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(17ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if element <button[type=submit]> is visible (86ms)',
                stackTrace: '',
                fullMsg: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(86ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if element <.layout__content> contains text \'Nightwatch.js\' (136ms)',
                stackTrace: '',
                fullMsg: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(136ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 5,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 5,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'Demo test ecosia.org': {
                time: '3.056',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <body> was visible after 39 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <body> was visible after 39 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(17ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(17ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(86ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(86ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(136ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(136ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 5,
                commands: [
                ],
                passed: 5,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 3056,
                startTimestamp: 'Thu, 06 Apr 2023 10:18:37 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT'
              }
            },
            timeMs: 3056,
            startTimestamp: 'Thu, 06 Apr 2023 10:18:37 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://www.ecosia.org/'
                ],
                startTime: 1680776313426,
                endTime: 1680776317581,
                elapsedTime: 4155,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'Demo test ecosia.org': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'waitForElementVisible',
                args: [
                  'body'
                ],
                startTime: 1680776317585,
                endTime: 1680776317625,
                elapsedTime: 40,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.titleContains',
                args: [
                  'Ecosia'
                ],
                startTime: 1680776317626,
                endTime: 1680776317633,
                elapsedTime: 7,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.visible',
                args: [
                  'input[type=search]'
                ],
                startTime: 1680776317633,
                endTime: 1680776317653,
                elapsedTime: 20,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'setValue',
                args: [
                  'input[type=search]',
                  'nightwatch'
                ],
                startTime: 1680776317653,
                endTime: 1680776317770,
                elapsedTime: 117,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.visible',
                args: [
                  'button[type=submit]'
                ],
                startTime: 1680776317770,
                endTime: 1680776317857,
                elapsedTime: 87,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'click',
                args: [
                  'button[type=submit]'
                ],
                startTime: 1680776317858,
                endTime: 1680776320498,
                elapsedTime: 2640,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.textContains',
                args: [
                  '.layout__content',
                  'Nightwatch.js'
                ],
                startTime: 1680776320498,
                endTime: 1680776320637,
                elapsedTime: 139,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                ],
                startTime: 1680776320640,
                endTime: 1680776320701,
                elapsedTime: 61,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 5,
        group: '',
        modulePath: '/examples/tests/ecosia.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:18:31 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:18:40 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'chrome',
          browserVersion: '111.0.5563.146',
          chrome: {
            chromedriverVersion: '111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})',
            userDataDir: '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.crT7I3'
          },
          'goog:chromeOptions': {
            debuggerAddress: 'localhost:52878'
          },
          networkConnectionEnabled: false,
          pageLoadStrategy: 'normal',
          platformName: 'mac os x',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify',
          'webauthn:extension:credBlob': true,
          'webauthn:extension:largeBlob': true,
          'webauthn:extension:minPinLength': true,
          'webauthn:extension:prf': true,
          'webauthn:virtualAuthenticators': true
        },
        sessionId: '5e487662a1e1be6f6d821f923d21af64',
        projectName: '',
        buildName: '',
        testEnv: 'chrome',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/ecosia_chromedriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:18:31.743Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { w3c: <span style="color:#A50">true<span style="color:#FFF">, args: [] }\n       }\n     }\n  }</span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:33.414Z',
            '  Response 200 POST /session (1683ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;chrome&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.5563.146&#39;<span style="color:#FFF">,\n         chrome: {\n           chromedriverVersion: <span style="color:#0A0">&#39;111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})&#39;<span style="color:#FFF">,\n           userDataDir: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.crT7I3&#39;<span style="color:#FFF">\n         },\n         <span style="color:#0A0">&#39;goog:chromeOptions&#39;<span style="color:#FFF">: { debuggerAddress: <span style="color:#0A0">&#39;localhost:52878&#39;<span style="color:#FFF"> },\n         networkConnectionEnabled: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac os x&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:credBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:largeBlob&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:minPinLength&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:extension:prf&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;webauthn:virtualAuthenticators&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">\n       },\n       sessionId: <span style="color:#0A0">&#39;5e487662a1e1be6f6d821f923d21af64&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:33.429Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://www.ecosia.org/&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:37.580Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/url (4152ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:37.587Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.604Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (17ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f9443218-7896-44fc-9e32-b7d8642bade8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.608Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f9443218-7896-44fc-9e32-b7d8642bade8&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;f9443218-7896-44fc-9e32-b7d8642bade8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.624Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (16ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:37.629Z',
            '  Request <b><span style="color:#0AA">GET /session/5e487662a1e1be6f6d821f923d21af64/title  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:37.632Z',
            '  Response 200 GET /session/5e487662a1e1be6f6d821f923d21af64/title (4ms)',
            '{ value: <span style="color:#0A0">&#39;Ecosia - the search engine that plants trees&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:37.636Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.641Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (5ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b51dfbe1-4af2-44cb-85dc-a229a45c3c3f&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.642Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b51dfbe1-4af2-44cb-85dc-a229a45c3c3f&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;b51dfbe1-4af2-44cb-85dc-a229a45c3c3f&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.651Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (9ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:37.654Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.663Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (9ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b51dfbe1-4af2-44cb-85dc-a229a45c3c3f&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.664Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/clear  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:18:37.683Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/clear (19ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:37.685Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;nightwatch&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.769Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/value (84ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:37.774Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.843Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (69ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;dfe9ef82-4e7e-407d-b76b-86de1443ac1b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.847Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;dfe9ef82-4e7e-407d-b76b-86de1443ac1b&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;dfe9ef82-4e7e-407d-b76b-86de1443ac1b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.855Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (9ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:18:37.860Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.864Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (4ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;dfe9ef82-4e7e-407d-b76b-86de1443ac1b&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:37.865Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/element/dfe9ef82-4e7e-407d-b76b-86de1443ac1b/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:18:40.497Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/dfe9ef82-4e7e-407d-b76b-86de1443ac1b/click (2632ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:18:40.501Z',
            '  Request <b><span style="color:#0AA">POST /session/5e487662a1e1be6f6d821f923d21af64/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;.layout__content&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.507Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (6ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;e3557007-ed36-4c86-b27a-7c09e9317276&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.509Z',
            '  Request <b><span style="color:#0AA">GET /session/5e487662a1e1be6f6d821f923d21af64/element/e3557007-ed36-4c86-b27a-7c09e9317276/text  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:40.634Z',
            '  Response 200 GET /session/5e487662a1e1be6f6d821f923d21af64/element/e3557007-ed36-4c86-b27a-7c09e9317276/text (125ms)',
            '{\n     value: <span style="color:#0A0">&#39;Search\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;https://nightwatchjs.org\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwa...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:18:40.643Z',
            '  Request <b><span style="color:#0AA">DELETE /session/5e487662a1e1be6f6d821f923d21af64  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:18:40.700Z',
            '  Response 200 DELETE /session/5e487662a1e1be6f6d821f923d21af64 (57ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:18:31.743Z',
            '  Request POST /session  ',
            '{\n     capabilities: {\n       firstMatch: [ {} ],\n       alwaysMatch: {\n         browserName: \'chrome\',\n         \'goog:chromeOptions\': { w3c: true, args: [] }\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:33.414Z',
            '  Response 200 POST /session (1683ms)',
            '{\n     value: {\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'chrome\',\n         browserVersion: \'111.0.5563.146\',\n         chrome: {\n           chromedriverVersion: \'111.0.5563.64 (c710e93d5b63b7095afe8c2c17df34408078439d-refs/branch-heads/5563@{#995})\',\n           userDataDir: \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/.com.google.Chrome.crT7I3\'\n         },\n         \'goog:chromeOptions\': { debuggerAddress: \'localhost:52878\' },\n         networkConnectionEnabled: false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac os x\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\',\n         \'webauthn:extension:credBlob\': true,\n         \'webauthn:extension:largeBlob\': true,\n         \'webauthn:extension:minPinLength\': true,\n         \'webauthn:extension:prf\': true,\n         \'webauthn:virtualAuthenticators\': true\n       },\n       sessionId: \'5e487662a1e1be6f6d821f923d21af64\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:18:33.429Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/url  ',
            '{ url: \'https://www.ecosia.org/\' }'
          ],
          [
            '2023-04-06T10:18:37.580Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/url (4152ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:37.587Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
            '{ using: \'css selector\', value: \'body\' }'
          ],
          [
            '2023-04-06T10:18:37.604Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (17ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f9443218-7896-44fc-9e32-b7d8642bade8\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.608Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f9443218-7896-44fc-9e32-b7d8642bade8\',\n         ELEMENT: \'f9443218-7896-44fc-9e32-b7d8642bade8\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.624Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (16ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:18:37.629Z',
            '  Request GET /session/5e487662a1e1be6f6d821f923d21af64/title  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:37.632Z',
            '  Response 200 GET /session/5e487662a1e1be6f6d821f923d21af64/title (4ms)',
            '{ value: \'Ecosia - the search engine that plants trees\' }'
          ],
          [
            '2023-04-06T10:18:37.636Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
            '{ using: \'css selector\', value: \'input[type=search]\' }'
          ],
          [
            '2023-04-06T10:18:37.641Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (5ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b51dfbe1-4af2-44cb-85dc-a229a45c3c3f\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.642Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b51dfbe1-4af2-44cb-85dc-a229a45c3c3f\',\n         ELEMENT: \'b51dfbe1-4af2-44cb-85dc-a229a45c3c3f\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.651Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (9ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:18:37.654Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
            '{ using: \'css selector\', value: \'input[type=search]\' }'
          ],
          [
            '2023-04-06T10:18:37.663Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (9ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b51dfbe1-4af2-44cb-85dc-a229a45c3c3f\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.664Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/clear  ',
            '{}'
          ],
          [
            '2023-04-06T10:18:37.683Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/clear (19ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:37.685Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/value  ',
            '{\n     text: \'nightwatch\',\n     value: [\n       \'n\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.769Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/b51dfbe1-4af2-44cb-85dc-a229a45c3c3f/value (84ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:37.774Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
            '{ using: \'css selector\', value: \'button[type=submit]\' }'
          ],
          [
            '2023-04-06T10:18:37.843Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (69ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'dfe9ef82-4e7e-407d-b76b-86de1443ac1b\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.847Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'dfe9ef82-4e7e-407d-b76b-86de1443ac1b\',\n         ELEMENT: \'dfe9ef82-4e7e-407d-b76b-86de1443ac1b\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.855Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/execute/sync (9ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:18:37.860Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
            '{ using: \'css selector\', value: \'button[type=submit]\' }'
          ],
          [
            '2023-04-06T10:18:37.864Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (4ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'dfe9ef82-4e7e-407d-b76b-86de1443ac1b\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:37.865Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/element/dfe9ef82-4e7e-407d-b76b-86de1443ac1b/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:18:40.497Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/element/dfe9ef82-4e7e-407d-b76b-86de1443ac1b/click (2632ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:18:40.501Z',
            '  Request POST /session/5e487662a1e1be6f6d821f923d21af64/elements  ',
            '{ using: \'css selector\', value: \'.layout__content\' }'
          ],
          [
            '2023-04-06T10:18:40.507Z',
            '  Response 200 POST /session/5e487662a1e1be6f6d821f923d21af64/elements (6ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'e3557007-ed36-4c86-b27a-7c09e9317276\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:18:40.509Z',
            '  Request GET /session/5e487662a1e1be6f6d821f923d21af64/element/e3557007-ed36-4c86-b27a-7c09e9317276/text  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:40.634Z',
            '  Response 200 GET /session/5e487662a1e1be6f6d821f923d21af64/element/e3557007-ed36-4c86-b27a-7c09e9317276/text (125ms)',
            '{\n     value: \'Search\\n\' +\n       \'https://nightwatchjs.org\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwa...\',\n     suppressBase64Data: true\n  }'
          ],
          [
            '2023-04-06T10:18:40.643Z',
            '  Request DELETE /session/5e487662a1e1be6f6d821f923d21af64  ',
            '\'\''
          ],
          [
            '2023-04-06T10:18:40.700Z',
            '  Response 200 DELETE /session/5e487662a1e1be6f6d821f923d21af64 (57ms)',
            '{ value: null }'
          ]
        ]
      }
    },
    firefox: {
      angularTodoTest: {
        reportPrefix: 'FIREFOX_111.0.1__',
        assertionsCount: 2,
        lastError: null,
        skipped: [
        ],
        time: '1.908',
        timeMs: 1908,
        completed: {
          'should add a todo using custom commands': {
            time: '1.908',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <web element{f201c631-099d-4556-b725-1b9036ff21e7}> text to equal: "what is nightwatch?" (15ms)',
                stackTrace: '',
                fullMsg: 'Expected element <web element{f201c631-099d-4556-b725-1b9036ff21e7}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected elements <*[module=todoApp] li .done-true> count to equal: "2" (5ms)',
                stackTrace: '',
                fullMsg: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (5ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 2,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 2,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'should add a todo using custom commands': {
                time: '1.908',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <web element{f201c631-099d-4556-b725-1b9036ff21e7}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <web element{f201c631-099d-4556-b725-1b9036ff21e7}> text to equal: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (5ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected elements <*[module=todoApp] li .done-true> count to equal: \u001b[0;33m"2"\u001b[0m\u001b[0;90m (5ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 2,
                commands: [
                ],
                passed: 2,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 1908,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:27 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT'
              }
            },
            timeMs: 1908,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:27 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'should add a todo using custom commands': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://angularjs.org'
                ],
                startTime: 1680776367982,
                endTime: 1680776369381,
                elapsedTime: 1399,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'sendKeys',
                args: [
                  '[ng-model="todoList.todoText"]',
                  'what is nightwatch?'
                ],
                startTime: 1680776369382,
                endTime: 1680776369412,
                elapsedTime: 30,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'click',
                args: [
                  '[value="add"]'
                ],
                startTime: 1680776369412,
                endTime: 1680776369631,
                elapsedTime: 219,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'getElementsInList',
                args: [
                  'todoList.todos'
                ],
                startTime: 1680776369631,
                endTime: 1680776369638,
                elapsedTime: 7,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'expect.element',
                args: [
                  'web element{f201c631-099d-4556-b725-1b9036ff21e7}'
                ],
                startTime: 1680776369642,
                endTime: 1680776369658,
                elapsedTime: 16,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().findElement',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776369658,
                endTime: 1680776369662,
                elapsedTime: 4,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'click',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776369662,
                endTime: 1680776369876,
                elapsedTime: 214,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.elements',
                args: [
                  '*[module=todoApp] li .done-true'
                ],
                startTime: 1680776369878,
                endTime: 1680776369883,
                elapsedTime: 5,
                status: 'pass',
                result: {
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776369890,
                endTime: 1680776370259,
                elapsedTime: 369,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 2,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/angularTodoTest.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:25 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'firefox',
          browserVersion: '111.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20230321111920',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.3.0',
          'moz:processID': 93705,
          'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileCfAJtT',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          pageLoadStrategy: 'normal',
          platformName: 'mac',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify'
        },
        sessionId: '1a5fbc5c-7381-4c6e-991b-936453257b8d',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/angularTodoTest_geckodriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:25.817Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:27.970Z',
            '  Response 200 POST /session (2155ms)',
            '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;1a5fbc5c-7381-4c6e-991b-936453257b8d&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93705<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileCfAJtT&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:27.986Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://angularjs.org&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:29.380Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/url (1394ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:29.385Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[ng-model=&quot;todoList.todoText&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.391Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (7ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9e5ff74b-5b5b-4221-90b6-d14dcc856ec8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.393Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/9e5ff74b-5b5b-4221-90b6-d14dcc856ec8/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;?&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.411Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/9e5ff74b-5b5b-4221-90b6-d14dcc856ec8/value (18ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:29.413Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;[value=&quot;add&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.416Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (3ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;b00c28b3-319c-44f5-906d-c24b3debafd7&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.418Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/b00c28b3-319c-44f5-906d-c24b3debafd7/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:29.631Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/b00c28b3-319c-44f5-906d-c24b3debafd7/click (213ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:29.634Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;var passedArgs = Array.prototype.slice.call(arguments,0); return (function(listName) {\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      // executed in the browser context\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      // eslint-disable-next-line\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;      var elements = document.querySel... (366 characters)&#39;<span style="color:#FFF">,\n     args: [ <span style="color:#0A0">&#39;todoList.todos&#39;<span style="color:#FFF"> ]\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.637Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/execute/sync (3ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;df85178f-1166-489c-827d-17e13fecf95a&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed6dc16b-f99b-4ab7-821b-c17030dcd5de&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f201c631-099d-4556-b725-1b9036ff21e7&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.643Z',
            '  Request <b><span style="color:#0AA">GET /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/text  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:29.656Z',
            '  Response 200 GET /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/text (13ms)',
            '{ value: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:29.659Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/element  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.662Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/element (3ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8b05c802-195a-4804-a216-09892ca94a68&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.663Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/8b05c802-195a-4804-a216-09892ca94a68/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:29.875Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/8b05c802-195a-4804-a216-09892ca94a68/click (212ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:29.879Z',
            '  Request <b><span style="color:#0AA">POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;*[module=todoApp] li .done-true&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.883Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (4ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f027fd19-1bf0-406e-899c-c005c1e40456&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed3f1754-6119-41a2-83c1-d56075d6b38a&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.893Z',
            '  Request <b><span style="color:#0AA">DELETE /session/1a5fbc5c-7381-4c6e-991b-936453257b8d  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:30.257Z',
            '  Response 200 DELETE /session/1a5fbc5c-7381-4c6e-991b-936453257b8d (365ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:25.817Z',
            '  Request POST /session  ',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
          ],
          [
            '2023-04-06T10:19:27.970Z',
            '  Response 200 POST /session (2155ms)',
            '{\n     value: {\n       sessionId: \'1a5fbc5c-7381-4c6e-991b-936453257b8d\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93705,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileCfAJtT\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:27.986Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/url  ',
            '{ url: \'https://angularjs.org\' }'
          ],
          [
            '2023-04-06T10:19:29.380Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/url (1394ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:29.385Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  ',
            '{ using: \'css selector\', value: \'[ng-model=&quot;todoList.todoText&quot;]\' }'
          ],
          [
            '2023-04-06T10:19:29.391Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (7ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9e5ff74b-5b5b-4221-90b6-d14dcc856ec8\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:29.393Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/9e5ff74b-5b5b-4221-90b6-d14dcc856ec8/value  ',
            '{\n     text: \'what is nightwatch?\',\n     value: [\n       \'w\', \'h\', \'a\', \'t\', \' \',\n       \'i\', \'s\', \' \', \'n\', \'i\',\n       \'g\', \'h\', \'t\', \'w\', \'a\',\n       \'t\', \'c\', \'h\', \'?\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:29.411Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/9e5ff74b-5b5b-4221-90b6-d14dcc856ec8/value (18ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:29.413Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  ',
            '{ using: \'css selector\', value: \'[value=&quot;add&quot;]\' }'
          ],
          [
            '2023-04-06T10:19:29.416Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (3ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'b00c28b3-319c-44f5-906d-c24b3debafd7\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:29.418Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/b00c28b3-319c-44f5-906d-c24b3debafd7/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:29.631Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/b00c28b3-319c-44f5-906d-c24b3debafd7/click (213ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:29.634Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/execute/sync  ',
            '{\n     script: \'var passedArgs = Array.prototype.slice.call(arguments,0); return (function(listName) {\\n\' +\n       \'      // executed in the browser context\\n\' +\n       \'      // eslint-disable-next-line\\n\' +\n       \'      var elements = document.querySel... (366 characters)\',\n     args: [ \'todoList.todos\' ]\n  }'
          ],
          [
            '2023-04-06T10:19:29.637Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/execute/sync (3ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'df85178f-1166-489c-827d-17e13fecf95a\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed6dc16b-f99b-4ab7-821b-c17030dcd5de\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f201c631-099d-4556-b725-1b9036ff21e7\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:29.643Z',
            '  Request GET /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/text  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:29.656Z',
            '  Response 200 GET /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/text (13ms)',
            '{ value: \'what is nightwatch?\' }'
          ],
          [
            '2023-04-06T10:19:29.659Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/element  ',
            '{ using: \'css selector\', value: \'input\' }'
          ],
          [
            '2023-04-06T10:19:29.662Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/f201c631-099d-4556-b725-1b9036ff21e7/element (3ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'8b05c802-195a-4804-a216-09892ca94a68\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:29.663Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/8b05c802-195a-4804-a216-09892ca94a68/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:29.875Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/element/8b05c802-195a-4804-a216-09892ca94a68/click (212ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:29.879Z',
            '  Request POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements  ',
            '{ using: \'css selector\', value: \'*[module=todoApp] li .done-true\' }'
          ],
          [
            '2023-04-06T10:19:29.883Z',
            '  Response 200 POST /session/1a5fbc5c-7381-4c6e-991b-936453257b8d/elements (4ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f027fd19-1bf0-406e-899c-c005c1e40456\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed3f1754-6119-41a2-83c1-d56075d6b38a\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:29.893Z',
            '  Request DELETE /session/1a5fbc5c-7381-4c6e-991b-936453257b8d  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:30.257Z',
            '  Response 200 DELETE /session/1a5fbc5c-7381-4c6e-991b-936453257b8d (365ms)',
            '{ value: null }'
          ]
        ]
      },
      chromeCDP_example: {
        reportPrefix: 'FIREFOX_111.0.1__',
        assertionsCount: 1,
        lastError: {
          name: 'NightwatchAssertError',
          message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
          showDiff: false,
          abortOnFailure: true,
          stack: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)'
        },
        skipped: [
        ],
        time: '4.669',
        timeMs: 4669,
        completed: {
          'using CDP DOM Snapshot': {
            time: '4.669',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected "documents,strings" but got: "abortOnFailure" (4ms)',
                stackTrace: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
                fullMsg: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                failure: 'Expected "documents,strings" but got: "abortOnFailure"',
                screenshots: [
                  '/Users/vaibhavsingh/Dev/nightwatch/screens/chromeCDP_example/using-CDP-DOM-Snapshot_FAILED_Apr-06-2023-154931-GMT+0530.png'
                ]
              }
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 1,
            skipped: 0,
            tests: 1,
            status: 'fail',
            steps: [
            ],
            stackTrace: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
            testcases: {
              'using CDP DOM Snapshot': {
                time: '4.669',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                    stackTrace: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
                    fullMsg: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                    failure: 'Expected "documents,strings" but got: "abortOnFailure"',
                    screenshots: [
                      '/Users/vaibhavsingh/Dev/nightwatch/screens/chromeCDP_example/using-CDP-DOM-Snapshot_FAILED_Apr-06-2023-154931-GMT+0530.png'
                    ]
                  }
                ],
                tests: 1,
                commands: [
                ],
                passed: 0,
                errors: 0,
                failed: 1,
                skipped: 0,
                status: 'fail',
                steps: [
                ],
                stackTrace: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
                lastError: {
                  name: 'NightwatchAssertError',
                  message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
                  showDiff: false,
                  abortOnFailure: true,
                  stack: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)'
                },
                timeMs: 4669,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:27 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:32 GMT'
              }
            },
            lastError: {
              name: 'NightwatchAssertError',
              message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m',
              showDiff: false,
              abortOnFailure: true,
              stack: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)'
            },
            timeMs: 4669,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:27 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:32 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'using CDP DOM Snapshot': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://nightwatchjs.org'
                ],
                startTime: 1680776367423,
                endTime: 1680776371918,
                elapsedTime: 4495,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'chrome.sendAndGetDevToolsCommand',
                args: [
                  'DOMSnapshot.captureSnapshot',
                  '[object Object]'
                ],
                startTime: 1680776371920,
                endTime: 1680776371920,
                elapsedTime: 0,
                status: 'fail',
                result: {
                  message: 'Error while running "chrome.sendAndGetDevToolsCommand" command: [TypeError] nightwatchInstance.transport.driver[commandName] is not a function',
                  name: 'TypeError',
                  abortOnFailure: true,
                  stack: 'TypeError: Error while running "chrome.sendAndGetDevToolsCommand" command: [TypeError] nightwatchInstance.transport.driver[commandName] is not a function\n    at ChromeCommandLoader.commandFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/_base-loader.js:38:62)\n    at TreeNode.invokeCommand (/Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:154:31)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:177:12\n    at new Promise (<anonymous>)\n    at TreeNode.execute (/Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:176:12)\n    at TreeNode.runCommand (/Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:138:27)\n    at TreeNode.run (/Users/vaibhavsingh/Dev/nightwatch/lib/core/treenode.js:112:17)\n    at AsyncTree.runChildNode (/Users/vaibhavsingh/Dev/nightwatch/lib/core/asynctree.js:118:31)\n    at AsyncTree.traverse (/Users/vaibhavsingh/Dev/nightwatch/lib/core/asynctree.js:48:33)\n    at CommandQueue.traverse (/Users/vaibhavsingh/Dev/nightwatch/lib/core/queue.js:97:8)',
                  beautifiedStack: {
                    filePath: '/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/_base-loader.js',
                    error_line_number: 38,
                    codeSnippet: [
                      {
                        line_number: 36,
                        code: '  static createDriverCommand(nightwatchInstance, commandName) {'
                      },
                      {
                        line_number: 37,
                        code: '    return function commandFn({args}) {'
                      },
                      {
                        line_number: 38,
                        code: '      return nightwatchInstance.transport.driver[commandName](...args).catch((error) => {'
                      },
                      {
                        line_number: 39,
                        code: '        if (error.remoteStacktrace) {'
                      },
                      {
                        line_number: 40,
                        code: '          delete error.remoteStacktrace;'
                      }
                    ]
                  }
                }
              },
              {
                name: 'assert.deepStrictEqual',
                args: [
                ],
                startTime: 1680776371927,
                endTime: 1680776371930,
                elapsedTime: 3,
                status: 'fail',
                result: {
                  message: 'Failed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected "documents,strings" but got: "abortOnFailure" (4ms)',
                  showDiff: false,
                  name: 'NightwatchAssertError',
                  abortOnFailure: true,
                  stack: '+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]\n    at Assertion.assert (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:112:34)\n    at StaticAssert.assertFn (/Users/vaibhavsingh/Dev/nightwatch/lib/api/_loaders/static.js:146:17)\n    at Proxy.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/lib/api/index.js:157:30)\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:10:20)',
                  beautifiedStack: {
                    filePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js',
                    error_line_number: 10,
                    codeSnippet: [
                      {
                        line_number: 8,
                        code: '    });'
                      },
                      {
                        line_number: 9,
                        code: ''
                      },
                      {
                        line_number: 10,
                        code: '    browser.assert.deepStrictEqual(Object.keys(dom), [\'documents\', \'strings\']);'
                      },
                      {
                        line_number: 11,
                        code: '  });'
                      },
                      {
                        line_number: 12,
                        code: '});'
                      }
                    ]
                  }
                },
                screenshot: '/Users/vaibhavsingh/Dev/nightwatch/screens/chromeCDP_example/using-CDP-DOM-Snapshot_FAILED_Apr-06-2023-154931-GMT+0530.png'
              },
              {
                name: 'saveScreenshot',
                args: [
                  '/Users/vaibhavsingh/Dev/nightwatch/screens/chromeCDP_example/using-CDP-DOM-Snapshot_FAILED_Apr-06-2023-154931-GMT+0530.png',
                  'function () { [native code] }'
                ],
                startTime: 1680776371985,
                endTime: 1680776372089,
                elapsedTime: 104,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'fail'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776372096,
                endTime: 1680776372556,
                elapsedTime: 460,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 1,
        errorsCount: 0,
        passedCount: 0,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:25 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:32 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'firefox',
          browserVersion: '111.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20230321111920',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.3.0',
          'moz:processID': 93704,
          'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofiletwZmUW',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          pageLoadStrategy: 'normal',
          platformName: 'mac',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify'
        },
        sessionId: '245b46ac-127c-49fa-8360-05e674967894',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'fail',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/chromeCDP_example_geckodriver.log',
        host: 'localhost',
        tests: 1,
        failures: 1,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:25.786Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:27.415Z',
            '  Response 200 POST /session (1630ms)',
            '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;245b46ac-127c-49fa-8360-05e674967894&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93704<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofiletwZmUW&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:27.426Z',
            '  Request <b><span style="color:#0AA">POST /session/245b46ac-127c-49fa-8360-05e674967894/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://nightwatchjs.org&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:31.915Z',
            '  Response 200 POST /session/245b46ac-127c-49fa-8360-05e674967894/url (4490ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:31.987Z',
            '  Request <b><span style="color:#0AA">GET /session/245b46ac-127c-49fa-8360-05e674967894/screenshot  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:32.085Z',
            '  Response 200 GET /session/245b46ac-127c-49fa-8360-05e674967894/screenshot (76ms)',
            '{\n     value: <span style="color:#0A0">&#39;iVBORw0KGgoAAAANSUhEUgAACgAAAAV8CAYAAAD3/MaLAAAgAElEQVR4XuydB3wURRvG34QUQu8gXQRpoqIiVhQUBQSxgYgF+RRB...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:32.100Z',
            '  Request <b><span style="color:#0AA">DELETE /session/245b46ac-127c-49fa-8360-05e674967894  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:32.554Z',
            '  Response 200 DELETE /session/245b46ac-127c-49fa-8360-05e674967894 (454ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:25.786Z',
            '  Request POST /session  ',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
          ],
          [
            '2023-04-06T10:19:27.415Z',
            '  Response 200 POST /session (1630ms)',
            '{\n     value: {\n       sessionId: \'245b46ac-127c-49fa-8360-05e674967894\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93704,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofiletwZmUW\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:27.426Z',
            '  Request POST /session/245b46ac-127c-49fa-8360-05e674967894/url  ',
            '{ url: \'https://nightwatchjs.org\' }'
          ],
          [
            '2023-04-06T10:19:31.915Z',
            '  Response 200 POST /session/245b46ac-127c-49fa-8360-05e674967894/url (4490ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:31.987Z',
            '  Request GET /session/245b46ac-127c-49fa-8360-05e674967894/screenshot  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:32.085Z',
            '  Response 200 GET /session/245b46ac-127c-49fa-8360-05e674967894/screenshot (76ms)',
            '{\n     value: \'iVBORw0KGgoAAAANSUhEUgAACgAAAAV8CAYAAAD3/MaLAAAgAElEQVR4XuydB3wURRvG34QUQu8gXQRpoqIiVhQUBQSxgYgF+RRB...\',\n     suppressBase64Data: true\n  }'
          ],
          [
            '2023-04-06T10:19:32.100Z',
            '  Request DELETE /session/245b46ac-127c-49fa-8360-05e674967894  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:32.554Z',
            '  Response 200 DELETE /session/245b46ac-127c-49fa-8360-05e674967894 (454ms)',
            '{ value: null }'
          ]
        ],
        globalErrorRegister: [
          '   \u001b[1;31m→ ✖ \u001b[1;31mNightwatchAssertError\u001b[0m\n   \u001b[0;31mFailed [deepStrictEqual]: (Expected values to be strictly deep-equal:\n+ actual - expected\n\n  [\n+   \'abortOnFailure\'\n-   \'documents\',\n-   \'strings\'\n  ]) - expected \u001b[0;32m"documents,strings"\u001b[0m but got: \u001b[0;31m"abortOnFailure"\u001b[0m \u001b[0;90m(4ms)\u001b[0m\u001b[0m\n\u001b[0;33m\n    Error location:\u001b[0m\n    /Users/vaibhavsingh/Dev/nightwatch/examples/tests/chromeCDP_example.js:\n    ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n     8 |     });\n     9 | \n    \u001b[0;37m\u001b[41m 10 |     browser.assert.deepStrictEqual(Object.keys(dom), [\'documents\', \'strings\']); \u001b[0m\n     11 |   });\n     12 | });\n    ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n\u001b[0m'
        ]
      },
      duckDuckGo: {
        reportPrefix: 'FIREFOX_111.0.1__',
        assertionsCount: 1,
        lastError: {
          name: 'NightwatchAssertError',
          message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
          showDiff: false,
          abortOnFailure: true,
          waitFor: true,
          stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
        },
        skipped: [
        ],
        time: '5.777',
        timeMs: 5777,
        completed: {
          'Search Nightwatch.js and check results': {
            time: '5.777',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5088ms)',
                stackTrace: '    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                fullMsg: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
                failure: 'Expected "visible" but got: "not found"',
                screenshots: [
                  '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154934-GMT+0530.png'
                ]
              }
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 1,
            skipped: 0,
            tests: 1,
            status: 'fail',
            steps: [
            ],
            stackTrace: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
            testcases: {
              'Search Nightwatch.js and check results': {
                time: '5.777',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
                    stackTrace: '    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                    fullMsg: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
                    failure: 'Expected "visible" but got: "not found"',
                    screenshots: [
                      '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154934-GMT+0530.png'
                    ]
                  }
                ],
                tests: 1,
                commands: [
                ],
                passed: 0,
                errors: 0,
                failed: 1,
                skipped: 0,
                status: 'fail',
                steps: [
                ],
                stackTrace: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                lastError: {
                  name: 'NightwatchAssertError',
                  message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
                  showDiff: false,
                  abortOnFailure: true,
                  waitFor: true,
                  stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
                },
                timeMs: 5777,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:34 GMT'
              }
            },
            lastError: {
              name: 'NightwatchAssertError',
              message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
              showDiff: false,
              abortOnFailure: true,
              waitFor: true,
              stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
            },
            timeMs: 5777,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:29 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:34 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'Search Nightwatch.js and check results': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://duckduckgo.com'
                ],
                startTime: 1680776369008,
                endTime: 1680776369560,
                elapsedTime: 552,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'waitForElementVisible',
                args: [
                  '#search_form_input_homepage'
                ],
                startTime: 1680776369561,
                endTime: 1680776374652,
                elapsedTime: 5091,
                status: 'fail',
                result: {
                  message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected "visible" but got: "not found" (5088ms)',
                  showDiff: false,
                  name: 'NightwatchAssertError',
                  abortOnFailure: true,
                  stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)',
                  beautifiedStack: {
                    filePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js',
                    error_line_number: 8,
                    codeSnippet: [
                      {
                        line_number: 6,
                        code: '    browser'
                      },
                      {
                        line_number: 7,
                        code: '      .navigateTo(\'https://duckduckgo.com\')'
                      },
                      {
                        line_number: 8,
                        code: '      .waitForElementVisible(\'#search_form_input_homepage\')'
                      },
                      {
                        line_number: 9,
                        code: '      .sendKeys(\'#search_form_input_homepage\', [\'Nightwatch.js\'])'
                      },
                      {
                        line_number: 10,
                        code: '      .click(\'#search_button_homepage\')'
                      }
                    ]
                  }
                },
                screenshot: '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154934-GMT+0530.png'
              },
              {
                name: 'saveScreenshot',
                args: [
                  '/Users/vaibhavsingh/Dev/nightwatch/screens/duckDuckGo/Search-Nightwatch.js-and-check-results_FAILED_Apr-06-2023-154934-GMT+0530.png',
                  'function () { [native code] }'
                ],
                startTime: 1680776374705,
                endTime: 1680776374779,
                elapsedTime: 74,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'fail'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776374783,
                endTime: 1680776375248,
                elapsedTime: 465,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 1,
        errorsCount: 0,
        passedCount: 0,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:26 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:34 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'firefox',
          browserVersion: '111.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20230321111920',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.3.0',
          'moz:processID': 93718,
          'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile7QoCZB',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          pageLoadStrategy: 'normal',
          platformName: 'mac',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify'
        },
        sessionId: '57729330-9108-4abf-9b31-a590c5cdf0e9',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'fail',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/duckDuckGo_geckodriver.log',
        host: 'localhost',
        tests: 1,
        failures: 1,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:27.321Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:28.997Z',
            '  Response 200 POST /session (1678ms)',
            '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;57729330-9108-4abf-9b31-a590c5cdf0e9&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93718<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile7QoCZB&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.011Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://duckduckgo.com&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:29.559Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/url (549ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:29.563Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:29.573Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (10ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:30.075Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:30.077Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (2ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:30.581Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:30.599Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (18ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:31.101Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:31.106Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:31.608Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:31.611Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:32.115Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:32.120Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:32.622Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:32.625Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:33.128Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:33.132Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:33.635Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:33.638Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:34.140Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:34.144Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:34.646Z',
            '  Request <b><span style="color:#0AA">POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#search_form_input_homepage&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:34.649Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:34.708Z',
            '  Request <b><span style="color:#0AA">GET /session/57729330-9108-4abf-9b31-a590c5cdf0e9/screenshot  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:34.774Z',
            '  Response 200 GET /session/57729330-9108-4abf-9b31-a590c5cdf0e9/screenshot (54ms)',
            '{\n     value: <span style="color:#0A0">&#39;iVBORw0KGgoAAAANSUhEUgAACgAAAAV8CAYAAAD3/MaLAAAgAElEQVR4XuzdeZhcZZk34Kf39JLuzr5CCIQlIARZBJTFBRVRRNEZ...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:34.787Z',
            '  Request <b><span style="color:#0AA">DELETE /session/57729330-9108-4abf-9b31-a590c5cdf0e9  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:35.245Z',
            '  Response 200 DELETE /session/57729330-9108-4abf-9b31-a590c5cdf0e9 (456ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:27.321Z',
            '  Request POST /session  ',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
          ],
          [
            '2023-04-06T10:19:28.997Z',
            '  Response 200 POST /session (1678ms)',
            '{\n     value: {\n       sessionId: \'57729330-9108-4abf-9b31-a590c5cdf0e9\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93718,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile7QoCZB\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:29.011Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/url  ',
            '{ url: \'https://duckduckgo.com\' }'
          ],
          [
            '2023-04-06T10:19:29.559Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/url (549ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:29.563Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:29.573Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (10ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:30.075Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:30.077Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (2ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:30.581Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:30.599Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (18ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:31.101Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:31.106Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (5ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:31.608Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:31.611Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:32.115Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:32.120Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:32.622Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:32.625Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:33.128Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:33.132Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:33.635Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:33.638Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:34.140Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:34.144Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:34.646Z',
            '  Request POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements  ',
            '{ using: \'css selector\', value: \'#search_form_input_homepage\' }'
          ],
          [
            '2023-04-06T10:19:34.649Z',
            '  Response 200 POST /session/57729330-9108-4abf-9b31-a590c5cdf0e9/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:34.708Z',
            '  Request GET /session/57729330-9108-4abf-9b31-a590c5cdf0e9/screenshot  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:34.774Z',
            '  Response 200 GET /session/57729330-9108-4abf-9b31-a590c5cdf0e9/screenshot (54ms)',
            '{\n     value: \'iVBORw0KGgoAAAANSUhEUgAACgAAAAV8CAYAAAD3/MaLAAAgAElEQVR4XuzdeZhcZZk34Kf39JLuzr5CCIQlIARZBJTFBRVRRNEZ...\',\n     suppressBase64Data: true\n  }'
          ],
          [
            '2023-04-06T10:19:34.787Z',
            '  Request DELETE /session/57729330-9108-4abf-9b31-a590c5cdf0e9  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:35.245Z',
            '  Response 200 DELETE /session/57729330-9108-4abf-9b31-a590c5cdf0e9 (456ms)',
            '{ value: null }'
          ]
        ],
        globalErrorRegister: [
          '   \u001b[1;31m→ ✖ \u001b[1;31mNightwatchAssertError\u001b[0m\n   \u001b[0;31mTimed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m\u001b[0m\n\u001b[0;33m\n    Error location:\u001b[0m\n    /Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:\n    –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n     6 |     browser\n     7 |       .navigateTo(\'https://duckduckgo.com\')\n    \u001b[0;37m\u001b[41m 8 |       .waitForElementVisible(\'#search_form_input_homepage\') \u001b[0m\n     9 |       .sendKeys(\'#search_form_input_homepage\', [\'Nightwatch.js\'])\n     10 |       .click(\'#search_button_homepage\')\n    –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––\n\u001b[0m'
        ]
      },
      googlePageObject: {
        reportPrefix: '',
        assertionsCount: 0,
        lastError: null,
        skipped: [
          'should complete the consent form'
        ],
        time: 0,
        completed: {
        },
        completedSections: {
        },
        errmessages: [
        ],
        testsCount: 0,
        skippedCount: 1,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 0,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/googlePageObject.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:36 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:36 GMT',
        sessionCapabilities: {
          browserName: 'firefox',
          alwaysMatch: {
            acceptInsecureCerts: true,
            'moz:firefoxOptions': {
              args: [
              ]
            }
          },
          name: 'google search with consent form - page objects'
        },
        sessionId: '',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'skip',
        host: 'localhost',
        tests: 0,
        failures: 0,
        errors: 0,
        httpOutput: [
        ],
        rawHttpOutput: [
        ]
      },
      ecosia: {
        reportPrefix: 'FIREFOX_111.0.1__',
        assertionsCount: 5,
        lastError: null,
        skipped: [
        ],
        time: '3.401',
        timeMs: 3401,
        completed: {
          'Demo test ecosia.org': {
            time: '3.401',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <body> was visible after 28 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <body> was visible after 28 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if the page title contains \'Ecosia\' (5ms)',
                stackTrace: '',
                fullMsg: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(5ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if element <input[type=search]> is visible (42ms)',
                stackTrace: '',
                fullMsg: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(42ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if element <button[type=submit]> is visible (40ms)',
                stackTrace: '',
                fullMsg: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(40ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if element <.layout__content> contains text \'Nightwatch.js\' (568ms)',
                stackTrace: '',
                fullMsg: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(568ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 5,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 5,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'Demo test ecosia.org': {
                time: '3.401',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <body> was visible after 28 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <body> was visible after 28 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(5ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if the page title contains \u001b[0;33m\'Ecosia\'\u001b[0m \u001b[0;90m(5ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(42ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if element \u001b[0;33m<input[type=search]>\u001b[0m is visible \u001b[0;90m(42ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(40ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if element \u001b[0;33m<button[type=submit]>\u001b[0m is visible \u001b[0;90m(40ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(568ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if element \u001b[0;33m<.layout__content>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(568ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 5,
                commands: [
                ],
                passed: 5,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 3401,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:35 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:38 GMT'
              }
            },
            timeMs: 3401,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:35 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:38 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://www.ecosia.org/'
                ],
                startTime: 1680776373072,
                endTime: 1680776375295,
                elapsedTime: 2223,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'Demo test ecosia.org': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'waitForElementVisible',
                args: [
                  'body'
                ],
                startTime: 1680776375298,
                endTime: 1680776375327,
                elapsedTime: 29,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.titleContains',
                args: [
                  'Ecosia'
                ],
                startTime: 1680776375328,
                endTime: 1680776375335,
                elapsedTime: 7,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.visible',
                args: [
                  'input[type=search]'
                ],
                startTime: 1680776375336,
                endTime: 1680776375378,
                elapsedTime: 42,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'setValue',
                args: [
                  'input[type=search]',
                  'nightwatch'
                ],
                startTime: 1680776375378,
                endTime: 1680776375475,
                elapsedTime: 97,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.visible',
                args: [
                  'button[type=submit]'
                ],
                startTime: 1680776375476,
                endTime: 1680776375518,
                elapsedTime: 42,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'click',
                args: [
                  'button[type=submit]'
                ],
                startTime: 1680776375518,
                endTime: 1680776378119,
                elapsedTime: 2601,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.textContains',
                args: [
                  '.layout__content',
                  'Nightwatch.js'
                ],
                startTime: 1680776378120,
                endTime: 1680776378695,
                elapsedTime: 575,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                ],
                startTime: 1680776378702,
                endTime: 1680776379279,
                elapsedTime: 577,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 5,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/ecosia.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:31 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:38 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'firefox',
          browserVersion: '111.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20230321111920',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.3.0',
          'moz:processID': 93753,
          'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofilekOpiU3',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          pageLoadStrategy: 'normal',
          platformName: 'mac',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify'
        },
        sessionId: '6cb34613-0649-457f-a9db-e94b1ee7a079',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/ecosia_geckodriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:31.753Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:33.066Z',
            '  Response 200 POST /session (1314ms)',
            '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;6cb34613-0649-457f-a9db-e94b1ee7a079&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93753<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofilekOpiU3&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:33.073Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://www.ecosia.org/&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:35.294Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/url (2221ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:35.301Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;body&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.313Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (13ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;79fe3b43-6ef5-46f7-b81a-6ba5e43a97d0&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.315Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;79fe3b43-6ef5-46f7-b81a-6ba5e43a97d0&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;79fe3b43-6ef5-46f7-b81a-6ba5e43a97d0&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.326Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync (11ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:35.330Z',
            '  Request <b><span style="color:#0AA">GET /session/6cb34613-0649-457f-a9db-e94b1ee7a079/title  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:35.333Z',
            '  Response 200 GET /session/6cb34613-0649-457f-a9db-e94b1ee7a079/title (3ms)',
            '{ value: <span style="color:#0A0">&#39;Ecosia - the search engine that plants trees&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:35.339Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.348Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (9ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;baaff7ce-e7e4-48bf-a109-459dce9dbdfc&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.349Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;baaff7ce-e7e4-48bf-a109-459dce9dbdfc&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;baaff7ce-e7e4-48bf-a109-459dce9dbdfc&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.377Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync (28ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:35.379Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=search]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.385Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (6ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;baaff7ce-e7e4-48bf-a109-459dce9dbdfc&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.387Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/baaff7ce-e7e4-48bf-a109-459dce9dbdfc/clear  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:35.398Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/baaff7ce-e7e4-48bf-a109-459dce9dbdfc/clear (11ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:35.399Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/baaff7ce-e7e4-48bf-a109-459dce9dbdfc/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;nightwatch&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.474Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/baaff7ce-e7e4-48bf-a109-459dce9dbdfc/value (75ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:35.482Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.495Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (14ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8e21ce02-77e5-49cb-9895-2f436159a21e&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.497Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8e21ce02-77e5-49cb-9895-2f436159a21e&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;8e21ce02-77e5-49cb-9895-2f436159a21e&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.515Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync (18ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:35.520Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;button[type=submit]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.523Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (4ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;8e21ce02-77e5-49cb-9895-2f436159a21e&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.526Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/8e21ce02-77e5-49cb-9895-2f436159a21e/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:38.119Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/8e21ce02-77e5-49cb-9895-2f436159a21e/click (2593ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:38.124Z',
            '  Request <b><span style="color:#0AA">POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;.layout__content&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:38.127Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (3ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;37f690d8-76f0-42f1-a3cc-9f5a315171f8&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:38.128Z',
            '  Request <b><span style="color:#0AA">GET /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/37f690d8-76f0-42f1-a3cc-9f5a315171f8/text  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:38.687Z',
            '  Response 200 GET /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/37f690d8-76f0-42f1-a3cc-9f5a315171f8/text (558ms)',
            '{\n     value: <span style="color:#0A0">&#39;Search\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;https://nightwatchjs.org\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwa...&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:38.706Z',
            '  Request <b><span style="color:#0AA">DELETE /session/6cb34613-0649-457f-a9db-e94b1ee7a079  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:39.278Z',
            '  Response 200 DELETE /session/6cb34613-0649-457f-a9db-e94b1ee7a079 (573ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:31.753Z',
            '  Request POST /session  ',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
          ],
          [
            '2023-04-06T10:19:33.066Z',
            '  Response 200 POST /session (1314ms)',
            '{\n     value: {\n       sessionId: \'6cb34613-0649-457f-a9db-e94b1ee7a079\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93753,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofilekOpiU3\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:33.073Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/url  ',
            '{ url: \'https://www.ecosia.org/\' }'
          ],
          [
            '2023-04-06T10:19:35.294Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/url (2221ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:35.301Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  ',
            '{ using: \'css selector\', value: \'body\' }'
          ],
          [
            '2023-04-06T10:19:35.313Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (13ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'79fe3b43-6ef5-46f7-b81a-6ba5e43a97d0\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.315Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'79fe3b43-6ef5-46f7-b81a-6ba5e43a97d0\',\n         ELEMENT: \'79fe3b43-6ef5-46f7-b81a-6ba5e43a97d0\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.326Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync (11ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:35.330Z',
            '  Request GET /session/6cb34613-0649-457f-a9db-e94b1ee7a079/title  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:35.333Z',
            '  Response 200 GET /session/6cb34613-0649-457f-a9db-e94b1ee7a079/title (3ms)',
            '{ value: \'Ecosia - the search engine that plants trees\' }'
          ],
          [
            '2023-04-06T10:19:35.339Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  ',
            '{ using: \'css selector\', value: \'input[type=search]\' }'
          ],
          [
            '2023-04-06T10:19:35.348Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (9ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'baaff7ce-e7e4-48bf-a109-459dce9dbdfc\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.349Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'baaff7ce-e7e4-48bf-a109-459dce9dbdfc\',\n         ELEMENT: \'baaff7ce-e7e4-48bf-a109-459dce9dbdfc\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.377Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync (28ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:35.379Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  ',
            '{ using: \'css selector\', value: \'input[type=search]\' }'
          ],
          [
            '2023-04-06T10:19:35.385Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (6ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'baaff7ce-e7e4-48bf-a109-459dce9dbdfc\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.387Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/baaff7ce-e7e4-48bf-a109-459dce9dbdfc/clear  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:35.398Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/baaff7ce-e7e4-48bf-a109-459dce9dbdfc/clear (11ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:35.399Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/baaff7ce-e7e4-48bf-a109-459dce9dbdfc/value  ',
            '{\n     text: \'nightwatch\',\n     value: [\n       \'n\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.474Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/baaff7ce-e7e4-48bf-a109-459dce9dbdfc/value (75ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:35.482Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  ',
            '{ using: \'css selector\', value: \'button[type=submit]\' }'
          ],
          [
            '2023-04-06T10:19:35.495Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (14ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'8e21ce02-77e5-49cb-9895-2f436159a21e\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.497Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'8e21ce02-77e5-49cb-9895-2f436159a21e\',\n         ELEMENT: \'8e21ce02-77e5-49cb-9895-2f436159a21e\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.515Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/execute/sync (18ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:35.520Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  ',
            '{ using: \'css selector\', value: \'button[type=submit]\' }'
          ],
          [
            '2023-04-06T10:19:35.523Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (4ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'8e21ce02-77e5-49cb-9895-2f436159a21e\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:35.526Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/8e21ce02-77e5-49cb-9895-2f436159a21e/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:38.119Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/8e21ce02-77e5-49cb-9895-2f436159a21e/click (2593ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:38.124Z',
            '  Request POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements  ',
            '{ using: \'css selector\', value: \'.layout__content\' }'
          ],
          [
            '2023-04-06T10:19:38.127Z',
            '  Response 200 POST /session/6cb34613-0649-457f-a9db-e94b1ee7a079/elements (3ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'37f690d8-76f0-42f1-a3cc-9f5a315171f8\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:38.128Z',
            '  Request GET /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/37f690d8-76f0-42f1-a3cc-9f5a315171f8/text  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:38.687Z',
            '  Response 200 GET /session/6cb34613-0649-457f-a9db-e94b1ee7a079/element/37f690d8-76f0-42f1-a3cc-9f5a315171f8/text (558ms)',
            '{\n     value: \'Search\\n\' +\n       \'https://nightwatchjs.org\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwa...\',\n     suppressBase64Data: true\n  }'
          ],
          [
            '2023-04-06T10:19:38.706Z',
            '  Request DELETE /session/6cb34613-0649-457f-a9db-e94b1ee7a079  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:39.278Z',
            '  Response 200 DELETE /session/6cb34613-0649-457f-a9db-e94b1ee7a079 (573ms)',
            '{ value: null }'
          ]
        ]
      },
      selectElement: {
        reportPrefix: 'FIREFOX_111.0.1__',
        assertionsCount: 1,
        lastError: null,
        skipped: [
        ],
        time: '1.082',
        timeMs: 1082,
        completed: {
          demoTest: {
            time: '1.082',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Forth option is selected (4ms)',
                stackTrace: '',
                fullMsg: 'Forth option is selected \u001b[0;90m(4ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 1,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 1,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              demoTest: {
                time: '1.082',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Forth option is selected \u001b[0;90m(4ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Forth option is selected \u001b[0;90m(4ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 1,
                commands: [
                ],
                passed: 1,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 1082,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:41 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:42 GMT'
              }
            },
            timeMs: 1082,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:41 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:42 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          demoTest: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'url',
                args: [
                  'https://www.selenium.dev/selenium/web/formPage.html'
                ],
                startTime: 1680776381835,
                endTime: 1680776382638,
                elapsedTime: 803,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'element().getAttribute',
                args: [
                  'tagName'
                ],
                startTime: 1680776382642,
                endTime: 1680776382669,
                elapsedTime: 27,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().findElement',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776382669,
                endTime: 1680776382674,
                elapsedTime: 5,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'perform',
                args: [
                  'function () { [native code] }'
                ],
                startTime: 1680776382639,
                endTime: 1680776382900,
                elapsedTime: 261,
                status: 'pass'
              },
              {
                name: 'element().findElement',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776382901,
                endTime: 1680776382905,
                elapsedTime: 4,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'assert.selected',
                args: [
                  '[object Object]',
                  'Forth option is selected'
                ],
                startTime: 1680776382906,
                endTime: 1680776382912,
                elapsedTime: 6,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776382919,
                endTime: 1680776384029,
                elapsedTime: 1110,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 1,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/selectElement.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:40 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:42 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'firefox',
          browserVersion: '111.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20230321111920',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.3.0',
          'moz:processID': 93822,
          'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileHW3NPW',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          pageLoadStrategy: 'normal',
          platformName: 'mac',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify'
        },
        sessionId: 'a1f5ad5e-07f5-4800-ba12-b7a271e609a9',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/selectElement_geckodriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:40.629Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:41.827Z',
            '  Response 200 POST /session (1199ms)',
            '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;a1f5ad5e-07f5-4800-ba12-b7a271e609a9&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93822<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileHW3NPW&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:41.837Z',
            '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://www.selenium.dev/selenium/web/formPage.html&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:42.638Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/url (801ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:42.643Z',
            '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;select[name=selectomatic]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.660Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/elements (17ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ab344c02-89da-455d-a6d9-f3d066201c38&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.661Z',
            '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var h=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=h;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (43188 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ab344c02-89da-455d-a6d9-f3d066201c38&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;ab344c02-89da-455d-a6d9-f3d066201c38&#39;<span style="color:#FFF">\n       },\n       <span style="color:#0A0">&#39;tagName&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.668Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/execute/sync (7ms)',
            '{ value: <span style="color:#0A0">&#39;SELECT&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:42.670Z',
            '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;xpath&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;./option[. = &quot;Four&quot;]|./option[normalize-space(text()) = &quot;Four&quot;]|./optgroup/option[. = &quot;Four&quot;]|./optgroup/option[normalize-space(text()) = &quot;Four&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.674Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element (4ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f5aa1430-b88f-46cf-9816-c48c2ef74bfd&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.675Z',
            '  Request <b><span style="color:#0AA">GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:42.678Z',
            '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected (3ms)',
            '{ value: <span style="color:#A50">false<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:42.679Z',
            '  Request <b><span style="color:#0AA">GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/enabled  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:42.687Z',
            '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/enabled (9ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:42.688Z',
            '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:42.900Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/click (212ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:42.901Z',
            '  Request <b><span style="color:#0AA">POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;option[value=four]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.905Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element (4ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f5aa1430-b88f-46cf-9816-c48c2ef74bfd&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.909Z',
            '  Request <b><span style="color:#0AA">GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:42.911Z',
            '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected (3ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:42.921Z',
            '  Request <b><span style="color:#0AA">DELETE /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:44.026Z',
            '  Response 200 DELETE /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9 (1105ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:40.629Z',
            '  Request POST /session  ',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
          ],
          [
            '2023-04-06T10:19:41.827Z',
            '  Response 200 POST /session (1199ms)',
            '{\n     value: {\n       sessionId: \'a1f5ad5e-07f5-4800-ba12-b7a271e609a9\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93822,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileHW3NPW\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:41.837Z',
            '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/url  ',
            '{ url: \'https://www.selenium.dev/selenium/web/formPage.html\' }'
          ],
          [
            '2023-04-06T10:19:42.638Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/url (801ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:42.643Z',
            '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/elements  ',
            '{ using: \'css selector\', value: \'select[name=selectomatic]\' }'
          ],
          [
            '2023-04-06T10:19:42.660Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/elements (17ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ab344c02-89da-455d-a6d9-f3d066201c38\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:42.661Z',
            '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var h=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=h;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (43188 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ab344c02-89da-455d-a6d9-f3d066201c38\',\n         ELEMENT: \'ab344c02-89da-455d-a6d9-f3d066201c38\'\n       },\n       \'tagName\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:42.668Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/execute/sync (7ms)',
            '{ value: \'SELECT\' }'
          ],
          [
            '2023-04-06T10:19:42.670Z',
            '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element  ',
            '{\n     using: \'xpath\',\n     value: \'./option[. = &quot;Four&quot;]|./option[normalize-space(text()) = &quot;Four&quot;]|./optgroup/option[. = &quot;Four&quot;]|./optgroup/option[normalize-space(text()) = &quot;Four&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:42.674Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element (4ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'f5aa1430-b88f-46cf-9816-c48c2ef74bfd\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:42.675Z',
            '  Request GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:42.678Z',
            '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected (3ms)',
            '{ value: false }'
          ],
          [
            '2023-04-06T10:19:42.679Z',
            '  Request GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/enabled  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:42.687Z',
            '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/enabled (9ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:42.688Z',
            '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:42.900Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/click (212ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:42.901Z',
            '  Request POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element  ',
            '{ using: \'css selector\', value: \'option[value=four]\' }'
          ],
          [
            '2023-04-06T10:19:42.905Z',
            '  Response 200 POST /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/ab344c02-89da-455d-a6d9-f3d066201c38/element (4ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'f5aa1430-b88f-46cf-9816-c48c2ef74bfd\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:42.909Z',
            '  Request GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:42.911Z',
            '  Response 200 GET /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9/element/f5aa1430-b88f-46cf-9816-c48c2ef74bfd/selected (3ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:42.921Z',
            '  Request DELETE /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:44.026Z',
            '  Response 200 DELETE /session/a1f5ad5e-07f5-4800-ba12-b7a271e609a9 (1105ms)',
            '{ value: null }'
          ]
        ]
      },
      'sample-with-relative-locators': {
        reportPrefix: 'FIREFOX_111.0.1__',
        assertionsCount: 5,
        lastError: null,
        skipped: [
        ],
        time: '0.09500',
        timeMs: 95,
        completed: {
          'locate password input': {
            time: '0.04600',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 20 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 20 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input (10ms)',
                stackTrace: '',
                fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (10ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: "password" (10ms)',
                stackTrace: '',
                fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (10ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 3,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 3,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'locate password input': {
                time: '0.04600',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 20 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 20 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (10ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (10ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (10ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (10ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 3,
                commands: [
                ],
                passed: 3,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 46,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT'
              }
            },
            timeMs: 46,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT'
          },
          'fill in password input': {
            time: '0.04900',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <form.login-form> was visible after 9 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <form.login-form> was visible after 9 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if value of element <input[type=password]> equals \'password\' (7ms)',
                stackTrace: '',
                fullMsg: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 2,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 2,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'locate password input': {
                time: '0.04600',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 20 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> was visible after 20 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (10ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to be an input\u001b[0;90m (10ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (10ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})> to have attribute "type" equal: \u001b[0;33m"password"\u001b[0m\u001b[0;90m (10ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 3,
                commands: [
                ],
                passed: 3,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 46,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT'
              },
              'fill in password input': {
                time: '0.04900',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <form.login-form> was visible after 9 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <form.login-form> was visible after 9 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if value of element \u001b[0;33m<input[type=password]>\u001b[0m equals \u001b[0;33m\'password\'\u001b[0m \u001b[0;90m(7ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 2,
                commands: [
                ],
                passed: 2,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 49,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT'
              }
            },
            timeMs: 49,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://archive.org/account/login'
                ],
                startTime: 1680776378988,
                endTime: 1680776383821,
                elapsedTime: 4833,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'locate password input': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'waitForElementVisible',
                args: [
                  'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
                ],
                startTime: 1680776383825,
                endTime: 1680776383847,
                elapsedTime: 22,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.element',
                args: [
                  'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
                ],
                startTime: 1680776383847,
                endTime: 1680776383857,
                elapsedTime: 10,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'expect.element',
                args: [
                  'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})'
                ],
                startTime: 1680776383857,
                endTime: 1680776383867,
                elapsedTime: 10,
                status: 'pass',
                result: {
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'fill in password input': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'waitForElementVisible',
                args: [
                  'form.login-form'
                ],
                startTime: 1680776383869,
                endTime: 1680776383878,
                elapsedTime: 9,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'setValue',
                args: [
                  'RelativeBy({"relative":{"root":{"tag name":"input"},"filters":[{"kind":"below","args":[{"css selector":"input[type=email]"}]}]}})',
                  'password'
                ],
                startTime: 1680776383878,
                endTime: 1680776383907,
                elapsedTime: 29,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.valueEquals',
                args: [
                  'input[type=password]',
                  'password'
                ],
                startTime: 1680776383908,
                endTime: 1680776383917,
                elapsedTime: 9,
                status: 'pass',
                result: {
                  status: 0
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                ],
                startTime: 1680776383919,
                endTime: 1680776384266,
                elapsedTime: 347,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 2,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 5,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/sample-with-relative-locators.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:37 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:43 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'firefox',
          browserVersion: '111.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20230321111920',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.3.0',
          'moz:processID': 93802,
          'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileblN5O0',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          pageLoadStrategy: 'normal',
          platformName: 'mac',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify'
        },
        sessionId: 'e778e563-6512-4f69-b72c-fe30bb5df801',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/sample-with-relative-locators_geckodriver.log',
        host: 'localhost',
        tests: 2,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:37.670Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:38.983Z',
            '  Response 200 POST /session (1314ms)',
            '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;e778e563-6512-4f69-b72c-fe30bb5df801&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93802<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileblN5O0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:38.990Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://archive.org/account/login&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:43.820Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/url (4831ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:43.828Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.839Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (12ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;698e20ed-f1e9-4bd3-9469-bc6001cc8926&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed49daea-95cf-4c88-92b5-5091c9d0faae&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;c9f0afe9-4af4-4842-9da3-2fa454dd3bdb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.841Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;698e20ed-f1e9-4bd3-9469-bc6001cc8926&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;698e20ed-f1e9-4bd3-9469-bc6001cc8926&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.846Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (6ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:43.848Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.854Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (5ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;698e20ed-f1e9-4bd3-9469-bc6001cc8926&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed49daea-95cf-4c88-92b5-5091c9d0faae&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;c9f0afe9-4af4-4842-9da3-2fa454dd3bdb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.855Z',
            '  Request <b><span style="color:#0AA">GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/name  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:43.856Z',
            '  Response 200 GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/name (2ms)',
            '{ value: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:43.858Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.863Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (5ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;698e20ed-f1e9-4bd3-9469-bc6001cc8926&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed49daea-95cf-4c88-92b5-5091c9d0faae&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;c9f0afe9-4af4-4842-9da3-2fa454dd3bdb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.864Z',
            '  Request <b><span style="color:#0AA">GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/attribute/type  </span></b>',
            '<span style="color:#555">undefined<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:43.867Z',
            '  Response 200 GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/attribute/type (3ms)',
            '{ value: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:43.870Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;form.login-form&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.872Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/elements (2ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;473d143d-3025-498e-9b71-7c7fdfca85e0&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.873Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;473d143d-3025-498e-9b71-7c7fdfca85e0&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;473d143d-3025-498e-9b71-7c7fdfca85e0&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.878Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (5ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:43.880Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         relative: { root: { <span style="color:#0A0">&#39;tag name&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;input&#39;<span style="color:#FFF"> }, filters: [ <span style="color:#0AA">[Object]<span style="color:#FFF"> ] }\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.889Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (10ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;698e20ed-f1e9-4bd3-9469-bc6001cc8926&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;ed49daea-95cf-4c88-92b5-5091c9d0faae&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;c9f0afe9-4af4-4842-9da3-2fa454dd3bdb&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.890Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/clear  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:43.895Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/clear (5ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:43.896Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;p&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;o&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;r&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;d&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.907Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/value (11ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:43.911Z',
            '  Request <b><span style="color:#0AA">POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=password]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.913Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/elements (2ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;698e20ed-f1e9-4bd3-9469-bc6001cc8926&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.913Z',
            '  Request <b><span style="color:#0AA">GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/property/value  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:43.915Z',
            '  Response 200 GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/property/value (2ms)',
            '{ value: <span style="color:#0A0">&#39;password&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:43.921Z',
            '  Request <b><span style="color:#0AA">DELETE /session/e778e563-6512-4f69-b72c-fe30bb5df801  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:44.265Z',
            '  Response 200 DELETE /session/e778e563-6512-4f69-b72c-fe30bb5df801 (344ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:37.670Z',
            '  Request POST /session  ',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
          ],
          [
            '2023-04-06T10:19:38.983Z',
            '  Response 200 POST /session (1314ms)',
            '{\n     value: {\n       sessionId: \'e778e563-6512-4f69-b72c-fe30bb5df801\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93802,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileblN5O0\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:38.990Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/url  ',
            '{ url: \'https://archive.org/account/login\' }'
          ],
          [
            '2023-04-06T10:19:43.820Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/url (4831ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:43.828Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.839Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (12ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'698e20ed-f1e9-4bd3-9469-bc6001cc8926\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed49daea-95cf-4c88-92b5-5091c9d0faae\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'c9f0afe9-4af4-4842-9da3-2fa454dd3bdb\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.841Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'698e20ed-f1e9-4bd3-9469-bc6001cc8926\',\n         ELEMENT: \'698e20ed-f1e9-4bd3-9469-bc6001cc8926\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.846Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (6ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:43.848Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.854Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (5ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'698e20ed-f1e9-4bd3-9469-bc6001cc8926\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed49daea-95cf-4c88-92b5-5091c9d0faae\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'c9f0afe9-4af4-4842-9da3-2fa454dd3bdb\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.855Z',
            '  Request GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/name  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:43.856Z',
            '  Response 200 GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/name (2ms)',
            '{ value: \'input\' }'
          ],
          [
            '2023-04-06T10:19:43.858Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.863Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (5ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'698e20ed-f1e9-4bd3-9469-bc6001cc8926\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed49daea-95cf-4c88-92b5-5091c9d0faae\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'c9f0afe9-4af4-4842-9da3-2fa454dd3bdb\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.864Z',
            '  Request GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/attribute/type  ',
            'undefined'
          ],
          [
            '2023-04-06T10:19:43.867Z',
            '  Response 200 GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/attribute/type (3ms)',
            '{ value: \'password\' }'
          ],
          [
            '2023-04-06T10:19:43.870Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/elements  ',
            '{ using: \'css selector\', value: \'form.login-form\' }'
          ],
          [
            '2023-04-06T10:19:43.872Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/elements (2ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'473d143d-3025-498e-9b71-7c7fdfca85e0\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.873Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'473d143d-3025-498e-9b71-7c7fdfca85e0\',\n         ELEMENT: \'473d143d-3025-498e-9b71-7c7fdfca85e0\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.878Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (5ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:43.880Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var aa=this||self;function ba(a){return&quot;string&quot;==typeof a}function ca(a,b){a=a.split(&quot;.&quot;);var c=aa;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;... (53855 characters)\',\n     args: [\n       {\n         relative: { root: { \'tag name\': \'input\' }, filters: [ [Object] ] }\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.889Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/execute/sync (10ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'698e20ed-f1e9-4bd3-9469-bc6001cc8926\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'ed49daea-95cf-4c88-92b5-5091c9d0faae\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'c9f0afe9-4af4-4842-9da3-2fa454dd3bdb\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.890Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/clear  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:43.895Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/clear (5ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:43.896Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/value  ',
            '{\n     text: \'password\',\n     value: [\n       \'p\', \'a\', \'s\',\n       \'s\', \'w\', \'o\',\n       \'r\', \'d\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.907Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/value (11ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:43.911Z',
            '  Request POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/elements  ',
            '{ using: \'css selector\', value: \'input[type=password]\' }'
          ],
          [
            '2023-04-06T10:19:43.913Z',
            '  Response 200 POST /session/e778e563-6512-4f69-b72c-fe30bb5df801/elements (2ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'698e20ed-f1e9-4bd3-9469-bc6001cc8926\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:43.913Z',
            '  Request GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/property/value  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:43.915Z',
            '  Response 200 GET /session/e778e563-6512-4f69-b72c-fe30bb5df801/element/698e20ed-f1e9-4bd3-9469-bc6001cc8926/property/value (2ms)',
            '{ value: \'password\' }'
          ],
          [
            '2023-04-06T10:19:43.921Z',
            '  Request DELETE /session/e778e563-6512-4f69-b72c-fe30bb5df801  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:44.265Z',
            '  Response 200 DELETE /session/e778e563-6512-4f69-b72c-fe30bb5df801 (344ms)',
            '{ value: null }'
          ]
        ]
      },
      shadowRootExample: {
        reportPrefix: '',
        assertionsCount: 0,
        lastError: null,
        skipped: [
          'retrieve the shadowRoot'
        ],
        time: 0,
        completed: {
        },
        completedSections: {
        },
        errmessages: [
        ],
        testsCount: 0,
        skippedCount: 1,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 0,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/shadowRootExample.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:45 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:45 GMT',
        sessionCapabilities: {
          browserName: 'firefox',
          alwaysMatch: {
            acceptInsecureCerts: true,
            'moz:firefoxOptions': {
              args: [
              ]
            }
          },
          name: 'Shadow Root example test'
        },
        sessionId: '',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'skip',
        host: 'localhost',
        tests: 0,
        failures: 0,
        errors: 0,
        httpOutput: [
        ],
        rawHttpOutput: [
        ]
      },
      google: {
        reportPrefix: 'FIREFOX_111.0.1__',
        assertionsCount: 2,
        lastError: null,
        skipped: [
        ],
        time: '10.68',
        timeMs: 10675,
        completed: {
          'demo test using expect apis': {
            time: '10.68',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                stackTrace: '',
                fullMsg: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Testing if element <#rso>:first-child> contains text \'Nightwatch.js\' (1069ms)',
                stackTrace: '',
                fullMsg: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(1069ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 2,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 2,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'demo test using expect apis': {
                time: '10.68',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                    stackTrace: '',
                    fullMsg: 'Element <form[action="/search"] input[type=text]> was visible after 15 milliseconds.',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(1069ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Testing if element \u001b[0;33m<#rso>:first-child>\u001b[0m contains text \u001b[0;33m\'Nightwatch.js\'\u001b[0m \u001b[0;90m(1069ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 2,
                commands: [
                ],
                passed: 2,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 10675,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:35 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:46 GMT'
              }
            },
            timeMs: 10675,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:35 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:46 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'demo test using expect apis': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'http://google.no'
                ],
                startTime: 1680776375516,
                endTime: 1680776379577,
                elapsedTime: 4061,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'isPresent',
                args: [
                  '[aria-modal="true"][title="Before you continue to Google Search"]'
                ],
                startTime: 1680776379578,
                endTime: 1680776384672,
                elapsedTime: 5094,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'waitForElementVisible',
                args: [
                  'form[action="/search"] input[type=text]'
                ],
                startTime: 1680776384675,
                endTime: 1680776384690,
                elapsedTime: 15,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'sendKeys',
                args: [
                  'form[action="/search"] input[type=text]',
                  'Nightwatch.js,'
                ],
                startTime: 1680776384690,
                endTime: 1680776384728,
                elapsedTime: 38,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'assert.textContains',
                args: [
                  '#rso>:first-child',
                  'Nightwatch.js'
                ],
                startTime: 1680776384728,
                endTime: 1680776385800,
                elapsedTime: 1072,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'end',
                args: [
                ],
                startTime: 1680776385800,
                endTime: 1680776386186,
                elapsedTime: 386,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 2,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/google.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:33 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:46 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'firefox',
          browserVersion: '111.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20230321111920',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.3.0',
          'moz:processID': 93775,
          'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileoRDuKX',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          pageLoadStrategy: 'normal',
          platformName: 'mac',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify'
        },
        sessionId: 'c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'pass',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:34.090Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:35.510Z',
            '  Response 200 POST /session (1421ms)',
            '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93775<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileoRDuKX&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:35.517Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;http://google.no&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:39.576Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/url (4059ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:39.580Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:39.588Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:40.091Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:40.096Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:40.598Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:40.600Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:41.103Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:41.111Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:41.614Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:41.620Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (7ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:42.123Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.128Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:42.630Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:42.637Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:43.140Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.154Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (15ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:43.656Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:43.659Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:44.161Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.163Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (2ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:44.665Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.669Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:44.676Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;form[action=&quot;/search&quot;] input[type=text]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.680Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d11d4330-8ae2-44c8-b64a-3971618fbde5&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.682Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/execute/sync  </span></b>',
            '{\n     script: <span style="color:#0A0">&#39;return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)&#39;<span style="color:#FFF">,\n     args: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d11d4330-8ae2-44c8-b64a-3971618fbde5&#39;<span style="color:#FFF">,\n         ELEMENT: <span style="color:#0A0">&#39;d11d4330-8ae2-44c8-b64a-3971618fbde5&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.689Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/execute/sync (7ms)',
            '{ value: <span style="color:#A50">true<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:44.691Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{\n     using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">,\n     value: <span style="color:#0A0">&#39;form[action=&quot;/search&quot;] input[type=text]&#39;<span style="color:#FFF">\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.694Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d11d4330-8ae2-44c8-b64a-3971618fbde5&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.695Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/d11d4330-8ae2-44c8-b64a-3971618fbde5/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;Nightwatch.js&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;N&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;.&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;j&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.727Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/d11d4330-8ae2-44c8-b64a-3971618fbde5/value (32ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:44.730Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#rso&gt;:first-child&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:44.732Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (2ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:45.235Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#rso&gt;:first-child&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:45.238Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:45.741Z',
            '  Request <b><span style="color:#0AA">POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#rso&gt;:first-child&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:45.744Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;1e7d46f7-02cf-45c5-9db9-6673572e7e78&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:45.746Z',
            '  Request <b><span style="color:#0AA">GET /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/1e7d46f7-02cf-45c5-9db9-6673572e7e78/text  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:45.797Z',
            '  Response 200 GET /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/1e7d46f7-02cf-45c5-9db9-6673572e7e78/text (51ms)',
            '{\n     value: <span style="color:#0A0">&#39;Web result with site links\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch.js | Node.js powered End-to-End testing framework\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Nightwatch....&#39;<span style="color:#FFF">,\n     suppressBase64Data: <span style="color:#A50">true<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:45.803Z',
            '  Request <b><span style="color:#0AA">DELETE /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:46.185Z',
            '  Response 200 DELETE /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d (383ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:34.090Z',
            '  Request POST /session  ',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
          ],
          [
            '2023-04-06T10:19:35.510Z',
            '  Response 200 POST /session (1421ms)',
            '{\n     value: {\n       sessionId: \'c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93775,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofileoRDuKX\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:35.517Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/url  ',
            '{ url: \'http://google.no\' }'
          ],
          [
            '2023-04-06T10:19:39.576Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/url (4059ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:39.580Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:39.588Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:40.091Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:40.096Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:40.598Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:40.600Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:41.103Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:41.111Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:41.614Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:41.620Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (7ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:42.123Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:42.128Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (6ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:42.630Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:42.637Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (8ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:43.140Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:43.154Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (15ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:43.656Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:43.659Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:44.161Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:44.163Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (2ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:44.665Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'[aria-modal=&quot;true&quot;][title=&quot;Before you continue to Google Search&quot;]\'\n  }'
          ],
          [
            '2023-04-06T10:19:44.669Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:44.676Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'form[action=&quot;/search&quot;] input[type=text]\'\n  }'
          ],
          [
            '2023-04-06T10:19:44.680Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d11d4330-8ae2-44c8-b64a-3971618fbde5\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:44.682Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/execute/sync  ',
            '{\n     script: \'return (function(){return (function(){var k=this||self;function aa(a){return&quot;string&quot;==typeof a}function ba(a,b){a=a.split(&quot;.&quot;);var c=k;a[0]in c||&quot;undefined&quot;==typeof c.execScript||c.execScript(&quot;var &quot;+a... (44027 characters)\',\n     args: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d11d4330-8ae2-44c8-b64a-3971618fbde5\',\n         ELEMENT: \'d11d4330-8ae2-44c8-b64a-3971618fbde5\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:44.689Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/execute/sync (7ms)',
            '{ value: true }'
          ],
          [
            '2023-04-06T10:19:44.691Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{\n     using: \'css selector\',\n     value: \'form[action=&quot;/search&quot;] input[type=text]\'\n  }'
          ],
          [
            '2023-04-06T10:19:44.694Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d11d4330-8ae2-44c8-b64a-3971618fbde5\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:44.695Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/d11d4330-8ae2-44c8-b64a-3971618fbde5/value  ',
            '{\n     text: \'Nightwatch.js\',\n     value: [\n       \'N\', \'i\', \'g\', \'h\',\n       \'t\', \'w\', \'a\', \'t\',\n       \'c\', \'h\', \'.\', \'j\',\n       \'s\', \'\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:44.727Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/d11d4330-8ae2-44c8-b64a-3971618fbde5/value (32ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:44.730Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{ using: \'css selector\', value: \'#rso&gt;:first-child\' }'
          ],
          [
            '2023-04-06T10:19:44.732Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (2ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:45.235Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{ using: \'css selector\', value: \'#rso&gt;:first-child\' }'
          ],
          [
            '2023-04-06T10:19:45.238Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (4ms)',
            '{ value: [] }'
          ],
          [
            '2023-04-06T10:19:45.741Z',
            '  Request POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements  ',
            '{ using: \'css selector\', value: \'#rso&gt;:first-child\' }'
          ],
          [
            '2023-04-06T10:19:45.744Z',
            '  Response 200 POST /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/elements (3ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'1e7d46f7-02cf-45c5-9db9-6673572e7e78\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:45.746Z',
            '  Request GET /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/1e7d46f7-02cf-45c5-9db9-6673572e7e78/text  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:45.797Z',
            '  Response 200 GET /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d/element/1e7d46f7-02cf-45c5-9db9-6673572e7e78/text (51ms)',
            '{\n     value: \'Web result with site links\\n\' +\n       \'\\n\' +\n       \'Nightwatch.js | Node.js powered End-to-End testing framework\\n\' +\n       \'Nightwatch....\',\n     suppressBase64Data: true\n  }'
          ],
          [
            '2023-04-06T10:19:45.803Z',
            '  Request DELETE /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:46.185Z',
            '  Response 200 DELETE /session/c72af4c6-ebcd-4db4-8c9e-a9b8d593a88d (383ms)',
            '{ value: null }'
          ]
        ]
      },
      vueTodoList: {
        reportPrefix: 'FIREFOX_111.0.1__',
        assertionsCount: 3,
        lastError: null,
        skipped: [
        ],
        time: '1.251',
        timeMs: 1251,
        completed: {
          'should add a todo using global element()': {
            time: '1.251',
            assertions: [
              {
                name: 'NightwatchAssertError',
                message: 'Expected elements <#todo-list ul li> count to equal: "5" (4ms)',
                stackTrace: '',
                fullMsg: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected element <#todo-list ul li> text to contain: "what is nightwatch?" (15ms)',
                stackTrace: '',
                fullMsg: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                failure: false
              },
              {
                name: 'NightwatchAssertError',
                message: 'Expected elements <#todo-list ul li input:checked> count to equal: "3" (4ms)',
                stackTrace: '',
                fullMsg: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                failure: false
              }
            ],
            commands: [
            ],
            passed: 3,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 3,
            status: 'pass',
            steps: [
            ],
            stackTrace: '',
            testcases: {
              'should add a todo using global element()': {
                time: '1.251',
                assertions: [
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected elements <#todo-list ul li> count to equal: \u001b[0;33m"5"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected element <#todo-list ul li> text to contain: \u001b[0;33m"what is nightwatch?"\u001b[0m\u001b[0;90m (15ms)\u001b[0m',
                    failure: false
                  },
                  {
                    name: 'NightwatchAssertError',
                    message: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                    stackTrace: '',
                    fullMsg: 'Expected elements <#todo-list ul li input:checked> count to equal: \u001b[0;33m"3"\u001b[0m\u001b[0;90m (4ms)\u001b[0m',
                    failure: false
                  }
                ],
                tests: 3,
                commands: [
                ],
                passed: 3,
                errors: 0,
                failed: 0,
                skipped: 0,
                status: 'pass',
                steps: [
                ],
                stackTrace: '',
                timeMs: 1251,
                startTimestamp: 'Thu, 06 Apr 2023 10:19:47 GMT',
                endTimestamp: 'Thu, 06 Apr 2023 10:19:48 GMT'
              }
            },
            timeMs: 1251,
            startTimestamp: 'Thu, 06 Apr 2023 10:19:47 GMT',
            endTimestamp: 'Thu, 06 Apr 2023 10:19:48 GMT'
          }
        },
        completedSections: {
          __global_beforeEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __before_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          'should add a todo using global element()': {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'navigateTo',
                args: [
                  'https://todo-vue3-vite.netlify.app/'
                ],
                startTime: 1680776387084,
                endTime: 1680776387841,
                elapsedTime: 757,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'sendKeys',
                args: [
                  '#new-todo-input',
                  'what is nightwatch?'
                ],
                startTime: 1680776387841,
                endTime: 1680776387864,
                elapsedTime: 23,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'click',
                args: [
                  'form button[type="submit"]'
                ],
                startTime: 1680776387865,
                endTime: 1680776388087,
                elapsedTime: 222,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.elements',
                args: [
                  '#todo-list ul li'
                ],
                startTime: 1680776388091,
                endTime: 1680776388095,
                elapsedTime: 4,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'expect.element',
                args: [
                  '#todo-list ul li'
                ],
                startTime: 1680776388096,
                endTime: 1680776388111,
                elapsedTime: 15,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'element().findElement',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776388111,
                endTime: 1680776388114,
                elapsedTime: 3,
                status: 'pass',
                result: {
                }
              },
              {
                name: 'click',
                args: [
                  '[object Object]'
                ],
                startTime: 1680776388116,
                endTime: 1680776388327,
                elapsedTime: 211,
                status: 'pass',
                result: {
                  status: 0
                }
              },
              {
                name: 'expect.elements',
                args: [
                  '#todo-list ul li input:checked'
                ],
                startTime: 1680776388328,
                endTime: 1680776388332,
                elapsedTime: 4,
                status: 'pass',
                result: {
                }
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __after_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          },
          __global_afterEach_hook: {
            time: 0,
            assertions: [
            ],
            commands: [
              {
                name: 'end',
                args: [
                  'true'
                ],
                startTime: 1680776388337,
                endTime: 1680776389341,
                elapsedTime: 1004,
                status: 'pass'
              }
            ],
            passed: 0,
            errors: 0,
            failed: 0,
            skipped: 0,
            tests: 0,
            status: 'pass'
          }
        },
        errmessages: [
        ],
        testsCount: 1,
        skippedCount: 0,
        failedCount: 0,
        errorsCount: 0,
        passedCount: 3,
        group: '',
        modulePath: '/Users/vaibhavsingh/Dev/nightwatch/examples/tests/vueTodoList.js',
        startTimestamp: 'Thu, 06 Apr 2023 10:19:45 GMT',
        endTimestamp: 'Thu, 06 Apr 2023 10:19:48 GMT',
        sessionCapabilities: {
          acceptInsecureCerts: false,
          browserName: 'firefox',
          browserVersion: '111.0.1',
          'moz:accessibilityChecks': false,
          'moz:buildID': '20230321111920',
          'moz:geckodriverVersion': '0.32.0',
          'moz:headless': false,
          'moz:platformVersion': '22.3.0',
          'moz:processID': 93855,
          'moz:profile': '/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile2iTSVu',
          'moz:shutdownTimeout': 60000,
          'moz:useNonSpecCompliantPointerOrigin': false,
          'moz:webdriverClick': true,
          'moz:windowless': false,
          pageLoadStrategy: 'normal',
          platformName: 'mac',
          proxy: {
          },
          setWindowRect: true,
          strictFileInteractability: false,
          timeouts: {
            implicit: 0,
            pageLoad: 300000,
            script: 30000
          },
          unhandledPromptBehavior: 'dismiss and notify'
        },
        sessionId: '02cdc21b-3ae3-4f80-b595-07f8498c4a11',
        projectName: '',
        buildName: '',
        testEnv: 'firefox',
        isMobile: false,
        status: 'pass',
        seleniumLog: '/Users/vaibhavsingh/Dev/nightwatch/logs/vueTodoList_geckodriver.log',
        host: 'localhost',
        tests: 1,
        failures: 0,
        errors: 0,
        httpOutput: [
          [
            '2023-04-06T10:19:45.864Z',
            '  Request <b><span style="color:#0AA">POST /session  </span></b>',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF"> } }\n  }</span></span>'
          ],
          [
            '2023-04-06T10:19:47.078Z',
            '  Response 200 POST /session (1217ms)',
            '{\n     value: {\n       sessionId: <span style="color:#0A0">&#39;02cdc21b-3ae3-4f80-b595-07f8498c4a11&#39;<span style="color:#FFF">,\n       capabilities: {\n         acceptInsecureCerts: <span style="color:#A50">false<span style="color:#FFF">,\n         browserName: <span style="color:#0A0">&#39;firefox&#39;<span style="color:#FFF">,\n         browserVersion: <span style="color:#0A0">&#39;111.0.1&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:accessibilityChecks&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:buildID&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;20230321111920&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:geckodriverVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;0.32.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:headless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:platformVersion&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;22.3.0&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:processID&#39;<span style="color:#FFF">: <span style="color:#A50">93855<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:profile&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile2iTSVu&#39;<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:shutdownTimeout&#39;<span style="color:#FFF">: <span style="color:#A50">60000<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:useNonSpecCompliantPointerOrigin&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:webdriverClick&#39;<span style="color:#FFF">: <span style="color:#A50">true<span style="color:#FFF">,\n         <span style="color:#0A0">&#39;moz:windowless&#39;<span style="color:#FFF">: <span style="color:#A50">false<span style="color:#FFF">,\n         pageLoadStrategy: <span style="color:#0A0">&#39;normal&#39;<span style="color:#FFF">,\n         platformName: <span style="color:#0A0">&#39;mac&#39;<span style="color:#FFF">,\n         proxy: {},\n         setWindowRect: <span style="color:#A50">true<span style="color:#FFF">,\n         strictFileInteractability: <span style="color:#A50">false<span style="color:#FFF">,\n         timeouts: { implicit: <span style="color:#A50">0<span style="color:#FFF">, pageLoad: <span style="color:#A50">300000<span style="color:#FFF">, script: <span style="color:#A50">30000<span style="color:#FFF"> },\n         unhandledPromptBehavior: <span style="color:#0A0">&#39;dismiss and notify&#39;<span style="color:#FFF">\n       }\n     }\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:47.085Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/url  </span></b>',
            '{ url: <span style="color:#0A0">&#39;https://todo-vue3-vite.netlify.app/&#39;<span style="color:#FFF"> }</span></span>'
          ],
          [
            '2023-04-06T10:19:47.840Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/url (755ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:47.843Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#new-todo-input&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:47.848Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (6ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;cbf47355-2c00-4daf-b3b5-8179d43d1e88&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:47.851Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/cbf47355-2c00-4daf-b3b5-8179d43d1e88/value  </span></b>',
            '{\n     text: <span style="color:#0A0">&#39;what is nightwatch?&#39;<span style="color:#FFF">,\n     value: [\n       <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;s&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39; &#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;n&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;i&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;g&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;w&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;a&#39;<span style="color:#FFF">,\n       <span style="color:#0A0">&#39;t&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;c&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;h&#39;<span style="color:#FFF">, <span style="color:#0A0">&#39;?&#39;<span style="color:#FFF">\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:47.863Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/cbf47355-2c00-4daf-b3b5-8179d43d1e88/value (13ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:47.867Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;form button[type=&quot;submit&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:47.871Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (5ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:47.873Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:48.087Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed/click (215ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:48.092Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.094Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9fba7102-78a1-4f16-8085-471f605574cf&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d8c3dbca-d8d8-4395-bdee-5dd16a889d37&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;320b0952-82ca-4c8d-b91b-36141f695c14&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f8514d2e-85c6-4991-8920-31e10a6d7f88&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2bfecd6d-d71c-4946-97bd-5521f6a31055&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.096Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.098Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9fba7102-78a1-4f16-8085-471f605574cf&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;d8c3dbca-d8d8-4395-bdee-5dd16a889d37&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;320b0952-82ca-4c8d-b91b-36141f695c14&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;f8514d2e-85c6-4991-8920-31e10a6d7f88&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;2bfecd6d-d71c-4946-97bd-5521f6a31055&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.099Z',
            '  Request <b><span style="color:#0AA">GET /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/text  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:48.110Z',
            '  Response 200 GET /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/text (11ms)',
            '{\n     value: <span style="color:#0A0">&#39;new taskwhat is nightwatch?\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Edit\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;New Taskwhat Is Nightwatch?\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;Delete\\n&#39;<span style="color:#FFF"> +\n       <span style="color:#0A0">&#39;New Taskwhat Is Nightwatch?&#39;<span style="color:#FFF">\n  }</span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.112Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/element  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;input[type=&quot;checkbox&quot;]&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.114Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/element (2ms)',
            '{\n     value: {\n       <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9db02cb5-bb43-4ef1-b935-38a417240ee2&#39;<span style="color:#FFF">\n     }\n  }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.117Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/9db02cb5-bb43-4ef1-b935-38a417240ee2/click  </span></b>',
            '{}'
          ],
          [
            '2023-04-06T10:19:48.327Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/9db02cb5-bb43-4ef1-b935-38a417240ee2/click (209ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ],
          [
            '2023-04-06T10:19:48.329Z',
            '  Request <b><span style="color:#0AA">POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  </span></b>',
            '{ using: <span style="color:#0A0">&#39;css selector&#39;<span style="color:#FFF">, value: <span style="color:#0A0">&#39;#todo-list ul li input:checked&#39;<span style="color:#FFF"> }</span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.331Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
            '{\n     value: [\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;a6373a47-f735-4162-bb2d-36b5aa4756a4&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;56a696cc-b2f5-4300-8428-0bcf93409417&#39;<span style="color:#FFF">\n       },\n       {\n         <span style="color:#0A0">&#39;element-6066-11e4-a52e-4f735466cecf&#39;<span style="color:#FFF">: <span style="color:#0A0">&#39;9db02cb5-bb43-4ef1-b935-38a417240ee2&#39;<span style="color:#FFF">\n       }\n     ]\n  }</span></span></span></span></span></span></span></span></span></span></span></span>'
          ],
          [
            '2023-04-06T10:19:48.340Z',
            '  Request <b><span style="color:#0AA">DELETE /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11  </span></b>',
            '<span style="color:#0A0">&#39;&#39;<span style="color:#FFF"></span></span>'
          ],
          [
            '2023-04-06T10:19:49.340Z',
            '  Response 200 DELETE /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11 (1000ms)',
            '{ value: <b>null<span style="font-weight:normal;text-decoration:none;font-style:normal"> }</span></b>'
          ]
        ],
        rawHttpOutput: [
          [
            '2023-04-06T10:19:45.864Z',
            '  Request POST /session  ',
            '{\n     capabilities: { firstMatch: [ {} ], alwaysMatch: { browserName: \'firefox\' } }\n  }'
          ],
          [
            '2023-04-06T10:19:47.078Z',
            '  Response 200 POST /session (1217ms)',
            '{\n     value: {\n       sessionId: \'02cdc21b-3ae3-4f80-b595-07f8498c4a11\',\n       capabilities: {\n         acceptInsecureCerts: false,\n         browserName: \'firefox\',\n         browserVersion: \'111.0.1\',\n         \'moz:accessibilityChecks\': false,\n         \'moz:buildID\': \'20230321111920\',\n         \'moz:geckodriverVersion\': \'0.32.0\',\n         \'moz:headless\': false,\n         \'moz:platformVersion\': \'22.3.0\',\n         \'moz:processID\': 93855,\n         \'moz:profile\': \'/var/folders/3j/vnc2ktf17bq7qtb8qstq1fk40000gq/T/rust_mozprofile2iTSVu\',\n         \'moz:shutdownTimeout\': 60000,\n         \'moz:useNonSpecCompliantPointerOrigin\': false,\n         \'moz:webdriverClick\': true,\n         \'moz:windowless\': false,\n         pageLoadStrategy: \'normal\',\n         platformName: \'mac\',\n         proxy: {},\n         setWindowRect: true,\n         strictFileInteractability: false,\n         timeouts: { implicit: 0, pageLoad: 300000, script: 30000 },\n         unhandledPromptBehavior: \'dismiss and notify\'\n       }\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:47.085Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/url  ',
            '{ url: \'https://todo-vue3-vite.netlify.app/\' }'
          ],
          [
            '2023-04-06T10:19:47.840Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/url (755ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:47.843Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
            '{ using: \'css selector\', value: \'#new-todo-input\' }'
          ],
          [
            '2023-04-06T10:19:47.848Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (6ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'cbf47355-2c00-4daf-b3b5-8179d43d1e88\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:47.851Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/cbf47355-2c00-4daf-b3b5-8179d43d1e88/value  ',
            '{\n     text: \'what is nightwatch?\',\n     value: [\n       \'w\', \'h\', \'a\', \'t\', \' \',\n       \'i\', \'s\', \' \', \'n\', \'i\',\n       \'g\', \'h\', \'t\', \'w\', \'a\',\n       \'t\', \'c\', \'h\', \'?\'\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:47.863Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/cbf47355-2c00-4daf-b3b5-8179d43d1e88/value (13ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:47.867Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
            '{ using: \'css selector\', value: \'form button[type=&quot;submit&quot;]\' }'
          ],
          [
            '2023-04-06T10:19:47.871Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (5ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:47.873Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:48.087Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/4588a889-58e9-4d3d-87e4-ab0e6fe6d9ed/click (215ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:48.092Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
            '{ using: \'css selector\', value: \'#todo-list ul li\' }'
          ],
          [
            '2023-04-06T10:19:48.094Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9fba7102-78a1-4f16-8085-471f605574cf\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d8c3dbca-d8d8-4395-bdee-5dd16a889d37\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'320b0952-82ca-4c8d-b91b-36141f695c14\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f8514d2e-85c6-4991-8920-31e10a6d7f88\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2bfecd6d-d71c-4946-97bd-5521f6a31055\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:48.096Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
            '{ using: \'css selector\', value: \'#todo-list ul li\' }'
          ],
          [
            '2023-04-06T10:19:48.098Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9fba7102-78a1-4f16-8085-471f605574cf\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'d8c3dbca-d8d8-4395-bdee-5dd16a889d37\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'320b0952-82ca-4c8d-b91b-36141f695c14\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'f8514d2e-85c6-4991-8920-31e10a6d7f88\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'2bfecd6d-d71c-4946-97bd-5521f6a31055\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:48.099Z',
            '  Request GET /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/text  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:48.110Z',
            '  Response 200 GET /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/text (11ms)',
            '{\n     value: \'new taskwhat is nightwatch?\\n\' +\n       \'Edit\\n\' +\n       \'New Taskwhat Is Nightwatch?\\n\' +\n       \'Delete\\n\' +\n       \'New Taskwhat Is Nightwatch?\'\n  }'
          ],
          [
            '2023-04-06T10:19:48.112Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/element  ',
            '{ using: \'css selector\', value: \'input[type=&quot;checkbox&quot;]\' }'
          ],
          [
            '2023-04-06T10:19:48.114Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/2bfecd6d-d71c-4946-97bd-5521f6a31055/element (2ms)',
            '{\n     value: {\n       \'element-6066-11e4-a52e-4f735466cecf\': \'9db02cb5-bb43-4ef1-b935-38a417240ee2\'\n     }\n  }'
          ],
          [
            '2023-04-06T10:19:48.117Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/9db02cb5-bb43-4ef1-b935-38a417240ee2/click  ',
            '{}'
          ],
          [
            '2023-04-06T10:19:48.327Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/element/9db02cb5-bb43-4ef1-b935-38a417240ee2/click (209ms)',
            '{ value: null }'
          ],
          [
            '2023-04-06T10:19:48.329Z',
            '  Request POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements  ',
            '{ using: \'css selector\', value: \'#todo-list ul li input:checked\' }'
          ],
          [
            '2023-04-06T10:19:48.331Z',
            '  Response 200 POST /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11/elements (2ms)',
            '{\n     value: [\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'a6373a47-f735-4162-bb2d-36b5aa4756a4\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'56a696cc-b2f5-4300-8428-0bcf93409417\'\n       },\n       {\n         \'element-6066-11e4-a52e-4f735466cecf\': \'9db02cb5-bb43-4ef1-b935-38a417240ee2\'\n       }\n     ]\n  }'
          ],
          [
            '2023-04-06T10:19:48.340Z',
            '  Request DELETE /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11  ',
            '\'\''
          ],
          [
            '2023-04-06T10:19:49.340Z',
            '  Response 200 DELETE /session/02cdc21b-3ae3-4f80-b595-07f8498c4a11 (1000ms)',
            '{ value: null }'
          ]
        ]
      }
    }
  },
  elapsedTime: '94.14',
  startTimestamp: 'Thu, 06 Apr 2023 10:18:28 GMT',
  endTimestamp: 'Thu, 06 Apr 2023 10:20:02 GMT',
  lastError: {
    name: 'NightwatchAssertError',
    message: 'Timed out while waiting for element <#search_form_input_homepage> to be present for 5000 milliseconds. - expected \u001b[0;32m"visible"\u001b[0m but got: \u001b[0;31m"not found"\u001b[0m \u001b[0;90m(5088ms)\u001b[0m',
    showDiff: false,
    abortOnFailure: true,
    waitFor: true,
    stack: 'Error\n    at DescribeInstance.<anonymous> (/Users/vaibhavsingh/Dev/nightwatch/examples/tests/duckDuckGo.js:8:8)\n    at Context.call (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/context.js:478:35)\n    at TestCase.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/testcase.js:58:31)\n    at Runnable.__runFn (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:80)\n    at Runnable.run (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/runnable.js:126:21)\n    at TestSuite.executeRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:912:49)\n    at TestSuite.handleRunnable (/Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:927:33)\n    at /Users/vaibhavsingh/Dev/nightwatch/lib/testsuite/index.js:759:21\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async DefaultRunner.runTestSuite (/Users/vaibhavsingh/Dev/nightwatch/lib/runner/test-runners/default.js:78:7)'
  }
};
