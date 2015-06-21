# Contributing to Nightwatch

Contributions to Nightwatch are always welcome but please try to follow these guidelines when sending in something as it will help addressing the issue quicker and more smoothly.

## Submit an issue
If you are filing a bug, regression issue or what it appears to be strange behaviour this is what you must keep in mind:

1. Please do not ask for support or questions in the __Issues__ list. The [mailing list](https://groups.google.com/forum/#!forum/nightwatchjs) is a much better place for discussions and it helps keeping things separate 
2. Search for a similar issue here: https://github.com/nightwatchjs/nightwatch/search?type=Issues and add your scenario there and anything else which you think will help with fixing it
3. Please do not repport issues you have with Selenium or the individual browser drivers that cannot or should not be solved in Nightwatch
4. When submitting a new issue please include a sample test (for complex scenarios) which would reproduce the problem you're experiencing. The test should be against a public url
5. Also include: Nightwatch version, Node.js version, OS version and Selenium server version (including any driver version if applicable)

## Requesting a feature
Feature requests are welcome. 

1. Indicate in the issue title that it is a feature/enhancement request
2. Try to be considerate and submit something that you cannot build in a custom command/assertion and something that will benefit others and the project.
3. Same as for issues, add your comments/vote to an existing feature request if you'd like to see it implemented

## Submitting a pull request
Thanks in advance for your contribution.

1. Follow the usual git workflow for submitting a pull request
  
  * fork the project
  * create a new branch from master (e.g. `features/my-new-feature` or `issue/123-my-bugfix`)
2. If you're fixing a bug also create an issue if one doesn't exist yet
3. If it's a new feature explain why do you think it's necessary
4. If your change include drastic or low level changes please discuss them to make sure they will be accepted and what the impact will be
5. If your change is based on exisiting functionality please consider refactoring first. Pull requests that duplicate code will not make it in very quick, if at all.
6. Follow the same coding style with regards to spaces, semicolons, variable naming etc. 
7. Add tests - after all this _is_ a testing framework


