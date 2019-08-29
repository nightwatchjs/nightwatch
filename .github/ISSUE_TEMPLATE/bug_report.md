---
name: Bug report
about: Create a report to help us improve
title: ""
labels: ''
assignees: ''

---

## Describe the bug
<!--
A clear and concise description of what the bug is. Please make sure to format the code samples, verbose output, configuration and other inline debug information (use the __Preview__  functionality). Check out the [GitHub Markdown guide](https://guides.github.com/features/mastering-markdown/).
-->

## How To Reproduce
<!-- 
Include a sample test which reproduces the problem you're experiencing. The test should be against a **public url**. The test and other info should be posted inline.
-->

**Sample test:**

```js
module.exports = {
  sampleTest: function(browser) {

  }
}
```

**Run with command**
<!--
Include the command used to run the test, if applicable.
-->
```sh
$ nightwatch test/sampleTest.js --your-other-arguments-here
```

**Verbose output**
<!--
Include the verbose output, if possible (run nightwatch with `--verbose` argument)
-->
```sh
# your output here
```

**Configuration**
<!-- try to leave out the irrelevant bits -->
```js
{
  "your": { "config": "here" }
}
```

## Expected behavior
A clear and concise description of what you expected to happen.

## Your Environment:
Please include the following:
 - Nightwatch version
 - Node.js version
 - OS: [e.g. Windows 10]
 - Browser driver [chromedriver, safaridriver, geckodriver, or microsoftedge]
 - Browser driver version [e.g. 75]
 - Selenium server version (if applicable)

## Additional context
Add any other context about the problem here.
