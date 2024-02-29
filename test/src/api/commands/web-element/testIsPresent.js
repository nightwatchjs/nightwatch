const assert = require('assert');
const { WebElement } = require('selenium-webdriver');

const MockServer = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');
const common = require('../../../../common.js');
const Element = common.require('element/index.js');


describe('element().isPresent() command', function () {
    before(function (done) {
        CommandGlobals.beforeEach.call(this, done);
    });

    after(function (done) {
        CommandGlobals.afterEach.call(this, done);
    });

    it('test .element().isPresent() present', async function () {
        MockServer.addMock({
            url: '/session/13521-10219-202/element/0/present',
            method: 'GET',
            response: JSON.stringify({
                value: true
            })
        }, true);

        const resultPromise = this.client.api.element('#signupSection').isPresent();
        assert.strictEqual(resultPromise instanceof Element, false);
        assert.strictEqual(typeof resultPromise.find, 'undefined');

        assert.strictEqual(resultPromise instanceof Promise, false);
        assert.strictEqual(typeof resultPromise.then, 'function');

        const result = await resultPromise;
        assert.strictEqual(result instanceof WebElement, false);
        assert.strictEqual(result, true);

    });

    it('test .element().isPresent() not present', async function () {
        MockServer.addMock({
            url: '/session/13521-10219-202/element/0/present',
            method: 'GET',
            response: JSON.stringify({
                value: false
            })
        }, true);

        const resultPromise = this.client.api.element('#signupSection').isPresent();
        assert.strictEqual(resultPromise instanceof Element, false);
        assert.strictEqual(typeof resultPromise.find, 'undefined');

        assert.strictEqual(resultPromise instanceof Promise, false);
        assert.strictEqual(typeof resultPromise.then, 'function');

        const result = await resultPromise;
        assert.strictEqual(result instanceof WebElement, false);
        assert.strictEqual(result, false);
    });

    it('test .element().find().isPresent()', async function () {
        MockServer.addMock({
            url: '/session/13521-10219-202/element/1/present',
            method: 'GET',
            response: JSON.stringify({
                value: true
            })
        }, true);

        const resultPromise = this.client.api.element('#signupSection').find('#helpBtn').isPresent();
        assert.strictEqual(resultPromise instanceof Element, false);
        assert.strictEqual(typeof resultPromise.find, 'undefined');

        assert.strictEqual(resultPromise instanceof Promise, false);
        assert.strictEqual(typeof resultPromise.then, 'function');

        const result = await resultPromise;
        assert.strictEqual(result instanceof WebElement, false);
        assert.strictEqual(result, true);
    });

    it('test .element.find().isPresent() not present', async function () {
        MockServer.addMock({
            url: '/session/13521-10219-202/element/0/present',
            method: 'GET',
            response: JSON.stringify({
                value: false
            })
        }, true);

        const resultPromise = this.client.api.element.find('#signupSection').isPresent();
        assert.strictEqual(resultPromise instanceof Element, false);
        assert.strictEqual(typeof resultPromise.find, 'undefined');

        assert.strictEqual(resultPromise instanceof Promise, false);
        assert.strictEqual(typeof resultPromise.then, 'function');

        const result = await resultPromise;
        assert.strictEqual(result instanceof WebElement, false);
        assert.strictEqual(result, false);
    });

    it('test .element().isPresent() assert', async function () {
        MockServer.addMock({
            url: '/session/13521-10219-202/element/0/present',
            method: 'GET',
            response: JSON.stringify({
                value: true
            })
        }, true);

        const resultPromise = this.client.api.element('#signupSection').isPresent();
        assert.strictEqual(resultPromise instanceof Element, false);
        assert.strictEqual(typeof resultPromise.find, 'undefined');

        assert.strictEqual(resultPromise instanceof Promise, false);
        assert.strictEqual(typeof resultPromise.then, 'function');

        assert.strictEqual(await resultPromise.assert.equals(true), true);
        assert.strictEqual(await resultPromise.assert.not.equals(false), true);
    });

});
