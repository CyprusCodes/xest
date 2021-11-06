const asyncSeries = (tasks, fn) =>
  tasks.reduce(
    (promiseChain, currentTask) =>
      promiseChain.then(chainResults =>
        fn(currentTask).then(currentResult => [...chainResults, currentResult])
      ),
    Promise.resolve([])
  );

module.exports = asyncSeries;
