exports.assertion = (test, testVal) ->
  @expected = true
  @message = ''
  @pass = (value) ->
    test.equals testVal, value, 'Value passed to the `pass` method is incorrect.'
    value is @expected

  @value = (result) ->
    test.deepEqual result,
      value : testVal,
      'Value passed to the `value` method is incorrect.'
    result.value

  @command = (callback) ->
    callback value : testVal
    this

  return