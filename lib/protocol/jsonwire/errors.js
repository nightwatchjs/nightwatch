const SUCCESS = 'Success';
const TIMEOUT = 'Timeout';

const NO_SUCH_SESSION = 'NoSuchDriver';
const NO_SUCH_ELEMENT = 'NoSuchElement';
const NO_SUCH_FRAME = 'NoSuchFrame';
const NO_SUCH_WINDOW = 'NoSuchWindow';

const UNKNOWN_COMMAND = 'UnknownCommand';
const UNKNOWN_ERROR = 'UnknownError';
const JAVASCRIPT_ERROR = 'JavaScriptError';

const STALE_ELEMENT_REFERENCE = 'StaleElementReference';
const ELEMENT_NOT_VISIBLE = 'ElementNotVisible';
const INVALID_ELEMENT_STATE = 'InvalidElementState';
const ELEMENT_IS_NOT_SELECTABLE = 'ElementIsNotSelectable';
const INVALID_ELEMENT_COORDINATES = 'InvalidElementCoordinates';

const XPATH_LOOKUP_ERROR = 'XPathLookupError';
const INVALID_COOKIE_DOMAIN = 'InvalidCookieDomain';
const UNABLE_TO_SET_COOKIE = 'UnableToSetCookie';
const UNEXPECTED_ALERT_OPEN = 'UnexpectedAlertOpen';
const NO_ALERT_OPEN_ERROR = 'NoAlertOpenError';

const IME_NOT_AVAILABLE = 'IMENotAvailable';
const IME_ENGINE_ACTIVATION_FAILED = 'IMEEngineActivationFailed';

const INVALID_SELECTOR = 'InvalidSelector';
const SESSION_NOT_CREATED_EXCEPTION = 'SessionNotCreatedException';
const MOVE_TARGET_OUT_OF_BOUNDS = 'MoveTargetOutOfBounds';

const StatusCode = {
  SUCCESS : 0,
  NO_SUCH_SESSION: 6,
  NO_SUCH_ELEMENT: 7,
  NO_SUCH_FRAME: 8,
  UNKNOWN_COMMAND: 9,
  STALE_ELEMENT_REFERENCE: 10,
  ELEMENT_NOT_VISIBLE: 11,
  INVALID_ELEMENT_STATE: 12,
  UNKNOWN_ERROR: 13,
  ELEMENT_IS_NOT_SELECTABLE: 15,
  JAVASCRIPT_ERROR: 17,
  XPATH_LOOKUP_ERROR: 19,
  NO_SUCH_WINDOW: 23,
  INVALID_COOKIE_DOMAIN: 24,
  UNABLE_TO_SET_COOKIE: 25,
  UNEXPECTED_ALERT_OPEN: 26,
  NO_ALERT_OPEN_ERROR: 27,
  TIMEOUT: 28,
  INVALID_ELEMENT_COORDINATES: 29,
  IME_NOT_AVAILABLE: 30,
  IME_ENGINE_ACTIVATION_FAILED: 31,
  INVALID_SELECTOR: 32,
  SESSION_NOT_CREATED_EXCEPTION: 33,
  MOVE_TARGET_OUT_OF_BOUNDS: 34
};

