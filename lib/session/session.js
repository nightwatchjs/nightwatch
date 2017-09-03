const events = require('events');
const CommandQueue = require('../core/queue.js');
const Utils = require('../util/utils.js');

class Session extends events.EventEmitter {
  contructor(opts = {}) {
    super();

    this.sessionId = null;
    this.options = opts;
    this.terminated = false;

    this.queue = CommandQueue;
    this.queue.empty();
    this.queue.reset();
  }

  start() {
    if (!this.sessionId && this.options.start_session) {
      this
        .once('selenium:session_create', this.start)
        .createSession();
      return this;
    }

    this.queue.reset();
    this.queue.run(error => {
      if (error) {
        let stackTrace = '';
        if (error.stack) {
          stackTrace = error.stack.split('\n').slice(1).join('\n');
        }

        this.results.errors++;
        this.errors.push(error.name + ': ' + error.message + '\n' + stackTrace);
        if (this.options.output) {
          Utils.showStackTraceWithHeadline(error.name + ': ' + error.message, stackTrace, true);
        }

        if (this.options.start_session) {
          this.terminate();
        }
        return;
      }

      this.finished();
    });

    return this;
  }

  terminate(deferred) {
    // in case this was a synchronous command (e.g. assert.ok()) we need to wait for other possible
    // commands which might have been added afterwards while client is terminated
    if (deferred) {
      this.queue.instance().once('queue:started', this.terminateSession.bind(this));
    } else {
      this.terminateSession();
    }

    this.terminated = true;
    return this;
  }

  resetTerminated() {
    this.terminated = false;
    return this;
  }

  terminateSession() {
    this.queue.reset();
    this.queue.empty();

    if (this.options.end_session_on_fail && this.options.start_session) {
      this.api.end(() =>{
        this.finished();
      });

      // FIXME: sometimes the queue is incorrectly restarted when another .end() is
      // scheduled from globalBeforeEach and results into a session command being sent with
      // null as the sessionId
      this.queue.run();
    } else {
      this.finished();
    }
    return this;
  }

  finished() {
    this.emit('nightwatch:finished', this.results, this.errors);

    return this;
  }

  createSession() {
    if (this.terminated) {
      return this;
    }

    let options = {
      path : '/session',
      data : {
        desiredCapabilities : this.desiredCapabilities
      }
    };

    var request = new HttpRequest(options);
    request.on('success', function(data, response, isRedirect) {
      if (data && data.sessionId) {
        self.sessionId = self.api.sessionId = data.sessionId;
        if (data.value) {
          self.api.capabilities = data.value;
        }

        self.emit('selenium:session_create', self.sessionId, request, response);
      } else if (isRedirect) {
        self.followRedirect(request, response);
      } else {
        request.emit('error', data, null);
      }
    })
      .on('error', function(data, err) {
        if (self.options.output) {
          console.error('\n' + Logger.colors.light_red('Error retrieving a new session from the selenium server'));
        }

        if (typeof data == 'object' && Object.keys(data).length === 0) {
          data = '';
        }

        if (!data && err) {
          data = err;
        }

        self.emit('error', data);
      })
      .send();

    return this;
  }
}