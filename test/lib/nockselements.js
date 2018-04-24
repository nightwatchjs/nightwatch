var nock = require('nock');

/**
 * More granular nocks definitions for element apis
 */
module.exports = {

  _requestUri: 'http://localhost:10195',
  _protocolUri: '/wd/hub/session/1352110219202/',

  elementFound(selector, using, foundElem) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element', {'using':using || 'css selector','value':selector || '#nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundElem || { ELEMENT: '0' }
      });
    return this;
  },

  elementsFound(selector, foundArray, using) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using':using || 'css selector','value':selector || '.nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray || [ { ELEMENT: '0' }, { ELEMENT: '1' }, { ELEMENT: '2' } ]
      });
    return this;
  },

  elementNotFound(selector) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element', {'using':'css selector','value':selector || '#nock-none'})
      .reply(200, {
        status: -1,
        value: {},
        errorStatus: 7,
        error: 'An element could not be located on the page using the given search parameters.'
      });
    return this;
  },

  elementsNotFound(selector) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using':'css selector','value':selector || '.nock-none'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: []
      });
    return this;
  },

  elementByXpath(selector, foundElem) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element', {'using':'xpath','value':selector || '//[@id="nock"]'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundElem || { ELEMENT: '0' }
      });
    return this;
  },

  elementsByXpath(selector = '//[@class="nock"]', foundArray = [{ELEMENT: '0'}, {ELEMENT: '1'}, {ELEMENT: '2'}]) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using':'xpath','value':selector})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray
      });
    return this;
  },

  elementId (id, selector, using, foundElem) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element/' + (id || 0) + '/element',
        {'using':using || 'css selector','value':selector || '#nock'})
      .reply(200, {
        status: 0,
        state : 'success',
        value: foundElem || { ELEMENT: '0' }
      });
    return this;
  },

  elementsId(id = 0, selector = '.nock', foundArray = [{ELEMENT: '0'}, {ELEMENT: '1'}, {ELEMENT: '2'}], using = 'css selector') {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element/' + id + '/elements', {
        using: using,
        value: selector
      })
      .reply(200, {
        status: 0,
        state : 'success',
        value: foundArray
      });

    return this;
  },

  elementIdNotFound (id, selector, using) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'element/' + (id || 0) + '/element',
        {'using':using || 'css selector','value':selector || '#nock'})
      .reply(200, {
        status: -1,
        value: {},
        errorStatus: 7,
        error: 'An element could not be located on the page using the given search parameters.'
      });

    return this;
  },

  elementsByTag(selector, foundArray) {
    nock(this._requestUri)
      .persist()
      .post(this._protocolUri + 'elements', {'using':'tag name','value':selector || 'nock'})
      .reply(200, {
        status: 0,
        state: 'success',
        value: foundArray || [ { ELEMENT: '0' }, { ELEMENT: '1' }, { ELEMENT: '2' } ]
      });
    return this;
  },

  text (id, value) {
    nock(this._requestUri)
      .persist()
      .get(this._protocolUri + 'element/' + (id || 0) + '/text')
      .reply(200, {
        status: 0,
        state : 'success',
        value: value || 'textValue'
      });
    return this;
  },

  cleanAll: function () {
    nock.cleanAll();
  }
};