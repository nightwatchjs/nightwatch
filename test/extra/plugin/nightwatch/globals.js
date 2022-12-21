module.exports = {
  reporter(results, done) {
    this.reporterCount++;
    done();
  }
};