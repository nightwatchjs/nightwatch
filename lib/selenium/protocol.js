var Actions = {};  
Actions.element = function(using, value, callback) {
  var check = /class name|css selector|id|name|link text|partial link text|tag name|xpath/gi;
  if (!check.test(using)) {
    throw new Error("Please provide any of the following using strings as the first parameter: " + 
        "class name, css selector, id, name, link text, partial link text, tag name or xpath");
  }

  return postRequest.call(this, "/element", {
    "using": using, 
    "value": value
  }, callback);
};

Actions.elementActive = function(callback) {
  return postRequest.call(this, "/element/active", {}, callback);
};
  
Actions.elementIdAttribute = function(id, attributeName, callback) {
  return getRequest.call(this, 
    "/element/" + id + "/attribute/" + attributeName, callback);
};
    
Actions.elementIdClick = function(id, callback) {
  return postRequest.call(this, "/element/" + id + "/click", '', callback);
};

function buttonHandler(that, direction, id, button, callback) {
    var bi;
    if (typeof button == 'function') {
        callback = button;
        button = 0;
    }
    if (typeof button == 'string') {
        bi = ['left', 'middle', 'right'].indexOf(button.toLowerCase());
        if (bi !== -1) {
            button = bi;
        }
    }
    return postRequest.call(that, '/button' + direction, {button: button}, callback);
};

Actions.buttonDown = function(id, button, callback) {
    return buttonHandler(this, 'down', id, button, callback);
};

Actions.buttonUp = function(id, button, callback) {
    return buttonHandler(this, 'up', id, button, callback);
};

/**
 * http://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/css/:propertyName
 * 
 * Query the value of an element's computed CSS property. The CSS property to query should be specified using 
 * the CSS property name, not the JavaScript property name (e.g. background-color instead of backgroundColor).
 * 
 * @param {String} id - ID of the element to route the command to (ID is a WebElement JSON object)
 * @param {String} cssProperyName
 * @param {Function} callback
 */    
Actions.elementIdCssProperty = function(id, cssProperyName, callback) {
  return getRequest.call(this, 
    "/element/" + id + "/css/" + cssProperyName, 
    callback);
};

/**
 * @param {String} id - ID of the element to route the command to (ID is a WebElement JSON object)
 * @param {Function} callback
 */
Actions.elementIdDisplayed = function(id, callback) {
  return getRequest.call(this, 
    "/element/" + id + "/displayed", 
    callback);
};

/**
 * @param {String} id - ID of the element to route the command to (ID is a WebElement JSON object)
 * @param {Function} callback
 */
Actions.elementIdLocationInView = function(id, callback) {
  return getRequest.call(this, 
    "/element/" + id + "/location_in_view", 
    callback);
};

/**
 * Determine an element's location on the page. The point (0, 0) refers to the upper-left corner of the page. 
 * The element's coordinates are returned as a JSON object with x and y properties.
 * 
 * Returns {x:number, y:number} The X and Y coordinates for the element on the page.
 * 
 * @param {String} id - ID of the element to route the command to (ID is a WebElement JSON object)
 * @param {Function} callback 
 */
Actions.elementIdLocation = function(id, callback) {
  return getRequest.call(this, "/element/" + id + "/location", callback);
};


/**
 * @param {String} id - ID of the element to route the command to (ID is a WebElement JSON object)
 * @param {Function} callback
 */
Actions.elementIdName = function(id, callback) {
  return getRequest.call(this, 
    "/element/" + id + "/name", callback);
};

/**
 * @param {String} id - ID of the element to route the command to (ID is a WebElement JSON object)
 * @param {Function} callback
 */
Actions.elementIdClear = function(id, callback) {
  return postRequest.call(this, "/element/" + id + "/clear", callback);
};

Actions.elementIdSelected = function(id, callback) {
  return getRequest.call(this, "/element/" + id + "/selected", callback);
};

Actions.elementIdEnabled = function(id, callback) {
  return getRequest.call(this, "/element/" + id + "/enabled", callback);
};

Actions.elementIdEquals = function(id1, id2, callback) {
  return getRequest.call(this, "/element/" + id1 + "/equals/" + id2, callback);
};

Actions.elementIdSize = function(id, callback) {
  return getRequest.call(this, 
    "/element/" + id + "/size", 
    callback);
};

Actions.elementIdText = function(id, callback) {
  return getRequest.call(this, 
    "/element/" + id + "/text", 
    callback);
};

Actions.elementIdValue = function(id, value, callback) {
  if (arguments.length === 2) {
    callback = value;
    return getRequest.call(this, 
      "/element/" + id + "/value", 
      callback);  
  }
  
  value = String(value);
  return postRequest.call(this, "/element/" + id + "/value", {
    "value": value.split("")
  }, callback);
};

/**
 * Search for an element on the page, starting from the document root. The located element will be 
 * returned as a WebElement JSON object. 
 * The table below lists the locator strategies that each server should support. Each locator must 
 * return the first matching element located in the DOM.
 * 
 * class name         Returns an element whose class name contains the search value; compound class names are not permitted.
 * css selector       Returns an element matching a CSS selector.
 * id                 Returns an element whose ID attribute matches the search value.
 * name               Returns an element whose NAME attribute matches the search value.
 * link text          Returns an anchor element whose visible text matches the search value.
 * partial link text  Returns an anchor element whose visible text partially matches the search value.
 * tag name           Returns an element whose tag name matches the search value.
 * xpath              Returns an element matching an XPath expression.
 * 
 * @param {Object} using
 * @param {Object} value
 * @param {Object} callback
 */
