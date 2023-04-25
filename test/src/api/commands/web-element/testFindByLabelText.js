const assert = require('assert');
const {WebElement} = require('selenium-webdriver');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const Element = require('../../../../../lib/element/index.js');

describe('.findByLabelText() commands', function () {
  beforeEach(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  afterEach(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .findByLabelText() (findByForId)', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/label[text()="Email"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '1'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/execute/sync',
        method: 'POST',
        response: JSON.stringify({
          value: 'email'
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/elements',
        postdata: {
          using: 'css selector',
          value: 'input[id="email"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '2'}]
        })
      }, true);

    const resultPromise = this.client.api.element('#signupSection').findByLabelText('Email');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');
    const id = await resultPromise.getId();
    assert.strictEqual(id, '2');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '2');
  });

  it('test .getByLabelText(exact=false) (findByForId)', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/label[contains(text(),"Email")]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '1'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/execute/sync',
        method: 'POST',
        response: JSON.stringify({
          value: 'email'
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/elements',
        postdata: {
          using: 'css selector',
          value: 'input[id="email"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '2'}]
        })
      }, true);

    const resultPromise = this.client.api.element('#signupSection').getByLabelText('Email', {exact: false});
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');
    assert.strictEqual(await resultPromise.getId(), '2');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '2');
  });

  it('test .findByLabelText() (findByAriaLabelled)', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/label[text()="Email"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '1'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/execute/sync',
        method: 'POST',
        response: JSON.stringify({
          value: null
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/execute/sync',
        method: 'POST',
        response: JSON.stringify({
          value: 'email-label'
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/elements',
        postdata: {
          using: 'css selector',
          value: 'input[aria-labelledby="email-label"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '2'}]
        })
      }, true);

    const resultPromise = this.client.api.element('#signupSection').findByLabelText('Email');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');
    assert.strictEqual(await resultPromise.getId(), '2');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '2');
  });
  
  it('test .findByLabelText() (findByDirectNesting)', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/label[text()="Email"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '1'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/execute/sync',
        method: 'POST',
        response: JSON.stringify({
          value: null
        })
      }, true, true)
      .addMock({
        url: '/session/13521-10219-202/element/1/element',
        postdata: {
          using: 'css selector',
          value: 'input'
        },
        method: 'POST',
        response: JSON.stringify({
          value: {'element-6066-11e4-a52e-4f735466cecf': '2'}
        })
      }, true);

    const resultPromise = this.client.api.element('#signupSection').findByLabelText('Email');
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');
    assert.strictEqual(await resultPromise.getId(), '2');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '2');
  });

  it('test .findByLabelText() (findByDeepNesting)', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/label[text()="Email"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: []
        }),
        times: 3
      })
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/label[*[text()="Email"]]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '1'}]
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/element/1/element',
        postdata: {
          using: 'css selector',
          value: 'input'
        },
        method: 'POST',
        response: JSON.stringify({
          value: {'element-6066-11e4-a52e-4f735466cecf': '2'}
        })
      }, true);

    const resultPromise = this.client.api.element('#signupSection').findByLabelText('Email', {
      timeout: 200,
      retryInterval: 100
    });

    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');

    const id = await resultPromise.getId();
    assert.strictEqual(id, '2');
    //
    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '2');
  });

  it('test .findByLabelText() (aria-label)', async function() {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/label[text()="Email"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: []
        }),
        times: 3
      })
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'xpath',
          value: './/label[*[text()="Email"]]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: []
        }),
        times: 3
      })
      .addMock({
        url: '/session/13521-10219-202/element/0/elements',
        postdata: {
          using: 'css selector',
          value: 'input[aria-label="Email"]'
        },
        method: 'POST',
        response: JSON.stringify({
          value: [{'element-6066-11e4-a52e-4f735466cecf': '2'}]
        })
      }, true);

    const resultPromise = this.client.api.element('#signupSection').findByLabelText('Email', {
      timeout: 200,
      retryInterval: 100
    });
    assert.strictEqual(resultPromise instanceof Element, false);
    assert.strictEqual(resultPromise instanceof Promise, true);
    assert.strictEqual(typeof resultPromise.find, 'function');
    assert.strictEqual(typeof resultPromise.getValue, 'function');
    assert.strictEqual(typeof resultPromise.assert, 'object');
    assert.strictEqual(await resultPromise.getId(), '2');

    const result = await resultPromise;
    assert.strictEqual(result instanceof WebElement, true);
    assert.strictEqual(await result.getId(), '2');
  });
});
