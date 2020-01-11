const assertion = require('./assertion.js');
const AssertionRunner = require('./assertion-runner.js');
const AssertionError = require('./assertion-error.js');

module.exports = assertion;
module.exports.AssertionRunner = AssertionRunner;
module.exports.AssertionError = AssertionError;
