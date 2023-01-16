module.exports = class AppendResult {
  command() {
    const {name} = this.client.reporter.currentTest;
    const {testResults} = this.client.reporter;
    testResults.appendTestResult({
      [name]: {
        customReport: {
          success: true
        }
      }
    });

  }
};