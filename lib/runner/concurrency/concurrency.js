const ChildProcess = require('./child-process.js');

class Concurrency {
  constructor(argv = {}) {
    this.argv = argv;
  }

  static getAvailableColors() {
    let availColorPairs = [
      ['red', 'light_gray'],
      ['green', 'black'],
      ['blue', 'light_gray'],
      ['magenta', 'light_gray']
    ];
    let currentIndex = availColorPairs.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = availColorPairs[currentIndex];
      availColorPairs[currentIndex] = availColorPairs[randomIndex];
      availColorPairs[randomIndex] = temporaryValue;
    }

    return availColorPairs;
  }

  static isParallelMode() {
    return process.env.__NIGHTWATCH_PARALLEL_MODE === '1';
  }

  runEnvironments(env, done = function() {}) {

  }

  runTestWorkers(done = function() {}) {

  }
}

module.exports = Concurrency;