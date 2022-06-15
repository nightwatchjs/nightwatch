const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Takes a heap snapshot and saves it in string-serialized JSON format.
 * Load the snapshot file into Chrome DevTools' Memory tab to inspect.
 *
 * @example
 *  this.demoTest = function (browser) {
 *    browser
 *      .navigateTo('https://www.google.com')
 *      .takeHeapSnapshot('./snap.heapsnapshot');
 *  };
 *
 * @method takeHeapSnapshot
 * @syntax .takeHeapSnapshot([heapSnapshotLocation], [callback])
 * @param {string} [heapSnapshotLocation] Optional Location where you want to save the generated heap snapshot file.
 * @param {function} [callback] Optional callback function which is called with the heap snapshot serialized to string as argument.
 * @api protocol.cdp
 * @since 2.2.0
 * @returns {string} Heap snapshot serialized into string.
 */
class TakeHeapSnapshot extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('The command .takeHeapSnapshot() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const {heapSnapshotLocation} = this;
    
    this.transportActions
      .takeHeapSnapshot(heapSnapshotLocation, callback)
      .catch(err => {
        Logger.error(err);
        callback(err);
      });
  }

  command(heapSnapshotLocation, callback) {
    this.heapSnapshotLocation = heapSnapshotLocation;

    return super.command(callback);
  }
}

module.exports = TakeHeapSnapshot;
