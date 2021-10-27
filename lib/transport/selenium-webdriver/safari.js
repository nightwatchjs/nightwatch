const {WebDriver} = require('selenium-webdriver');
const {Executor, HttpClient} = require('selenium-webdriver/http');
const SeleniumWebdriver = require('./');

module.exports = class SafariDriverTransport extends SeleniumWebdriver {
  get ServiceBuilder() {
    return require('./service-builders/safari.js');
  }

  get defaultServerUrl() {
    return 'http://127.0.0.1:4444/';
  }

  createDriver({options}) {
    let service;
    let serverUrl;

    if (this.driverService) {
      service = this.driverService.service.build();
    }

    serverUrl = this.getServerUrl();

    return SafariDriver.createSession(options, service, serverUrl);
  }
};

// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// Built-in SafariDriver class doesn't support passing the service object
class SafariDriver extends WebDriver {
  static createSession(options, service, serverUrl) {
    let client;

    if (service) {
      client = service.start().then(url => new HttpClient(url));
    } else {
      client = Promise.resolve(new HttpClient(serverUrl));
    }

    const executor = new Executor(client);

    return super.createSession(executor, options, () => {
      if (service) {
        service.kill();
      }
    });
  }

  /**
   * This function is a no-op as file detectors are not supported by this
   * implementation.
   * @override
   */
  setFileDetector() {}
}



