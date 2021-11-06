// https://github.com/theruther4d/jest-serializer-date/blob/master/index.js
function extractValues(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    date: date.getUTCDate()
  };
}

function isToday(date) {
  const today = extractValues(new Date());
  const value = extractValues(date);

  if (
    today.year !== value.year ||
    today.month !== value.month ||
    today.date !== value.date
  ) {
    return false;
  }

  return true;
}

module.exports = {
  test(val) {
    if (val && typeof val === "object" && "getFullYear" in val) {
      return true;
    }

    return false;
  },
  print(val) {
    if (isToday(val)) {
      return `Current Date`;
    }

    const d = extractValues(val);
    return [d.month, d.date, d.year].join("-");
  }
};
