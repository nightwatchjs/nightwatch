export interface NightwatchCustomCommandsModel {
  /**
   * Define a custom command
   *
   * @example
   * class LogMessage implements NightwatchCustomCommandsModel {
   *   command() {
   *     
   *     return Promise.resolve();
   *   }
   * }
   *
   * @see https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html#define-a-custom-command
   */
  command: (...args: any) => unknown | Promise<unknown>;
}

/**
 * @see https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html#define-a-custom-command
 */
export interface NightwatchCustomCommands {}
