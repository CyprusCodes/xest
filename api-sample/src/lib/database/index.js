/* eslint-disable no-underscore-dangle */
const mysql = require("mysql");
const { promisify } = require("es6-promisify");
const path = require("path");
const get = require("lodash/get");
const camelCase = require("lodash/camelCase");
const mapKeys = require("lodash/mapKeys");
const monitoring = require("~root/utils/monitoring");
const parseMySQLConnectionString = require("~root/utils/parseMySQLConnectionString");
const nestTabularData = require("~root/utils/nestTabularData");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});

// DATABASE_URL is available on DOKKU
const connectionDetails = process.env.DATABASE_URL
  ? parseMySQLConnectionString(process.env.DATABASE_URL)
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    };

const CONFIG = {
  ...connectionDetails,
  timezone: "utc",
  transaction: true,
  charset: "utf8mb4",
  typeCast: (field, next) => {
    if (
      field.type === "DATETIME" ||
      field.type === "DATE" ||
      field.type === "TIMESTAMP"
    ) {
      return field.string();
    }
    return next();
  },
  multipleStatements: true
};

let connection = mysql.createConnection(CONFIG);

let promisifiedQueryFunction;
let promisifiedStartTransaction;
let promisifedCommitTransaction;
let startTransaction;
let commitTransaction;
let promisifiedRollbackTransaction;
let rollbackTransaction;
let sqlValueOrNull;
let sql;
let sqlId;
let submitQuery;
let disconnect;

let transactionStack = [];
let queryLog = [];
const _getTransactionStack = () => transactionStack;
const _getQueryLog = () => queryLog;
// eslint-disable-next-line no-return-assign
const _resetTestQueryLog = () => (queryLog = []);
const ESCAPE_SYMBOL = Symbol("ESCAPED");

