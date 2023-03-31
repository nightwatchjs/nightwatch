module.exports.command = function(role, options) {
  // eslint-disable-next-line no-async-promise-executor
  return this.createScopedElement(new Promise(async (resolve, reject) => {
    try {
      const elements = await this.findAllByRole(role, options);
      const element = elements[0];

      if (!element) {
        throw new Error(`The element with "${role}" role is not found.`);
      }

      resolve(element);
    } catch (error) {
      reject(error);
    }
  }), this);
};
