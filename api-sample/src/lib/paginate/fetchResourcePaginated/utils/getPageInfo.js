const qs = require("qs");
const encodeCursorValues = require("./encodeCursorValues");

function convertSortCriteriaToQueryParams(sortCriteria) {
  const queryParams = sortCriteria
    .map(criteria => {
      const direction = criteria.direction.toUpperCase() === "DESC" ? "-" : "";
      return `${direction}${criteria.column}`;
    })
    .join(",");

  return `${queryParams}`;
}

const getPageInfo = ({
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
}) => {
  let from;
  let to;
  if (numberOfRecordSelected === 0) {
    from = 0;
    to = 0;
  } else if (page === "last") {
    from = totalRecordCount - numberOfRecordSelected + 1;
    to = totalRecordCount;
  } else if (direction === "next") {
    from = totalRecordCount - totalUnlimitedRecordCount + 1;
    to = from + numberOfRecordSelected - 1;
  } else if (direction === "previous") {
    to = totalUnlimitedRecordCount;
    from = to - numberOfRecordSelected + 1;
  } else {
    from = 1;
    to = from + numberOfRecordSelected - 1;
  }

  const sortCriteria = convertSortCriteriaToQueryParams(orderBy);
  let baseLink = `${basePath}?page_size=${limit}&sort_by=${sortCriteria}`;
  if (filters) {
    const filterString = qs.stringify(
      { filters },
      {
        encode: false,
        queryPrefix: "filters",
        arrayFormat: "indices"
      }
    );
    baseLink = `${baseLink}&${filterString}`;
  }
  const firstLink = `${baseLink}&page=first`;
  const lastLink = `${baseLink}&page=last`;

  let selfLink;
  if (page === "last") {
    selfLink = lastLink;
  } else {
    selfLink = baseLink;
  }

  let previousLink = null;
  let startCursor = null;
  if (from > 1) {
    const referenceRecord = records[0];
    startCursor = encodeCursorValues(referenceRecord, orderBy);
    previousLink = `${baseLink}&direction=previous&cursor=${startCursor}`;
  }

  let nextLink = null;
  let endCursor = null;
  if (to < totalRecordCount && numberOfRecordSelected !== 0) {
    const referenceRecord = records[numberOfRecordSelected - 1];
    endCursor = encodeCursorValues(referenceRecord, orderBy);
    nextLink = `${baseLink}&direction=next&cursor=${endCursor}`;
  }

  return {
    pageSize: limit,
    from,
    to,
    total: totalRecordCount,
    hasNextPage: Boolean(nextLink),
    hasPreviousPage: Boolean(previousLink),
    filterableAttributes,
    sortableAttributes,
    startCursor,
    endCursor,
    links: {
      self: selfLink,
      first: firstLink,
      previous: previousLink,
      next: nextLink,
      last: lastLink
    }
  };
};

module.exports = getPageInfo;
