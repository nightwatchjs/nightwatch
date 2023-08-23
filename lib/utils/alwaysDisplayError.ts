export = function(err: unknown): err is NodeJS.ErrnoException {
  return (err instanceof Error) && [
    'TypeError', 'SyntaxError', 'ReferenceError', 'RangeError'
  ].includes(err.name);
};