const initConnection = newConnection => {
  transactionStack = [];
  promisifiedQueryFunction = promisify(newConnection.query.bind(newConnection));
  promisifiedStartTransaction = promisify(
    newConnection.beginTransaction.bind(newConnection)
  );
  promisifedCommitTransaction = promisify(
    newConnection.commit.bind(newConnection)
  );
  startTransaction = () => {
    let final;
    const traceLabel = `${new Date()}: Uncomitted Transaction @`;
    const stack = new Error(traceLabel);

    if (transactionStack.length > 0) {
      // already within a transaction, skip starting new one.
      final = Promise.resolve();
    } else {
      final = promisifiedStartTransaction();
    }
    transactionStack.push(stack);
    return final;
  };
  commitTransaction = () => {
    const lastTransaction = transactionStack.pop();
    if (!lastTransaction) {
      // eslint-disable-next-line no-console
      console.trace("committing non-existing transaction");
    }
    if (transactionStack.length === 0) {
      // reached outermost transaction, COMMIT now.
      return promisifedCommitTransaction();
    }
    return Promise.resolve();
  };
  promisifiedRollbackTransaction = promisify(
    newConnection.rollback.bind(newConnection)
  );
  rollbackTransaction = () => {
    const lastTransaction = transactionStack.pop();
    if (!lastTransaction) {
      // eslint-disable-next-line no-console
      console.trace("rolling back non-existing transaction");
    }
    transactionStack = []; // clear stack
    return promisifiedRollbackTransaction();
  };
  sql = (strings, ...rest) => {
    let escapedQuery = "";
    strings.forEach((string, i) => {
      const paramToEscape = rest[i];
      if (paramToEscape !== undefined) {
        const hasItBeenEscapedBefore =
          get(paramToEscape, "_escaped_before") === ESCAPE_SYMBOL;
        if (!hasItBeenEscapedBefore) {
          escapedQuery =
            escapedQuery + string + newConnection.escape(paramToEscape);
        } else {
          escapedQuery = escapedQuery + string + paramToEscape;
        }
      } else {
        escapedQuery += string;
      }
    });
    // eslint-disable-next-line no-new-wrappers
    const query = new String(escapedQuery);
    query._escaped_before = ESCAPE_SYMBOL;
    return query;
  };

  sqlId = identifier => {
    const escapedId = newConnection.escapeId(identifier);
    // eslint-disable-next-line no-new-wrappers
    const query = new String(escapedId);
    query._escaped_before = ESCAPE_SYMBOL;
    return query;
  };

  sqlValueOrNull = val =>
    val === undefined || val === null ? sql`NULL` : sql`${val}`;

  submitQuery = (strings, ...rest) => {
    const escapedQuery = sql(strings, ...rest).toString();
    if (strings[0].toLowerCase().includes("debug")) {
      // eslint-disable-next-line no-console
      console.log(`\x1B[36m${escapedQuery}\x1B[39m`);
    }
    if (process.env.NODE_ENV === "test") {
      queryLog.push(escapedQuery);
    }
    return promisifiedQueryFunction(escapedQuery);
  };

  disconnect = async () => {
    newConnection.end();
  };
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const MAX_CONN_RETRIES = 10;
const RETRY_DELAY = 1000;
let connectionRetries = 10;

function handleDisconnect(client) {
  client.on("error", async function handleError(error) {
    const currentRetryCount = MAX_CONN_RETRIES - connectionRetries + 1;
    if (!error.fatal) {
      return;
    }

    if (error.code !== "PROTOCOL_CONNECTION_LOST") {
      monitoring.error(error);
    }

    await sleep(RETRY_DELAY * currentRetryCount);
    // skip alert on for first retry
    if (currentRetryCount > 1) {
      monitoring.log(
        `> ${currentRetryCount} - Re-connecting lost MySQL connection: ${error.stack}`
      );
    }
    connection = mysql.createConnection(CONFIG);
    connection.connect(function handleConnectionError(err) {
      if (err) {
        connectionRetries -= 1;
        if (connectionRetries < 1) {
          monitoring.error(
            `Re-connecting to MySQL instance failed after ${MAX_CONN_RETRIES} retries.`
          );
          process.exit(1);
        }
        handleError(err);
      } else {
        connectionRetries = MAX_CONN_RETRIES;
      }
    });
    handleDisconnect(connection);
    initConnection(connection);
  });
}

const camelKeys = query => {
  return (...args) => {
    return query(...args).then(results => {
      return results.map(d => mapKeys(d, (v, k) => camelCase(k)));
    });
  };
};

const getFirst = (query, propertyToGet = null, defaultValue = null) => {
  return (...args) => {
    return query(...args).then(results => {
      const pathToGet = propertyToGet ? `[0].${propertyToGet}` : "[0]";
      return get(results, pathToGet, defaultValue);
    });
  };
};

const getProperty = (query, propertyToGet, defaultValue = null) => {
  return (...args) => {
    return query(...args).then(results => {
      return results.map(result =>
        get(result, `${propertyToGet}`, defaultValue)
      );
    });
  };
};

const sqlReduce = (accumulator, currentValue) =>
  sql`${accumulator}, ${currentValue}`;

const sqlReduceWithUnion = (accumulatedQuery, currentQuery) => sql`
  ${accumulatedQuery}
  UNION ALL
  ${currentQuery}
`;

/*
We use the assumption that insert IDs will always be sequential.
This assumption is valid so long as the innodb_autoinc_lock_mode is set to 1 or 2
To check mode do `SELECT @@GLOBAL.innodb_autoinc_lock_mode;`
0/1 = good
2 = bad
https://stackoverflow.com/a/34201317
https://www.percona.com/blog/2017/07/26/what-is-innodb_autoinc_lock_mode-and-why-should-i-care/
*/
const getInsertIds = query => {
  return (...args) => {
    return query(...args).then(results => {
      const noIds = results.affectedRows - results.changedRows;
      const firstInsertId = results.insertId;
      const insertIds = [];
      for (let i = 0; i < noIds; i += 1) {
        insertIds.push(firstInsertId + i);
      }
      return insertIds;
    });
  };
};

const getInsertId = query => {
  return (...args) => {
    return query(...args).then(results => {
      return results.insertId;
    });
  };
};

const nest = (query, nestOptions) => {
  return (...args) => {
    return query(...args).then(results => {
      return nestTabularData(results, nestOptions);
    });
  };
};

handleDisconnect(connection);
initConnection(connection);

module.exports = {
  disconnect,
  sql,
  sqlId,
  sqlValueOrNull,
  submitQuery,
  startTransaction,
  commitTransaction,
  rollbackTransaction,
  _getTransactionStack, // for testing only
  _getQueryLog, // for testing only
  _resetTestQueryLog, // for testing only
  camelKeys,
  getFirst,
  getProperty,
  getInsertIds,
  getInsertId,
  sqlReduce,
  sqlReduceWithUnion,
  nest
};