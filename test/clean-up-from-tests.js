afterEach(function () {
  process.emit('cleanUpFromTests');
});

after(function () {
  console.log(process._events);
});
