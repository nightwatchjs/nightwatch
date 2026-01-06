const defaultExport = {
  defaultValue: 'default-value',
  defaultFunction: function() {
    return 'default function called';
  }
};

export default defaultExport;
export const namedExport = 'named value';
export const namedFunction = function() {
  return 'named function called';
};