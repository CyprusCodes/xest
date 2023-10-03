const { sql } = require("~root/lib/database");
const selectResource = require("./queries/selectResource");
const countTotal = require("./queries/countTotal");
const countUnlimited = require("./queries/countUnlimited");
const getPageInfo = require("./utils/getPageInfo");
const decodeCursorValues = require("./utils/decodeCursorValues");
const checkValidation = require("./utils/checkValidation");

const fetchResources = async ({
  baseTable,
  selectFields,
  joinStatements = [],
  sortableAttributes = [],
  filterableAttributes = [],
  sortBy,
  groupBy,
  limit = 50,
  page = null,
  direction = "next",
  filters,
  cursorValues: encodedCursorValues,
  basePath,
  onRowReady,
  onPageResultsReady
}) => {
  let cursorValues = [];
  if (encodedCursorValues) {
    try {
      cursorValues = decodeCursorValues(encodedCursorValues);
    } catch (error) {
      // next line makes validation fail on purpose
      // so check validation helper can report on that
      cursorValues = {};
      // eslint-disable-next-line no-console
      console.error(error, "invalid cursor");
    }
  }

  const orderBy = sortBy
    ? sortBy.split(",").map(item => {
        let sortDirection = sql`ASC`;
        let column = item.trim();

        if (column.startsWith("-")) {
          sortDirection = sql`DESC`;
          column = column.substring(1);
        }

        return { column, direction: sortDirection };
      })
    : sortableAttributes.map(v => {
        return { column: v, direction: sql`DESC` };
      });

  const validationResults = checkValidation({
    selectFields,
    orderBy,
    filters,
    filterableAttributes,
    sortableAttributes,
    cursorValues,
    page,
    direction,
    limit
  });
  if (!validationResults.valid) {
    return {
      errors: validationResults
    };
  }

  const records = await selectResource({
    baseTable,
    selectFields,
    joinStatements,
    groupBy,
    orderBy,
    limit,
    page,
    direction,
    filters,
    cursorValues,
    filterableAttributes
  });
  const numberOfRecordSelected = records.length;

  const totalRecordCount = await countTotal({
    baseTable,
    joinStatements,
    filters,
    filterableAttributes,
    groupBy
  });

  const totalUnlimitedRecordCount = await countUnlimited({
    baseTable,
    joinStatements,
    orderBy,
    groupBy,
    page,
    direction,
    filters,
    cursorValues,
    filterableAttributes
  });

  let recordsSelected = [];
  if (onRowReady) {
    for (let i = 0; i < records.length; i += 1) {
      const record = records[i];
      const enrichedRecord = await onRowReady(record, i);
      recordsSelected.push(enrichedRecord);
    }
  } else {
    recordsSelected = records;
  }

  let dataResponse = recordsSelected;
  if (onPageResultsReady) {
    const enrichedPageRecords = await onPageResultsReady(recordsSelected);
    dataResponse = enrichedPageRecords;
  }

  const pageInfo = getPageInfo({
    numberOfRecordSelected,
    totalRecordCount,
    totalUnlimitedRecordCount,
    limit,
    page,
    direction,
    records,
    filterableAttributes,
    sortableAttributes,
    orderBy,
    filters,
    basePath
  });
  return {
    metadata: pageInfo,
    data: dataResponse
  };
};

module.exports = fetchResources;
