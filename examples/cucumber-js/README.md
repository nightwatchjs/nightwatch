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
      feature_path: 'examples/cucumberJs/*/*.feature',

      // use parallel execution in Cucumber  
      parallel: 2 // set number of workers to use (can also be defined in the cli as --parallel 2
    }
  },
  
  src_folders: ['examples/cucumberJs/features/step_definitions']
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
$ npx nightwatch examples/cucumberJs/features/step_definitions 
```

 - Parallel running using 2 workers:

```sh
$ npx nightwatch examples/cucumberJs/features/step_definitions --parallel 2 
```

 - Use other [test runner options](https://nightwatchjs.org/guide/running-tests/command-line-options.html) as usual:

```sh
$ npx nightwatch examples/cucumberJs/features/step_definitions --headless
```

### Reporting
When using the integrated Cucumber test runner, you need to use the Cucumber [formatters](https://github.com/cucumber/cucumber-js/blob/main/docs/formatters.md) for generating output.

Nightwatch reporters (like JUnit XML reports or the [global custom reporter](https://nightwatchjs.org/guide/extending-nightwatch/custom-reporter.html)) are not available. The mean reason is that reporting is delegated to the Cucumber CLI. 

Here's how the output looks like when running the example tests here in Firefox:

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


