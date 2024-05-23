const { sql } = require("~root/lib/database");

const revertSortDirection = direction => {
  const checkDirectionStr = direction.toString();
  if (checkDirectionStr === "ASC") {
    return sql`DESC`;
  }

  if (checkDirectionStr === "DESC") {
    return sql`ASC`;
  }

  throw new Error(`Unknown sort direction ${direction}`);
};

module.exports = revertSortDirection;
