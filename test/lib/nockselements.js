const nock = require('nock');

/**
 * More granular nocks definitions for element apis
 */
module.exports = {
  _currentNocks: [],
  _requestUri: 'http://localhost:10195',
  _protocolUri: '/wd/hub/session/1352110219202/',

  _addNock(...args) {
    let item = nock(...args);

    this._currentNocks.push(item);

    return item;
  },

  createSession() {
    nock('http://localhost:10195')
      .post('/wd/hub/session')
      .reply(201, {
        status: 0,
        sessionId: '1352110219202',
        value: {
          browserName: 'firefox',
          version: 'TEST',
          platform: 'TEST'
        }
      });

    return this;
  },

  checkIfMocksDone() {
    try {
      this._currentNocks.forEach(nock => nock.done());
    } catch (err) {
      return err;
    }
  },

  elementFound(selector = '#nock', using = 'css selector', foundElem = {ELEMENT: '0'}) {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element', {using: using, value: selector})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundElem
      });

    return this;
  },

  elementsFound(selector, foundArray, using) {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using': using || 'css selector', 'value': selector || '.nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray || [{ELEMENT: '0'}, {ELEMENT: '1'}, {ELEMENT: '2'}]
      });

    return this;
  },

  elementNotFound(selector = '#nock-none') {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element',
        {
          using: 'css selector',
          value: selector
        })
      .reply(200, {
        status: -1,
        value: {},
        errorStatus: 7,
        error: 'An element could not be located on the page using the given search parameters.'
      });

    return this;
  },

  elementsNotFound(selector) {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using': 'css selector', 'value': selector || '.nock-none'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });

    return this;
  },

  elementByXpath(selector, foundElem) {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element', {'using': 'xpath', 'value': selector || '//[@id="nock"]'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundElem || {ELEMENT: '0'}
      });

    return this;
  },

  elementsByXpath(selector = '//[@class="nock"]', foundArray = [{ELEMENT: '0'}, {ELEMENT: '1'}, {ELEMENT: '2'}]) {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using': 'xpath', 'value': selector})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray
      });

    return this;
  },

  elementsByXpathError(selector = '.nock') {
    this._addNock(this._requestUri)
      .post(this._protocolUri + 'elements', {using: 'xpath', value: selector})
      .reply(500, {
        status: 19,
        state: 'XPathLookupError',
        value: null
      });

    return this;
  },

  elementId (id, selector, using, foundElem) {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element/' + (id || 0) + '/element',
        {'using': using || 'css selector', 'value': selector || '#nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundElem || {ELEMENT: '0'}
      });

    return this;
  },

  elementsId(id = 0, selector = '.nock', foundArray = [{ELEMENT: '0'}, {ELEMENT: '1'}, {ELEMENT: '2'}], using = 'css selector') {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element/' + id + '/elements', {
        using: using,
        value: selector
      })
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray
      });

    return this;
  },

  elementIdNotFound (id, selector, using) {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element/' + (id || 0) + '/element',
        {'using': using || 'css selector', 'value': selector || '#nock'})
      .reply(200, {
        status: -1,
        value: {},
        errorStatus: 7,
        error: 'An element could not be located on the page using the given search parameters.'
      });

    return this;
  },

  elementsByTag(selector, foundArray) {
    this._addNock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using': 'css selector', 'value': selector || 'nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray || [{ELEMENT: '0'}, {ELEMENT: '1'}, {ELEMENT: '2'}]
      });

    return this;
  },

  text(id, value) {
    this._addNock(this._requestUri)
      .persist()
      .get(this._protocolUri + 'element/' + (id || 0) + '/text')
      .reply(200, {
        status: 0,
        state: 'success',
        value: value || 'textValue'
      });

    return this;
  },

  clearValue(id, persist = false) {
    const mock = this._addNock(this._requestUri);
    if (persist) {
      mock.persist();
    }

    mock
      .post(this._protocolUri + 'element/' + (id || 0) + '/clear')
      .reply(200, {
        status: 0,
        state: 'success',
        value: null
      });

    return this;
  },

  cleanAll () {
    nock.cleanAll();
    this._currentNocks = [];

    return this;
  },

  disabled: false,
  disable() {
    this.disabled = true;
    nock.restore();

    return this;
  },

  enable(force = false) {
    if (this.disabled || force) {
      try {
        nock.activate();
      } catch (err) {}
    }

    return this;
  }
};
