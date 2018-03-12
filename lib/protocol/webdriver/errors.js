const ErrorCode = {
  INSECURE_CERTIFICATE: 'insecure certificate',
  ELEMENT_CLICK_INTERCEPTED: 'element click intercepted',
  ELEMENT_IS_NOT_SELECTABLE: 'element not selectable',
  ELEMENT_IS_NOT_INTERACTABLE: 'element not interactable',
  INVALID_ARGUMENT: 'invalid argument',
  INVALID_COOKIE_DOMAIN: 'invalid cookie domain',
  INVALID_ELEMENT_COORDINATES: 'invalid coordinates',
  INVALID_ELEMENT_STATE: 'invalid element state',
  INVALID_SELECTOR: 'invalid selector',
  NO_SUCH_SESSION: 'invalid session id',
  JAVASCRIPT_ERROR: 'javascript error',
  MOVE_TARGET_OUT_OF_BOUNDS: 'move target out of bounds',
  NO_SUCH_ALERT: 'no such alert',
  NO_SUCH_COOKIE: 'no such cookie',
  NO_SUCH_ELEMENT: 'no such element',
  NO_SUCH_FRAME: 'no such frame',
  NO_SUCH_WINDOW: 'no such window',
  SCRIPT_TIMEOUT: 'script timeout',
  SESSION_NOT_CREATED_EXCEPTION: 'session not created',
  STALE_ELEMENT_REFERENCE: 'stale element reference',
  TIMEOUT: 'timeout',
  UNABLE_TO_SET_COOKIE: 'unable to set cookie',
  UNABLE_TO_CAPTURE_SCREEN: 'unable to capture screen',
  UNEXPECTED_ALERT_OPEN: 'unexpected alert open',
  UNKNOWN_COMMAND: 'unknown command',
  UNKNOWN_ERROR: 'unknown error',
  UNKNOWN_METHOD: 'unknown method',
  UNSUPPORTED_OPERATION: 'unsupported operation'
};

const Errors = {
  [ErrorCode.UNEXPECTED_ALERT_OPEN]: {
    message: 'A modal dialog was open, blocking this operation.'
  },
  [ErrorCode.SESSION_NOT_CREATED_EXCEPTION]: {
    message: 'A new session could not be created.'
  },
  [ErrorCode.NO_SUCH_ALERT]: {
    message: 'An attempt was made to operate on a modal dialog when one was not open.'
  },
  [ErrorCode.INVALID_ELEMENT_STATE]: {
    message: 'An element command could not be completed because the element is in an invalid state (e.g. attempting to click an element that is no longer attached to the document).'
  },
  [ErrorCode.NO_SUCH_ELEMENT]: {
    message: 'An element could not be located on the page using the given search parameters.'
  },
  [ErrorCode.JAVASCRIPT_ERROR]: {
    message: 'An error occurred while executing user supplied JavaScript.'
  },
  [ErrorCode.UNKNOWN_ERROR]: {
    message: 'An unknown server-side error occurred while processing the command.'
  },
  [ErrorCode.NO_SUCH_COOKIE]: {
    message: 'No cookie matching the given path name was found amongst the cookies of the current active document.'
  },
  [ErrorCode.INSECURE_CERTIFICATE]: {
    message: 'The SSL certificate running on this host cannot be validated. ' +
    'If you wish to force accepting insecure SSL certificates, set acceptInsecureCerts=true in the ' +
    'desiredCapabilities options.'
  },
  [ErrorCode.INVALID_ARGUMENT]: {
    message: 'The arguments passed to the command are either invalid or malformed.'
  },
  [ErrorCode.INVALID_ARGUMENT]: {
    message: 'The arguments passed to the command are either invalid or malformed.'
  },
  [ErrorCode.STALE_ELEMENT_REFERENCE]: {
    message: 'The command failed because the referenced element is no longer attached to the DOM.'
  },
  [ErrorCode.INVALID_COOKIE_DOMAIN]: {
    message: 'The cookie domain name is not valid for the current page.'
  },
  [ErrorCode.INVALID_ELEMENT_COORDINATES]: {
    message: 'The coordinates provided to an interactions operation are invalid.'
  },
  [ErrorCode.ELEMENT_CLICK_INTERCEPTED]: {
    message: 'The element click command could not be completed because another element is receiving the click event.'
  },
  [ErrorCode.TIMEOUT]: {
    message: 'The operation did not complete before its timeout expired.'
  },
  [ErrorCode.UNABLE_TO_SET_COOKIE]: {
    message: 'The request to set a cookie\'s value could not be satisfied.'
  },
  [ErrorCode.UNKNOWN_METHOD]: {
    message: 'The requested command matched a known URL but did not match a method for that URL.'
  },
  [ErrorCode.ELEMENT_IS_NOT_SELECTABLE]: {
    message: 'The requested element cannot be selected.'
  },
  [ErrorCode.ELEMENT_IS_NOT_INTERACTABLE]: {
    message: 'The requested element is not pointer or keyboard interactable.'
  },
  [ErrorCode.UNKNOWN_COMMAND]: {
    message: 'The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource.'
  },
  [ErrorCode.UNABLE_TO_CAPTURE_SCREEN]: {
    message: 'The screen capture failed.'
  },
  [ErrorCode.SCRIPT_TIMEOUT]: {
    message: 'The script did not complete before its timeout expired.'
  },
  [ErrorCode.NO_SUCH_SESSION]: {
    message: 'The session is either terminated or not started.'
  },
  [ErrorCode.NO_SUCH_FRAME]: {
    message: 'The specified frame could not be found.'
  },
  [ErrorCode.NO_SUCH_WINDOW]: {
    message: 'The specified window could not be found.'
  },
  [ErrorCode.INVALID_SELECTOR]: {
    message: 'The supplied argument was an invalid selector (e.g. XPath/CSS).'
  },
  [ErrorCode.MOVE_TARGET_OUT_OF_BOUNDS]: {
    message: 'The target for mouse interaction is not in the browser\'s viewport and cannot be brought into the viewport.'
  },
  [ErrorCode.UNSUPPORTED_OPERATION]: {
    message: 'Unsupported operation exception.'
  }
};

module.exports = {
  findErrorById(statusCode) {
    return {
      status: statusCode,
      id: statusCode,
      message: Errors[statusCode].message
    };
  },

  StatusCode: ErrorCode,
  Response: Errors
};