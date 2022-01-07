---
name: Bug report
about: Create a report to help us improve
title: ""
labels: ''
assignees: ''

---

## Describe the bug
<!--
A clear and concise description of what the bug is, how to reproduce it, and what the expected behaviour is.

Please make sure to format the code samples, verbose output, configuration and other inline debug information (use the Preview functionality). Check out the [GitHub Markdown guide](https://guides.github.com/features/mastering-markdown/).
-->

## Sample test
<!-- 
Include a sample test which reproduces the problem you're experiencing. If possible, the test should be against a public url.

Please add the test and other info inline, not as attachments or screenshots.
-->

<details><summary>sampleTest.js</summary><p>
<!-- browsers demand the next line be empty -->

```js
// Please add the sample test here

module.exports = {
  sampleTest: function(browser) {

  }
}
```
</p></details>

**Run with command**
<!-- Include the command used to run the test, if applicable. -->

```sh
$ nightwatch test/sampleTest.js --your-other-arguments-here
```

### Verbose output
<details><summary>debug.log</summary><p>
<!-- browsers demand the next line be empty -->

```txt
<!-- Include the verbose output, if possible (run nightwatch with `--verbose` argument) -->
```
</p></details>


## Configuration
<details><summary>nightwatch.json</summary><p>
<!-- browsers demand the next line be empty -->

<!-- Please paste your nightwatch.json or nightwatch.conf.js here; make sure to leave out any sensitive details -->

```js
{
  "your": { "config": "here" }
}
```
</p></details>

## Your Environment
<!--- Include the relevant details your environment -->

| Executable | Version |
| ---: | :--- |
| `nightwatch --version` | VERSION |
| `npm --version`  | VERSION |
| `yarn --version` | VERSION |
| `node --version` | VERSION |

| Browser driver | Version |
| --- | --- |
| NAME | VERSION |
<!-- For example:
| chromedriver | 76 |
| geckodriver | v0.25.0 |
| selenium-server | 3.141 |
-->

| OS | Version |
| --- | --- |
| NAME | VERSION |
<!-- For example:
| macOS Sierra | 10.12.3 |
| Windows 10 | 1607 |
| Ubuntu | 16.10 |
-->
