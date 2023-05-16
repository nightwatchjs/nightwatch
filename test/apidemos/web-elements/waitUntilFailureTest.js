describe('demo of failure of waitUntil element commands', function() {
  it('waitUntil element is visible and but not selected', function({element}) {
    element.find('#weblogin').waitUntil('visible').waitUntil('not.selected');
  });
});