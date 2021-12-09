exports.command = async function(data, callback) {
  const startTime = new Date();

  await this.execute(function(data) {return data}, [data], async function(result) {
    const res = await this.pause(100);

    const endTime = await this.perform(function() {
      return new Date() - startTime;
    });

    callback(endTime);
  });
};