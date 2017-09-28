const ContentTypes = {
  JSON : 'application/json',
  JSON_WITH_CHARSET : 'application/json; charset=utf-8'
};

const Headers = {
  ACCEPT : 'accept',
  CONTENT_TYPE : 'content-type',
  CONTENT_LENGTH : 'content-length',
  AUTHORIZATION : 'authorization'
};

module.exports = {
  isRedirect(statusCode) {
    return [302, 303, 304].indexOf(statusCode) > -1;
  },

  needsContentLengthHeader(requestMethod) {
    return ['POST', 'PUT', 'DELETE'].indexOf(requestMethod) > -1;
  },

  Headers: Headers,
  ContentTypes: ContentTypes

};