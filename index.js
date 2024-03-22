module.exports = process.env.NIGHTWATCH_COV ?
  require('./lib-cov/index') :
  require('./lib/index');
