module.exports.command = function(...args) {
  const keys = args.reduce((prev, key) => {
    const keyList = Array.isArray(key) ? key : [key];
    prev.push(...keyList);

    return prev;
  }, []);

  return this.runQueuedCommand('setElementValue', {
    args: [keys]
  });
};
