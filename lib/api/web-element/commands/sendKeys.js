module.exports.command = function(...args) {
  const keys = args.reduce((prev, key) => {
    if (Array.isArray(key)) {
      prev.push(...key);
    } else {
      prev.push(key);
    }

    return prev;
  }, []);

  return this.runQueuedCommand('sendKeysToElement', {
    args: [keys]
  });
};
