module.exports = {
  'default' : {
    myGlobal : function() {
      return 'I\'m a method';
    }
  },

  'test_env' : {
    myGlobal: 'test_global',
    beforeEach : function() {
      console.log('ANOTHER BEFORE EACH');
    }
  },

  before : function(cb) {
    console.log('GLOBAL BEFORE');
    cb();
  },

  beforeEach : function(cb) {
    console.log('GLOBAL BEFORE EACH');
    cb();
  },

  after : function(cb) {
    console.log('GLOBAL AFTER');
    cb();
  },

  afterEach : function(cb) {
    console.log('GLOBAL AFTER EACH');
    cb();
  },

  reporter : function(results, cb) {
    //console.log(results);
    cb();
  }
};
