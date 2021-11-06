const removeDuplicatesFromArray = arrayWithDuplictes => {
  const arrayWithoutDuplicates = Array.from(
    new Set(arrayWithDuplictes.map(JSON.stringify)),
    JSON.parse
  );
  return arrayWithoutDuplicates;
};

module.exports = removeDuplicatesFromArray;
