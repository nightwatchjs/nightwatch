const reserved = [
  'constructor',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString'
];

const isObjectPrototype = (item) => {
  return item.constructor.name === 'Object' && Object.getPrototypeOf(item) === null;
};

module.exports = function(instance, additionalReserved = []) {
  const result = new Set();

  while (instance && !isObjectPrototype(instance)) {
    Object.getOwnPropertyNames(instance).forEach(p => {
      if ((typeof instance[p] == 'function') && !reserved.includes(p) && !additionalReserved.includes(p)) {
        result.add(p);
      }
    });
    instance = Object.getPrototypeOf(instance);
  }

  return [...result];
};
