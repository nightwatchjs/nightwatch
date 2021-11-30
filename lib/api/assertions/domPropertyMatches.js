const {setElementSelectorProps} = require('../../utils');

exports.assertion = function (definition, domProperty, regexExpression, msg) {
  this.options = {
    elementSelector: true
  };

  this.expected = function() {
    return this.negate ? `does not matches '${regexExpression}'` : `matches '${regexExpression}'`;
  };


  this.formatMessage = function() {
    const message = msg || `Testing if dom property %s of element %s ${this.negate ? 'doesn\'t matches %s' : 'matches %s'}`;

    return {
      message,
      args: [`'${domProperty}'`, this.elementSelector, `'${regexExpression}'`]
    };
  };

  this.pass = function (value) { 
    const regex = new RegExp(regexExpression);

    if (!Array.isArray(value)) {
      return regex.test(value);
    } 

    return false;
  }; 

  this.value = function(result = {}) {
    return result.value || '';
  };

  this.command = function(callback) {
    this.api.getElementProperty(setElementSelectorProps(definition, {
      suppressNotFoundErrors: true
    }), domProperty, callback);
  };
};
