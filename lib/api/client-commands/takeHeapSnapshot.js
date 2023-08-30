const ClientCommand = require('./_base-command.js');
const {Logger} = require('../../utils');

/**
 * Take heap snapshot and save it as a `.heapsnapshot` file.
 * The saved snapshot file can then be loaded into Chrome DevTools' Memory tab for inspection.
 *
 * The contents of the heap snapshot are also available in the `value` property of the `result`
 * argument passed to the callback, in string-serialized JSON format.
 *
 * @example
 *  describe('take heap snapshot', function() {
 *    it('takes heap snapshot and saves it as snap.heapsnapshot file', function() {
 *      browser
 *        .navigateTo('https://www.google.com')
 *        .takeHeapSnapshot('./snap.heapsnapshot');
 *    });
 *  });
 *
 * @method takeHeapSnapshot
 * @syntax .takeHeapSnapshot([heapSnapshotLocation], [callback])
 * @param {string} [heapSnapshotLocation] Location where the generated heap snapshot file should be saved.
 * @param {function} [callback] Callback function called with string-serialized heap snapshot as argument.
 * @returns {Promise<string>} Heap snapshot in string-serialized JSON format.
 * @api protocol.cdp
 * @since 2.2.0
 * @moreinfo nightwatchjs.org/guide/running-tests/take-heap-snapshot.html
 */
class TakeHeapSnapshot extends ClientCommand {

  performAction(callback) {

    if (!this.api.isChrome()  && !this.api.isEdge()) {
      const error =  new Error('The command .takeHeapSnapshot() is only supported in Chrome and Edge drivers');
      Logger.error(error);

      return callback(error);
    }

    const {heapSnapshotLocation} = this;

    this.transportActions.takeHeapSnapshot(heapSnapshotLocation, callback);
  }

  command(heapSnapshotLocation, callback) {
    this.heapSnapshotLocation = heapSnapshotLocation;

    return super.command(callback);
  }
}

module.exports = TakeHeapSnapshot;
