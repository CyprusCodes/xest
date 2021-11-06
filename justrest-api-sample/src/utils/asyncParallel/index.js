async function asyncParallel(array, callback) {
  const promises = array.map(callback);
  await Promise.all(promises);
}

module.exports = asyncParallel;
