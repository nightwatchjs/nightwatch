export = function(err: any) {
  return (err instanceof Error) && [
    'TypeError', 'SyntaxError', 'ReferenceError', 'RangeError'
  ].includes(err.name);
};
