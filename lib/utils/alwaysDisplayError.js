module.exports = function(err) {
  return (err instanceof Error) && [
    'TypeError', 'SyntaxError', 'ReferenceError', 'RangeError'
  ].includes(err.name);
};
