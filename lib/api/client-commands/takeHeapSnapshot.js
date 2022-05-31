const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Takes a heap snapshot and saves it in JSON format serialized to string.
 * Load the snapshot file into Chrome DevTools memory tab to inspect.
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
 * @api protocol.userprompts
 * @returns {string} Heap snapshot serialized into string.
 */
class TakeHeapSnapshot extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('TakeHeapSnapshot is not supported while using this driver');
      Logger.error(error);

      return callback(error);
    }

    const {heapSnapshotLocation} = this;
    
    this.transportActions
      .takeHeapSnapshot(heapSnapshotLocation, callback)
      .catch(err => {
        return err;
      });
  }

  command(heapSnapshotLocation, callback) {
    this.heapSnapshotLocation = heapSnapshotLocation;

    return super.command(callback);
  }
}

module.exports = TakeHeapSnapshot;
