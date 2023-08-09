export = function(err: unknown) {
  return (err instanceof Error) && [
    'TypeError', 'SyntaxError', 'ReferenceError', 'RangeError'
  ].includes(err.name);
};
