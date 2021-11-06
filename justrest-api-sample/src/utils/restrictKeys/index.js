const restrictKeys = (obj, restrictedKeys) => {
  const keys = Object.keys(obj);
  const containsRestrictedKey = restrictedKeys.some(r =>
    keys.find(k => r === k)
  );
  if (containsRestrictedKey) {
    throw new Error("Object contains restricted key.");
  }
  return obj;
};

module.exports = restrictKeys;
