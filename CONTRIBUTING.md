# Contributing to Nightwatch

Contributions to Nightwatch are always welcome but please try to follow these guidelines when sending in something as it will help addressing the issue quicker and more smoothly.

__Please do not ask for assistance in the Issues list.__ Join our [Discord server](https://discord.com/invite/SN8Da2X) to ask questions and seek help.

Assistance requests posted in the Issues list are usually closed right away.

## Code of Conduct

Contributors are expected to adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Submit an issue

Before submitting a new issues, try searching for a similar one here: https://github.com/nightwatchjs/nightwatch/search?type=Issues and add your scenario there and anything else which you think will help with fixing it;

If you are filing a bug report, regression issue or what it appears to be strange behaviour, please follow the steps below:

1. Please write an elaborate title which explains the problem as accurate as possible
   For instance:
   - __not helpful__: "Issue with tags"
   - __much better__: "Tags don't work when combined with --skiptags option"
2. Include a sample test which reproduces the problem you're experiencing. The test should be against a __public url__. The test and other info should be posted inline, attachments will be ignored;
3. Include the verbose output, if possible (run nightwatch with `--verbose` argument);
4. Include your configuration (try to leave out the irrelevant bits);
5. Also include: Nightwatch version, Node.js version, OS version and Webdriver/Selenium Server version;
6. Please try not to report issues you have with individual browser drivers which cannot or should not be solved in Nightwatch.

## Requesting a feature

Feature requests are welcome.

1. Indicate in the issue title that it is a feature/enhancement request;
2. Explain the use case and include a sample test case and/or usage, if possible;
3. Try to submit enhancements that you cannot build with custom commands/assertions and something that will benefit the community;
4. Same as for issues, add your comments/vote to an existing feature request if you'd like to see it implemented.

## Submitting a pull request

Thanks in advance for your contribution.

1. Follow the usual git workflow for submitting a pull request:
   - Fork and clone the project.
   - Create a new branch from main (e.g. `features/my-new-feature` or `issue/123-my-bugfix`).
   - Add your changes.
   - Try to run some Nightwatch example tests locally to test the functionality after making your changes: `node ./bin/nightwatch examples/tests/ecosia.js --env chrome`.
   - Run Nightwatch unit tests locally: `npm test`;  
     Or, run individual tests: `npx mocha test/src/api/commands/client/testWaitUntil.js`.
   - Commit your changes and create a pull request.

   __Note:__ When running Nightwatch example test for the first time, if you encounter _"Cannot read source"_ error, go to `nightwatch.conf.js` file and set 'page_objects_path' and 'custom_commands_path' configs to `[]`.

2. If you're fixing a bug, also create an issue if one doesn't exist yet.
3. If it's a new feature/enhancement, explain why do you think it's necessary.
4. If your change include drastic or low level changes please discuss them to make sure they will be accepted and what the impact will be.
5. If your change is based on existing functionality, please consider refactoring first. Pull requests that duplicate code will not make it in very quick, if at all.
6. Do not include changes that are not related to the issue at hand.
7. Follow the same coding style with regards to spaces, semicolons, variable naming etc.
8. Always add tests - after all this _is_ a testing framework.
