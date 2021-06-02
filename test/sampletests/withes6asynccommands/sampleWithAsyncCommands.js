module.exports = {
  demoTest: async function (client) {
    client.url('http://localhost');
    client.basicPerform(function() {
      client.globals.increment++;
    });
    client.customPerform(function() {
      client.globals.increment++;
    });
    client.customPerformClass(function() {
      client.globals.increment++;
    });
    client.customPerformClass();

    await client.basicPerformWithFluentApi(function() {});

    client.end();
  }
};
