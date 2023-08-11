import {Class} from 'type-fest';

const reserved = [
  'constructor',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString'
];

const genericClassInstance = new (class {});
type GenericClassInstance = typeof genericClassInstance;

const isObjectPrototype = (item: GenericClassInstance) => {
  return item.constructor.name === 'Object' && Object.getPrototypeOf(item) === null;
};

export = function<T extends Class<GenericClassInstance>>(
  instance: InstanceType<T>,
  additionalReserved: string[] = []
): string[] {
  const result: Set<string> = new Set();

  type P = keyof typeof instance;

  while (instance && !isObjectPrototype(instance)) {
    Object.getOwnPropertyNames(instance).forEach(p => {
      if ((typeof instance[p as P] == 'function') && !reserved.includes(p) && !additionalReserved.includes(p)) {
        result.add(p);
      }
    });
    instance = Object.getPrototypeOf(instance);
  }

  return [...result];
};
