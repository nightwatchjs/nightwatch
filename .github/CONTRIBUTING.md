# Contributing to Nightwatch

Contributions to Nightwatch are always welcome but please try to follow these guidelines when sending in something as it will help addressing the issue quicker and more smoothly.

__Please do not ask for assistance in the Issues list.__ Use the [Mailing List](https://groups.google.com/forum/#!forum/nightwatchjs) or [StackOverflow](http://stackoverflow.com/questions/tagged/nightwatch.js) to ask questions and seek help. Usually, assistance requests posted in the Issues list are closed right away.

## Submit an issue

Before submitting a new issues, try searching for a similar one here: https://github.com/nightwatchjs/nightwatch/search?type=Issues and add your scenario there and anything else which you think will help with fixing it;
 
If you are filing a bug, regression issue or what it appears to be strange behaviour, please follow this steps in writing your report:

1. Please write a meaningful  title that would clearly and concisely explain the problem. 
  For instance:
  - __not helpful__: "Issue with tags"
  - __much better__: "Tags don't work when combined with --skiptags option in some cases"
2. Include a sample test (for complex scenarios) which would reproduce the problem you're experiencing. The test should be against a public url. The test and other info should be posted inline, attachments will not be accepted;
3. Include the verbose output, if possible (run nightwatch with `--verbose` argument);
4. Also include: Nightwatch version, Node.js version, OS version and Selenium server version (including any driver version if applicable);
5. Please do not report issues you have with Selenium or the individual browser drivers that cannot or should not be solved in Nightwatch

## Requesting a feature
Feature requests are welcome. 

1. Indicate in the issue title that it is a feature/enhancement request
2. Explain the use case and include a sample test case and/or usage, if possible 
3. Try to be considerate and submit something that you cannot build in a custom command/assertion and something that will benefit others and the project.
4. Same as for issues, add your comments/vote to an existing feature request if you'd like to see it implemented

## Submitting a pull request
Thanks in advance for your contribution.

1. Follow the usual git workflow for submitting a pull request
  
  * fork the project
  * create a new branch from master (e.g. `features/my-new-feature` or `issue/123-my-bugfix`)
2. If you're fixing a bug also create an issue if one doesn't exist yet
3. If it's a new feature explain why do you think it's necessary
4. If your change include drastic or low level changes please discuss them to make sure they will be accepted and what the impact will be
5. If your change is based on exisiting functionality please consider refactoring first. Pull requests that duplicate code will not make it in very quick, if at all.
6. Do not include changes that are not related to the issue at hand
6. Follow the same coding style with regards to spaces, semicolons, variable naming etc. 
7. Add tests - after all this _is_ a testing framework