Actions.elements = function(using, value, callback) {
  var check = /class name|css selector|id|name|link text|partial link text|tag name|xpath/gi;
  if (!check.test(using)) {
    throw new Error("Please provide any of the following using strings as the first parameter: " + 
        "class name, css selector, id, name, link text, partial link text, tag name or xpath");
  }

  return postRequest.call(this, "/elements", {
    "using": using, 
    "value": value
  }, callback);
};

/**
 * Inject a snippet of JavaScript into the page for execution in the context of the currently selected 
 * frame. The executed script is assumed to be synchronous and the result of evaluating the script is 
 * returned to the client.
 * 
 * The script argument defines the script to execute in the form of a function body. The value 
 * returned by that function will be returned to the client. The function will be invoked with the 
 * provided args array and the values may be accessed via the arguments object in the order specified.
 * 
 * Arguments may be any JSON-primitive, array, or JSON object. JSON objects that define a WebElement 
 * reference will be converted to the corresponding DOM element. Likewise, any WebElements in the 
 * script result will be returned to the client as WebElement JSON objects.
 * 
 * Potential Errors:
 *  - NoSuchWindow - If the currently selected window has been closed.
 *  - StaleElementReference - If one of the script arguments is a WebElement that is not attached to the page's DOM.
 *  - JavaScriptError - If the script throws an Error.
 * 
 * @param {String} string
 * @param {Array} args
 * @param {Function} callback 
 */
Actions.execute = function(script, args, callback) {
  if (typeof script == 'function') {
    var fn = 'var passedArgs = Array.prototype.slice.call(arguments,0); return ' + script.toString() + '.apply(window, passedArgs);';
  } else {
    fn = script;
  }
  
  if (arguments.length == 2 && typeof arguments[1] == 'function') {
    callback = arguments[1];
    args = [];
  }
  
  return postRequest.call(this, "/execute", {
    "script": fn, 
    "args": args
  }, callback);
}

/**
 * Change focus to another frame on the page. If the frame id is null, the server 
 * should switch to the page's default content.
 * 
 * @param {String} frameId
 * @param {Function} callback
 */
Actions.frame = function(frameId, callback) {
  if (arguments.length == 1 && typeof frameId == "function") {
    callback = frameId;
    return postRequest.call(this, "/frame", callback);  
  }
  
  return postRequest.call(this, "/frame", {
    "frameId": frameId
  }, callback);
};

/**
 * Move the mouse by an offset of the specificed element. If no element is specified, the move is relative 
 * to the current mouse cursor. If an element is provided but no offset, the mouse will be moved to the 
 * center of the element. If the element is not visible, it will be scrolled into view.
 * 
 * @param {String} element - Opaque ID assigned to the element to move to. If not specified or is null, 
 *  the offset is relative to current position of the mouse.
 * @param {Number} xoffset - X offset to move to, relative to the top-left corner of the element. 
 *  If not specified, the mouse will move to the middle of the element.
 * @param {String} yoffset - Y offset to move to, relative to the top-left corner of the element. 
 * If not specified, the mouse will move to the middle of the element.
 * @param {Function} callback
 */
Actions.moveTo = function(element, xoffset, yoffset, callback) {
  var data = {}
  if (typeof element == 'string') {
    data.element = element;
  }
  if (typeof xoffset == 'number') {
    data.xoffset = xoffset;
  }
  if (typeof yoffset == 'number') {
    data.yoffset = yoffset;
  }
  return postRequest.call(this, 
      "/moveto", data, callback);
};

Actions.submit = function(id, callback) {
  return postRequest.call(this, 
      "/element/" + id + "/submit", "", callback);
};
  
Actions.screenshot = function(callback) {
  return getRequest.call(this, "/screenshot", callback);
};

/**
 * @see http://code.google.com/p/selenium/wiki/JsonWireProtocol#/status
 */
Actions.status = function(callback) {
  return getRequest.call(this, "/status", callback);  
};

Actions.title = function(callback) {
  return getRequest.call(this, "/title", callback);  
};

Actions.window_handle = function(callback) {
  return getRequest.call(this, "/window_handle", callback);
};

Actions.window_handles = function(callback) {
  return getRequest.call(this, "/window_handles", callback);
};


/**
 * GET /session/:sessionId/url - Retrieve the URL of the current page.
 * POST /session/:sessionId/url - Navigate to a new URL.
 * 
 * Potential Errors:
 *  NoSuchWindow - If the currently selected window has been closed.
 * 
 * @param {String} url
 * @param {Function} callback
 */
Actions.url = function(url, callback) {
  if (typeof url == "string") {
    return postRequest.call(this, "/url", {
      url : url
    }, callback);
  } 
  
  if (typeof url == "function") {
    callback = url;
  }
  
  return getRequest.call(this, "/url", callback);
};

Actions.session  = function(action, callback) {
  var options = {
    path : "/session"
  };
  
  if (typeof action == "function") {
    callback = action;
    action = "get";
  }
  
  switch (action) {
    case "delete":
      options.path += '/' + this.sessionId;
      options.method = "DELETE";
      break;
    default:
      options.method = "GET";  
  } 
  
  return this.runProtocolCommand(options, callback).send();  
};

function getRequest(path, callback) {
  var options = {
    path : "/session/" + this.sessionId + path,
    method : "GET"  
  }
  callback = callback || function() {};
  
  return this.runProtocolCommand(options, callback).send();
}

function postRequest(path, data, callback) {
  if (arguments.length == 2 && typeof data == "function") {
    callback = data;
    data = "";
  }
  
  var options = {
    path : "/session/" + this.sessionId + path,
    method : "POST",
    data : data || ""  
  }
  callback = callback || function() {};
  return this.runProtocolCommand(options, callback).send();
}

module.exports.actions = Actions;
