const checkFilterApplicableToColumn = ({
  column,
  operation,
  values,
  filterableAttributes
}) => {
  if (!column.includes(".")) {
    return {
      column,
      operation,
      message: `Select field: ${column} is not using dot notation. All columns should use dot notation and should be snake_case`
    };
  }
  const filterToBeApplied = filterableAttributes.find(attribute => {
    return attribute.column === column;
  });
  if (!filterToBeApplied) {
    return {
      column,
      operation,
      message: `Column ${column} is not filterable.`
    };
  }

  const supportedOperations = filterToBeApplied.operations;
  const operationToApply = supportedOperations.find(
    op => op.operator === operation
  );
  if (!operationToApply) {
    return {
      column,
      operation,
      message: `Operation ${operation} is not supported for column ${column}.`
    };
  }

  if (values.length > operationToApply.maximumNumberOfOperands) {
    return {
      column,
      operation,
      message: `Operation ${operation} requires at most ${operationToApply.maximumNumberOfOperands} parameter(s).`
    };
  }

  if (values.length < operationToApply.minimumNumberOfOperands) {
    return {
      column,
      operation,
      message: `Operation ${operation} requires at least ${operationToApply.minimumNumberOfOperands} parameter(s).`
    };
  }

  return null; // No errors
};

function validateFilters({ query = [], filterableAttributes }) {
  const filterErrors = [];

  // Base case: If the query is an object with a 'column', 'operation', and 'values'
  if (query.column) {
    const error = checkFilterApplicableToColumn({
      column: query.column,
      values: query.values || [],
      operation: query.operation || null,
      filterableAttributes
    });

    if (error) {
      filterErrors.push(error);
    }
  } else if (query.AND || query.OR) {
    const operator = query.AND ? "AND" : "OR";
    const subErrors = query[operator].map(subQuery => {
      return validateFilters({
        query: subQuery,
        filterableAttributes
      });
    });

    // Flatten the array of sub-errors
    filterErrors.push(...subErrors.flat());
  } else if (Array.isArray(query)) {
    const subErrors = query.map(subQuery => {
      return validateFilters({
        query: subQuery,
        filterableAttributes
      });
    });

    // Flatten the array of sub-errors
    filterErrors.push(...subErrors.flat());
  } else {
    // validation should have been checked with one of the former patterns
    // if not, we're dealing with a malformed or a malicious query pattern so reject
    filterErrors.push({ message: `malformed filter query` });
  }

  // If there are filter errors, return them; otherwise, return { valid: true }
  return filterErrors;
}

function isNumber(value) {
  // Use type coercion to attempt to convert the value to a number
  const coercedValue = Number(value);

  // Check if the coerced value is a valid number and not NaN
  return (
    Number.isNaN(coercedValue) === false && typeof coercedValue === "number"
  );
}

const checkValidation = ({
  selectFields,
  orderBy,
  filters,
  filterableAttributes,
  sortableAttributes,
  cursorValues,
  page,
  direction,
  limit
}) => {
  const selectFieldsWithoutDotNotation = selectFields.filter(
    f => !f.includes(".")
  );
  if (selectFieldsWithoutDotNotation.length) {
    return {
      valid: false,
      errors: selectFieldsWithoutDotNotation.map(c => {
        return {
          column: c,
          message: `Select field: ${c} is not using dot notation. All columns should use dot notation and should be snake_case`
        };
      })
    };
  }

  const sortableAttributesWithoutDotNotation = sortableAttributes.filter(
    f => !f.includes(".")
  );
  if (sortableAttributesWithoutDotNotation.length) {
    return {
      valid: false,
      errors: sortableAttributesWithoutDotNotation.map(c => {
        return {
          column: c,
          message: `Sortable attribute: ${c} is not using dot notation. All columns should use dot notation and should be snake_case`
        };
      })
    };
  }

  const filterableAttributesWithoutDotNotation = filterableAttributes
    .map(c => c.column)
    .filter(f => !f.includes("."));
  if (filterableAttributesWithoutDotNotation.length) {
    return {
      valid: false,
      errors: filterableAttributesWithoutDotNotation.map(c => {
        return {
          column: c,
          message: `Filterable attribute: ${c} is not using dot notation. All columns should use dot notation and should be snake_case`
        };
      })
    };
  }

  const validationResults = validateFilters({
    query: filters,
    filterableAttributes
  });

  if (validationResults.length) {
    return {
      valid: false,
      errors: validationResults
    };
  }

  const orderByColumns = orderBy.map(v => v.column);
  if (!orderByColumns.every(c => sortableAttributes.includes(c))) {
    const invalidColumns = orderByColumns.filter(
      c => !sortableAttributes.includes(c)
    );
    return {
      valid: false,
      errors: invalidColumns.map(v => {
        return {
          column: v,
          message: `column ${v} is not a valid sort column`
        };
      })
    };
  }

  if (!Array.isArray(cursorValues)) {
    return {
      valid: false,
      errors: [
        {
          message: "the cursor parameter is not a valid base64 encoded array"
        }
      ]
    };
  }

  const cursorColumns = cursorValues.map(c => c.column);
  if (
    cursorValues.length &&
    !orderByColumns.every(ob => cursorColumns.includes(ob))
  ) {
    return {
      valid: false,
      cursorError: orderByColumns
        .filter(ob => !cursorColumns.includes(ob))
        .map(orderColumn => {
          return {
            column: orderColumn,
            message: `applied sort column ${orderColumn} is missing in your cursor values`
          };
        })
    };
  }
  const cursorColumnsWithoutDotNotation = cursorColumns.filter(
    f => !f.includes(".")
  );
  if (cursorColumnsWithoutDotNotation.length) {
    return {
      valid: false,
      errors: cursorColumnsWithoutDotNotation.map(c => {
        return {
          column: c,
          message: `cursor field: ${c} is not using dot notation. All columns should use dot notation and should be snake_case`
        };
      })
    };
  }

  if (![null, "first", "last"].includes(page)) {
    return {
      valid: false,
      errors: [
        {
          message: "page parameter should be first or last or empty"
        }
      ]
    };
  }

  if (!["next", "previous"].includes(direction)) {
    return {
      valid: false,
      errors: [
        {
          message: "direction parameter should be next or previous"
        }
      ]
    };
  }

  if (!isNumber(limit)) {
    return {
      valid: false,
      errors: [
        {
          message: "page_size parameter must be a number"
        }
      ]
    };
  }

  // Continue with your validation logic if there are no errors
  return {
    valid: true
  };
};

module.exports = checkValidation;