const Errors = {
  [StatusCode.SUCCESS]: {
    id: SUCCESS,
    message: 'The command executed successfully.'
  },
  [StatusCode.NO_SUCH_SESSION]: {
    id: NO_SUCH_SESSION,
    message: 'The session is either terminated or not started.'
  },
  [StatusCode.NO_SUCH_ELEMENT]: {
    id: NO_SUCH_ELEMENT,
    message: 'An element could not be located on the page using the given search parameters.'
  },
  [StatusCode.NO_SUCH_FRAME]: {
    id: NO_SUCH_FRAME,
    message: 'The specified frame could not be found.'
  },
  [StatusCode.UNKNOWN_COMMAND]: {
    id: UNKNOWN_COMMAND,
    message: 'The requested resource could not be found, or a request was received using an HTTP method that is not supported by the mapped resource.'
  },
  [StatusCode.STALE_ELEMENT_REFERENCE]: {
    id: STALE_ELEMENT_REFERENCE,
    message: 'The command failed because the referenced element is no longer attached to the DOM.'
  },
  [StatusCode.ELEMENT_NOT_VISIBLE]: {
    id: ELEMENT_NOT_VISIBLE,
    message: 'An element command could not be completed because the element is not visible on the page.'
  },
  [StatusCode.INVALID_ELEMENT_STATE]: {
    id: INVALID_ELEMENT_STATE,
    message: 'An element command could not be completed because the element is in an invalid state (e.g. attempting to click an element that is no longer attached to the document).'
  },
  [StatusCode.UNKNOWN_ERROR]: {
    id: UNKNOWN_ERROR,
    message: 'An unknown server-side error occurred while processing the command.'
  },
  [StatusCode.ELEMENT_IS_NOT_SELECTABLE]: {
    id: ELEMENT_IS_NOT_SELECTABLE,
    message: 'The requested element cannot be selected.'
  },
  [StatusCode.JAVASCRIPT_ERROR]: {
    id: JAVASCRIPT_ERROR,
    message: 'An error occurred while executing user supplied JavaScript.'
  },
  [StatusCode.XPATH_LOOKUP_ERROR]: {
    id: XPATH_LOOKUP_ERROR,
    message: 'An error occurred while searching for an element by XPath.'
  },
  [StatusCode.NO_SUCH_WINDOW]: {
    id: NO_SUCH_WINDOW,
    message: 'The specified window could not be found.'
  },
  [StatusCode.INVALID_COOKIE_DOMAIN]: {
    id: INVALID_COOKIE_DOMAIN,
    message: 'The cookie domain name is not valid for the current page.'
  },
  [StatusCode.UNABLE_TO_SET_COOKIE]: {
    id: UNABLE_TO_SET_COOKIE,
    message: 'The request to set a cookie\'s value could not be satisfied.'
  },
  [StatusCode.UNEXPECTED_ALERT_OPEN]: {
    id: UNEXPECTED_ALERT_OPEN,
    message: 'A modal dialog was open, blocking this operation.'
  },
  [StatusCode.NO_ALERT_OPEN_ERROR]: {
    id: NO_ALERT_OPEN_ERROR,
    message: 'An attempt was made to operate on a modal dialog when one was not open.'
  },
  [StatusCode.TIMEOUT]: {
    id: TIMEOUT,
    message: 'The operation did not complete before its timeout expired.'
  },
  [StatusCode.INVALID_ELEMENT_COORDINATES]: {
    id: INVALID_ELEMENT_COORDINATES,
    message: 'The coordinates provided to an interactions operation are invalid.'
  },
  [StatusCode.IME_NOT_AVAILABLE]: {
    id: IME_NOT_AVAILABLE,
    message: 'IME was not available.'
  },
  [StatusCode.IME_ENGINE_ACTIVATION_FAILED]: {
    id: IME_ENGINE_ACTIVATION_FAILED,
    message: 'An IME engine could not be started.'
  },
  [StatusCode.INVALID_SELECTOR]: {
    id: INVALID_SELECTOR,
    message: 'The supplied argument was an invalid selector (e.g. XPath/CSS).'
  },
  [StatusCode.SESSION_NOT_CREATED_EXCEPTION]: {
    id: SESSION_NOT_CREATED_EXCEPTION,
    message: 'A new session could not be created.'
  },
  [StatusCode.MOVE_TARGET_OUT_OF_BOUNDS]: {
    id: MOVE_TARGET_OUT_OF_BOUNDS,
    message: 'The target for mouse interaction is not in the browser\'s viewport and cannot be brought into the viewport.'
  }
};

module.exports = {
  /**
   * Looks up error status info from an id string rather than id number.
   *
   * @param {string} errorId String id to look up an error with.
   */
  findErrorById(errorId) {
    errorId = String(errorId);
    for (let status in Errors) {
      if (status === errorId) {
        return {
          status: parseInt(status, 10),
          id: Errors[status].id,
          message: Errors[status].message
        };
      }
    }

    return null;
  },

  StatusCode: StatusCode,

  Status: {
    SUCCESS,
    TIMEOUT,

    NO_SUCH_ELEMENT,
    NO_SUCH_FRAME,
    NO_SUCH_WINDOW,

    UNKNOWN_COMMAND,
    UNKNOWN_ERROR,

    STALE_ELEMENT_REFERENCE,
    ELEMENT_NOT_VISIBLE,
    INVALID_ELEMENT_STATE,
    ELEMENT_IS_NOT_SELECTABLE,
    INVALID_ELEMENT_COORDINATES,

    XPATH_LOOKUP_ERROR,
    INVALID_COOKIE_DOMAIN,
    UNABLE_TO_SET_COOKIE,
    UNEXPECTED_ALERT_OPEN,
    NO_ALERT_OPEN_ERROR,

    IME_NOT_AVAILABLE,
    IME_ENGINE_ACTIVATION_FAILED,

    INVALID_SELECTOR,
    SESSION_NOT_CREATED_EXCEPTION,
    MOVE_TARGET_OUT_OF_BOUNDS
  },

  Response: Errors
};