const assert = require('assert');
const MockServer  = require('../../../../lib/mockserver.js');
const CommandGlobals = require('../../../../lib/globals/commands-w3c.js');

describe('.window namespace commands', function () {
  before(function (done) {
    CommandGlobals.beforeEach.call(this, done);
  });

  after(function (done) {
    CommandGlobals.afterEach.call(this, done);
  });

  it('test .window.close()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window',
      method: 'DELETE',
      response: JSON.stringify({
        status: 0,
        value: null
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.close(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.open()/openNew()', function(done) {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/window/new',
        method: 'POST',
        postdata: {
          type: 'tab'
        },
        response: JSON.stringify({
          status: 0,
          value: {handle: 'CDwindow-SOMEHEXCODE123', type: 'tab'}
        })
      }, true, true)
      .addMock({
        url: '/session/13521-10219-202/window',
        method: 'POST',
        postdata: {
          name: 'CDwindow-SOMEHEXCODE123',
          handle: 'CDwindow-SOMEHEXCODE123'
        },
        response: JSON.stringify({
          status: 0,
          value: null
        })
      }, true, true);

    const api = this.client.api;
    this.client.api.window.open(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });
    this.client.api.window.openNew(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.open() with type=window', function(done) {
    MockServer
      .addMock({
        url: '/session/13521-10219-202/window/new',
        method: 'POST',
        postdata: {
          type: 'window'
        },
        response: JSON.stringify({
          status: 0,
          value: {handle: 'CDwindow-SOMEHEXCODE456', type: 'window'}
        })
      }, true)
      .addMock({
        url: '/session/13521-10219-202/window',
        method: 'POST',
        postdata: {
          name: 'CDwindow-SOMEHEXCODE456',
          handle: 'CDwindow-SOMEHEXCODE456'
        },
        response: JSON.stringify({
          status: 0,
          value: null
        })
      }, true);

    const api = this.client.api;
    this.client.api.window.open('window', function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.getHandle()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window',
      method: 'GET',
      response: JSON.stringify({
        status: 0,
        value: 'CDwindow-SOMEHEXCODE1223'
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.getHandle(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, 'CDwindow-SOMEHEXCODE1223');
    });

    this.client.start(done);
  });

  it('test .window.getAllHandles()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/handles',
      method: 'GET',
      response: JSON.stringify({
        status: 0,
        value: ['CDwindow-SOMEHEXCODE1223', 'CDwindow-SOMEHEXCODE456']
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.getAllHandles(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(result.value, ['CDwindow-SOMEHEXCODE1223', 'CDwindow-SOMEHEXCODE456']);
    });

    this.client.start(done);
  });

  it('test .window.switchTo()/switch()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window',
      method: 'POST',
      postdata: {
        name: 'CDwindow-SOMEHEXCODE456',
        handle: 'CDwindow-SOMEHEXCODE456'
      },
      response: JSON.stringify({
        status: 0,
        value: null
      })
    }, true, true);

    const api = this.client.api;
    this.client.api.window.switchTo('CDwindow-SOMEHEXCODE456', function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });
    this.client.api.window.switch('CDwindow-SOMEHEXCODE456', function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.switchTo() -- with error', function(done) {
    this.client.api.window.switchTo();
    
    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('windowHandle argument passed to .window.switchTo() must be a string; received: undefined (undefined).'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('test .window.maximize()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/maximize',
      method: 'POST',
      postdata: {
        windowHandle: 'current'
      },
      response: JSON.stringify({
        status: 0,
        value: {height: 809, width: 1440, x: 0, y: 25}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.maximize(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.minimize()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/minimize',
      method: 'POST',
      postdata: {},
      response: JSON.stringify({
        status: 0,
        value: {height: 763, width: 1200, x: 44, y: 69}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.minimize(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.fullscreen()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/fullscreen',
      method: 'POST',
      postdata: {},
      response: JSON.stringify({
        status: 0,
        value: {height: 900, width: 1440, x: 0, y: 0}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.fullscreen(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.getPosition()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'GET',
      response: JSON.stringify({
        status: 0,
        value: {height: 1011, width: 1200, x: -185, y: -1011}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.getPosition(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(result.value, {x: -185, y: -1011});
    });

    this.client.start(done);
  });

  it('test .window.getSize()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'GET',
      response: JSON.stringify({
        status: 0,
        value: {height: 1011, width: 1200, x: -185, y: -1011}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.getSize(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(result.value, {height: 1011, width: 1200});
    });

    this.client.start(done);
  });

  it('test .window.getRect()', function(done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'GET',
      response: JSON.stringify({
        status: 0,
        value: {height: 1011, width: 1200, x: -185, y: -1011}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.getRect(function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.deepStrictEqual(result.value, {height: 1011, width: 1200, x: -185, y: -1011});
    });

    this.client.start(done);
  });

  it('test .window.setPosition()', function (done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'POST',
      postdata: {x: 99, y: 98},
      response: JSON.stringify({
        status: 0,
        value: {width: 1000, height: 1000, x: 99, y: 98}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.setPosition(99, 98, function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.setPosition() -- with error', function(done) {
    this.client.api.window.setPosition(87, undefined);
    
    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('Coordinates passed to .window.getPosition() must be of type number.'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('test .window.setSize()/resize()', function (done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'POST',
      postdata: {width: 1076, height: 578},
      response: JSON.stringify({
        status: 0,
        value: {width: 1076, height: 578, x: 100, y: 100}
      })
    }, true, true);

    const api = this.client.api;
    this.client.api.window.setSize(1076, 578, function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });
    this.client.api.window.resize(1076, 578, function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.setSize() -- with error', function(done) {
    this.client.api.window.setSize('876', 678);
    
    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('First two arguments passed to .window.getPosition() must be of type number.'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('test .window.setRect() -- all properties', function (done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'POST',
      postdata: {x: -99, y: 10, width: 1098, height: 574},
      response: JSON.stringify({
        status: 0,
        value: {width: 1098, height: 574, x: -99, y: 10}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.setRect({width: 1098, height: 574, x: -99, y: 10}, function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.setRect() -- position properties', function (done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'POST',
      postdata: {x: 109, y: 76},
      response: JSON.stringify({
        status: 0,
        value: {width: 999, height: 555, x: 109, y: 76}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.setRect({x: 109, y: 76}, function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.setRect() -- size properties', function (done) {
    MockServer.addMock({
      url: '/session/13521-10219-202/window/rect',
      method: 'POST',
      postdata: {width: 1001, height: 301},
      response: JSON.stringify({
        status: 0,
        value: {width: 1001, height: 301, x: -99, y: 10}
      })
    }, true);

    const api = this.client.api;
    this.client.api.window.setRect({width: 1001, height: 301}, function callback(result) {
      assert.strictEqual(this, api);
      assert.strictEqual(result.status, 0);
      assert.strictEqual(result.value, null);
    });

    this.client.start(done);
  });

  it('test .window.setRect() -- only width passed', function(done) {
    this.client.api.window.setRect({width: 876});
    
    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('Attributes "width" and "height" must be specified together when using .window.setRect() command.'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('test .window.setRect() -- only y passed', function(done) {
    this.client.api.window.setRect({y: 100});
    
    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('Attributes "x" and "y" must be specified together when using .window.setRect() command.'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('test .window.setRect() -- with width and y passed', function(done) {
    this.client.api.window.setRect({width: 1000, y: 5});
    
    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('Attributes "width" and "height" must be specified together when using .window.setRect() command.'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('test .window.setRect() -- with error in width', function(done) {
    this.client.api.window.setRect({width: '677', height: 345, x: 10, y: 10});
    
    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('Width argument passed to .window.setRect() must be a number; received:'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('test .window.setRect() -- with error in y', function(done) {
    this.client.api.window.setRect({width: 677, height: 345, x: 10, y: {}});
    
    this.client.start(function(err) {
      try {
        assert.ok(err instanceof Error);
        assert.strictEqual(err.message.includes('Y position argument passed to .window.setRect() must be a number; received:'), true);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});


