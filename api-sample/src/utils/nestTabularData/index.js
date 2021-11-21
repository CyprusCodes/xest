const { groupBy, omit } = require("lodash");

const nest = (results, transformationsToApply, fieldsToOmit = []) => {
  const {
    mergeField,
    childrenLabel,
    fieldsToKeep
  } = transformationsToApply.shift();
  const groupedResult = groupBy(results, mergeField);
  fieldsToOmit.push(...fieldsToKeep, mergeField);

  return Object.entries(groupedResult).map(([key, value]) => {
    return {
      [mergeField]: key,
      ...fieldsToKeep.reduce((acc, keyToKeep) => {
        acc[keyToKeep] = value[0][keyToKeep];
        return acc;
      }, {}),
      [childrenLabel]: transformationsToApply.length
        ? nest(value, transformationsToApply, fieldsToOmit)
        : Object.values(value).map(v => omit(v, fieldsToOmit))
    };
  });
};

module.exports = nest;
