module.exports = {
  namespacedAliases: ['document.customExecute'],

  command: function(data, callback = function() {}) {
    this.execute(function(data) {return data}, [data], callback);
  }
};
