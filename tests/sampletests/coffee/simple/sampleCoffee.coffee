module.exports =
  demoTestExcluded : (client) ->
    client.url 'http://localhost'
      .assert.elementPresent '#weblogin'
      .end()
