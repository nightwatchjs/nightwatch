const { Logger, relativeUrl, uriJoin } = require('../../utils');
const ProtocolAction = require('./_base-action.js');

/**
 * Fetch an URL with gettnig the response HTTP headers.
 *
 * @example
 * describe('Fetch command demo', function() {
 *   test('demoTest', async function(browser) {
 *     // fetch an url:
 *     const response = await browser.fetch('https://nightwatchjs.org', function(response) {
 *       const data = response.value.data;
 *       const heders = response.value.headers;
 *       const cookies = response.value.cookies;
 *     }
 *   });
 *
 *   test('demoTestAsync', async function(browser) {
 *     const response = await browser.fetch('https://nightwatchjs.org');
 *
 *     const data = response.data;
 *     const heders = response.headers;
 *     const cookies = response.cookies;
 *   });
 *
 * });
 *
 * @method fetch
 * @link /#nfetch
 * @syntax .fetch(url, [callback])
 * @param {string} url The url to navigate to
 * @param {Function} [callback]
 * @api protocol.navigation
 * @since 3.0.0
 */
module.exports = class Action extends ProtocolAction {

  async command(url, method = 'GET', body = '', callback = function (r) { return r }) {
    if (typeof url != 'string') {
      throw new Error('Missing url parameter.');
    }

    if (relativeUrl(url)) {
      if (!this.api.baseUrl) {
        throw new Error(`Invalid URL ${url}. When using relative uris, you must ` +
          'define a "baseUrl" or "launchUrl" in your nightwatch config.');
      }

      url = uriJoin(this.api.baseUrl, url);
    }

    await this.api
      .perform(async () => {
        cookies = await this.api.getCookies();
      })
      // Executing the fetch in a separate perform block, because executing
      // in the same block leads to instant returning the cookies array instead
      // of the actual response. Looks like a strange behavior of the
      // Nightwatch.
      .perform(async () => {
        response = await Action.fetchWithCookies(
          url,
          method,
          body,
          cookies,
        );
      })
      .perform(async () => {
        const promises = [];
        // We need to use the `for` loop here, because the `await` inside the
        // forEach loop doesn't work.
        // eslint-disable-next-line no-restricted-syntax
        for (const cookie of response.cookies) {
          if (cookie.maxAge === 0) {
            promises.push(this.api.deleteCookie(cookie.name));
          } else {
            promises.push(this.api.setCookie(cookie));
          }
        }
        await Promise.all(promises);
      });

    const result = {
      status: 0,
      value: response,
    };

    if (typeof callback === 'function') {
      const self = this;
      callback.call(self, result);
    }
    return result;
  }

  static parseSetCookie(cookieString) {
    // Split the cookie string by ';' to get the individual pieces
    const parts = cookieString.split(';').map((part) => part.trim());

    // The first part is always the key=value pair
    const [nameValue, ...attributes] = parts;

    const [name, ...valueParts] = nameValue.split('=');
    const value = valueParts.join('=');

    const cookieObject = {
      name,
      value,
    };

    // We need to use the for loop here, because the `await` inside the
    // forEach loop doesn't work.
    // eslint-disable-next-line no-restricted-syntax
    for (const attribute of attributes) {
      const [attrName, ...attrValueParts] = attribute.split('=');
      const attrValue = attrValueParts.join('=');

      // Normalize attribute names to camelCase for consistency
      const normalizedAttrName = attrName
        .replace(/-([a-z])/g, (match, p1) => p1.toUpperCase())
        .replace(/-/g, '')
        .replace(/^(.)/, (match, p1) => p1.toLowerCase());

      // Nightwatch expects the `expiry` to be a timestamp in seconds instead of
      // the `expires` name.
      if (attrName === 'expires') {
        cookieObject.expiry = Math.round(new Date(attrValue).getTime() / 1000);
        // If the attribute is a flag (like HttpOnly, Secure, etc.), just set it to true
      } else if (attrValue === '') {
        cookieObject[normalizedAttrName] = true;
      } else {
        cookieObject[normalizedAttrName] = attrValue.trim() || null;
      }
    }

    return cookieObject;
  }

  /**
   * Fetches a URL with cookies.
   *
   * @param {string} url
   *   The URL to fetch.
   * @param {string} [method='GET']
   *   The HTTP method to use.
   * @param {string} [requestBody='']
   *   The body of the request.
   * @param {Array} [cookiesObjects=[]]
   *   An array of cookie objects.
   *
   * @return {Promise<Object>}
   *   A promise that resolves to the response data.
   */
  static async fetchWithCookies(
    url,
    method = 'GET',
    requestBody = '',
    cookiesObjects = [],
  ) {
    // Convert the array of cookie objects to a single string for the Cookie header
    const cookieHeader = cookiesObjects
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');
    const options = {
      method,
      headers: {
        Cookie: cookieHeader,
      },
    };
    if (method !== 'GET' && method !== 'HEAD') {
      options.body = requestBody;
    }
    const response = await fetch(url, options);
    const body = await response.text();
    const headers = {};
    response.headers.forEach((value, name) => {
      // Actually, Node.js function fetch() support multiple values only for
      // `set-cookie`,for other multiple headers overwrites the previous
      // value.
      if (name === 'set-cookie') {
        if (!headers[name]) {
          headers[name] = [];
        }
        headers[name].push(value);
      } else {
        headers[name] = value;
      }
    });

    const cookies = [];
    if (headers['set-cookie']) {
      // We need to use the for loop here, because the `await` inside the
      // forEach loop doesn't work.
      // eslint-disable-next-line no-restricted-syntax
      for (const cookieString of headers['set-cookie']) {
        cookies.push(Action.parseSetCookie(cookieString));
      }
    }

    const responseData = {
      body,
      status: response.status,
      statusText: response.statusText,
      headers,
      cookies,
      config: {
        url,
        method,
        headers: options.headers,
      },
    };
    return responseData;
  }
};
