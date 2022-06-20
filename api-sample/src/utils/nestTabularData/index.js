const { groupBy, omit } = require("lodash");

const nest = (results, transformationsToApply, fieldsToOmit = []) => {
  const transClone = [...transformationsToApply];
  const { mergeField, childrenLabel, fieldsToKeep } = transClone.shift();
  const groupedResult = groupBy(results, mergeField);
  fieldsToOmit.push(...fieldsToKeep, mergeField);

  return Object.entries(groupedResult).map(([key, value]) => {
    return {
      [mergeField]: key,
      ...fieldsToKeep.reduce((acc, keyToKeep) => {
        acc[keyToKeep] = value[0][keyToKeep];
        return acc;
      }, {}),
      [childrenLabel]: transClone.length
      ? nest(value, transClone, fieldsToOmit)
        : Object.values(value).map(v => omit(v, fieldsToOmit))
    };
  });
};

module.exports = nest;