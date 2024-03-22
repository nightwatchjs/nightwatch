describe('demo tests using waitUntil element APIs', function() {
  it('wait until element is visible', function({element}) {
    element('#weblogin').waitUntil('visible');
  });

  it('wait until element is selected', function({element, state}) {
    element('#weblogin').waitUntil('present').waitUntil('selected');
  });

  it('wait until element is enabled', function({element}) {
    element('#weblogin').waitUntil('enabled');
  });

  it('wait until with custom message', function({element}) {
    element('#weblogin').waitUntil('enabled', {message: 'elemento %s no era presente en %d ms'});
  });
});

