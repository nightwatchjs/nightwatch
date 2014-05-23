module.exports = {
  'common' : {
	  commonGlobal : 'works on all environments'
  },

  'default' : {
    myGlobal : function() {
      return 'I\'m a method';
    }
  },

  'test_env' : {
    myGlobal: 'test_global'
  }
};
