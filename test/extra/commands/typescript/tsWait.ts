// NOTE: by default nightwatch does not know how to execute .ts files hence
// additional steps are required. For example compiling them to .js before
// running nightwatch using `tsc`. This will create a second file, wait.js
// in this case, that is executable by nightwatch (NodeJS).

export function command(timeout = 0) {
  return this
    .perform(() => console.log(`Waiting ${timeout}ms`))
    .pause(timeout);
}
