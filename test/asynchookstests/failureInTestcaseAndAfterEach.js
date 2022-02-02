describe('Failure in testcase and afterEach', function() {
  it('demo test', function(client) {
    client.waitForElementPresent({
      selector: 'element_that_does_not_exit',
      timeout: 1000,
      abortOnFailure: true
    });
    throw Error('test failed');
  });

  afterEach(client => {
    client.perform(() => { 
      console.log('TEST EXECUTION FINISHED'); 
    });
  });
});
