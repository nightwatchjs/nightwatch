module.exports = {
  'default' : {
    myGlobal : function() {
      return 'I\'m a method';
    }
  },

  'test_env' : {
    myGlobal: 'test_global'
  },

  before : function(cb) {
    console.log('GLOBAL BEFORE');
    cb();
  },

  after : function(cb) {
    console.log('GLOBAL AFTER');
    cb();
  }
};
