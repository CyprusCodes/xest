/* SHOULD ONLY BE USED FOR LOCAL PERFORMANCE DEBUGGING

It works across different files as well, 
just import and keep split/print ing.

Example usage:

const stopwatch = require('~root/utils/stopwatch');

function mySlowFunction() {
  stopwatch.start();

  await doSomeSlowOperation();
  stopwatch.split('slow operation 1');

  await doSomeOtherSlowOperation();
  stopwatch.split('slow operation 2');

  stopwatch.print();
}
*/

let laps = [];
let startTime;

const start = () => {
  startTime = new Date();
};

const split = (label, meta = {}) => {
  if (!startTime) {
    // eslint-disable-next-line no-console
    console.warn("stopwatch was not started, starting now");
    // eslint-disable-next-line no-param-reassign
    label = `start - ${label}`;
    startTime = new Date();
  }
  laps.push({ label, meta, timestamp: new Date() });
};

const reset = () => {
  startTime = null;
  laps = [];
};

const getDurationSince = (t1, t2) => {
  const diff = t1.getTime() - t2.getTime();
  const secondSince = (diff / 1000).toFixed(2);
  const millisecondsSince = diff;

  if (diff > 1000) {
    return `${secondSince} sec.`;
  }
  return `${millisecondsSince} ms.`;
};

function Reading(label, sinceBeginning, sinceLast, meta) {
  this.label = label;
  this["since beginning"] = sinceBeginning;
  this["since last"] = sinceLast;
  this.meta = meta;
}

const print = (label = "print - end", meta = {}) => {
  split(label, meta);
  const header = ["label", "since beginning", "since last", "meta"];
  const results = laps.map((l, i) => {
    return new Reading(
      l.label,
      getDurationSince(l.timestamp, startTime),
      getDurationSince(
        l.timestamp,
        (laps[i - 1] && laps[i - 1].timestamp) || startTime
      ),
      l.meta
    );
  });
  // eslint-disable-next-line no-console
  console.table([...results], header);
};

module.exports = {
  start,
  split,
  reset,
  print
};
