# Using Cucumber.js with Nightwatch out of the box

### Configuration
```js
{
  test_runner: {
    // set cucumber as the runner
    type: 'cucumber',  
      
    // define cucumber specific options  
    options: {
      //set the feature path
      feature_path: 'examples/cucumber-js/*/*.feature',
      
      // start the webdriver session automatically (enabled by default)
      auto_start_session: true,
    
      // use parallel execution in Cucumber  
      parallel: 2 // set number of workers to use (can also be defined in the cli as --parallel 2
    }
  },
  
  src_folders: ['examples/cucumber-js/features/step_definitions']
}
```

### Running
Cucumber spec files/step definition files can be provided in `src_folders` in Nightwatch config or as a CLI argument.

 - With `src_folders` defined:

```sh
$ npx nightwatch 
```

 - Without `src_folders` defined:

```sh
$ npx nightwatch examples/cucumber-js/features/step_definitions 
```

 - Parallel running using 2 workers:

```sh
$ nightwatch examples/cucumber-js/features/step_definitions --parallel 2 
```

 - Use other [test runner options](https://nightwatchjs.org/guide/running-tests/command-line-options.html) as usual:

```sh
$ npx nightwatch examples/cucumber-js/features/step_definitions --headless
```

### Disable the automatic session start
You might need sometimes to not start the Webdriver session automatically after Nightwatch is instantiated. For this purpose, Nightwatch provides the instance available as `this.client`, which contains an `launchBrowser()` method.

#### Configuration:
```js
test_runner: {
  type: 'cucumber',
  options: {
    feature_path: 'examples/cucumber-js/*/*.feature',
    auto_start_session: false
  }
}
```

You can then use an extra setup file that you can pass as an extra `--require` to Nightwatch, which will be forwarded to Cucumber. In the extra setup file, you can add other operations needed to be executed before the session is started.

#### Example _extra_setup.js:

Remember to set the `browser` on `this` so it can be closed automatically by Nightwatch. Otherwise, remember to call `.quit()` in your own Cucumber `After()` hooks. 

```js
const {Before} = require('@cucumber/cucumber');

Before(async function(testCase) {
  if (!this.client) {
    console.error('Nightwatch instance was not created.');

    return;
  }

  this.client.updateCapabilities({
    testCap: 'testing'
  });

  this.browser = await this.client.launchBrowser();
});
```

#### Nightwatch setup file for Cucumber

You might also want to inspect the built-in setup file that Nightwatch uses for initializing the Cucumber runner. It is available in our project root folder at [/cucumber-js/_setup_cucumber_runner.js](https://github.com/nightwatchjs/nightwatch/blob/v2/cucumber-js/_setup_cucumber_runner.js).

#### Run with extra setup:

```sh
$ nightwatch examples/cucumber-js/features/step_definitions --require {/full/path/to/_extra_setup.js}
```

### Reporting
When using the integrated Cucumber test runner, you need to use the Cucumber [formatters](https://github.com/cucumber/cucumber-js/blob/main/docs/formatters.md) for generating output.

Nightwatch reporters (like JUnit XML reports or the [global custom reporter](https://nightwatchjs.org/guide/extending-nightwatch/custom-reporter.html)) are not available. The main reason is that reporting is delegated to the Cucumber CLI. You can also [write your own](https://github.com/cucumber/cucumber-js/blob/main/docs/custom_formatters.md) Cucumber formatter.

Nightwatch will forward `--format` and `--format-options` CLI arguments, if present, to Cucumber.

By default, the `progress` formatter is used. Here's how the output looks like when running the example tests in Firefox:

```sh
ℹ Connected to GeckoDriver on port 4444 (1740ms).
Using: firefox (92.0.1) on MAC (20.6.0).

..  ✔ Testing if the page title equals 'Rijksmuseum Amsterdam, home of the Dutch masters' (4ms)
.  ✔ Element <#rijksmuseum-app> was visible after 46 milliseconds.
.  ✔ Testing if element <.search-results> contains text 'Operation Night Watch' (1994ms)
...  ✔ Testing if the page title equals 'Rijksmuseum Amsterdam, home of the Dutch masters' (8ms)
.  ✔ Element <#rijksmuseum-app> was visible after 49 milliseconds.
.  ✔ Testing if element <.search-results> contains text 'The Night Watch, Rembrandt van Rijn, 1642' (1427ms)
.

2 scenarios (2 passed)
10 steps (10 passed)
0m13.024s (executing steps: 0m12.998s)
```


