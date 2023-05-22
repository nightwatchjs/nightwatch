describe('element assertion test', function() {
  it('element is visible', function({element}) {
    element.find('#weblogin').assert.visible();
    element.find('#weblogin').assert.enabled();
  });

  it('element is not visible - failure', function({element}) {
    element.find('#weblogin').assert.not.visible();
  });

  it('element is present', function({element}){
    element.find('#weblogin').assert.present();
  });

});