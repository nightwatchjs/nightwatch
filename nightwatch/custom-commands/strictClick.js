/**
 * A non-class-based custom-command in Nightwatch. The command name is the filename.
 *
 * Usage:
 *   browser.strictClick(selector)
 *
 * This command is not used yet used in any of the examples.
 *
 * For more information on working with custom-commands see:
 *   https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html
 *
 */

module.exports = {
  command: function(selector) {
    return this
      .waitForElementVisible(selector)
      .click(selector);
  }
};
