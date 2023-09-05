describe('demo of failure of waitUntil element commands', function() {
  it('waitUntil element is visible - element not present', function({element}) {
    element.find('#badElement').waitUntil('visible');
  });
});