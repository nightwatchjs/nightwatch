module.exports = {
  'default' : {
    myGlobal : function() {
      return 'I\'m a method';
    }
  },

  'test_env' : {
    myGlobal: 'test_global',
    beforeEach : function() {

    }
  },

  before : function(cb) {
    cb();
  },

  beforeEach : function(browser, cb) {
    cb();
  },

  after : function(cb) {
    cb();
  },

  afterEach : function(browser, cb) {
    cb();
  },

  reporter : function(results, cb) {
    //console.log(results);
    cb();
  }
};
