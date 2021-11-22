/* list of mysql data types taken from 
    https://gist.github.com/nmsmith22389/69271303e107f1a4a0d5bcaaacafadf3
    https://www.techonthenet.com/mysql/datatypes.php
*/

const parseColumnTypeArgs = (columnType) => {
  // https://stackoverflow.com/a/36195444
  const match = columnType.match(/(?:\()(.+)+(?:\))/);

  if (!match) {
    return [];
  }

  return match[1].split(/[\s,]+/).filter(function (e) {
    return e;
  });
};

const DEFAULT_SEEDERS = {
  // (size)	Maximum size of 255 characters.	Where size is the number of characters to store. Fixed-length strings. Space padded on right to equal size characters.
  CHAR: (columnType) => {
    const [size] = parseColumnTypeArgs(columnType);
    return `datatype.string(${size})`;
  },
  // (size)	Maximum size of 255 characters.	Where size is the number of characters to store. Variable-length string.
  VARCHAR: (columnType) => {
    const [size] = parseColumnTypeArgs(columnType);
    return `datatype.string(${size})`;
  },
  // (size)	Maximum size of 255 characters.	Where size is the number of characters to store.
  TINYTEXT: (columnType) => {
    const [size] = parseColumnTypeArgs(columnType);
    return `datatype.string(${size})`;
  },
  // (size)	Maximum size of 65,535 characters.	Where size is the number of characters to store.
  TEXT: (columnType) => {
    const [size] = parseColumnTypeArgs(columnType);
    return `datatype.string(${size})`;
  },
  // (size)	Maximum size of 16,777,215 characters.	Where size is the number of characters to store.
  MEDIUMTEXT: (columnType) => {
    const [size] = parseColumnTypeArgs(columnType);
    return `datatype.string(${size})`;
  },
  // (size)	Maximum size of 4GB or 4,294,967,295 characters.	Where size is the number of characters to store.
  LONGTEXT: (columnType) => {
    const [size] = parseColumnTypeArgs(columnType);
    return `datatype.string(${size})`;
  },
  // (size)	Maximum size of 255 characters.	Where size is the number of binary characters to store. Fixed-length strings. Space padded on right to equal size characters. (Introduced in MySQL 4.1.2)
  BINARY: (columnType) => {
    const [size] = parseColumnTypeArgs(columnType);
    return `datatype.string(${size})`;
  },
  // (size)	Maximum size of 255 characters.	Where size is the number of characters to store. Variable-length string. (Introduced in MySQL 4.1.2)
  VARBINARY: (columnType) => {
    const [size] = parseColumnTypeArgs(columnType);
    return `datatype.string(${size})`;
  },
  //	Very small integer value that is equivalent to TINYINT(1). Signed values range from -128 to 127. Unsigned values range from 0 to 255.
  BIT: () => {
    return `datatype.number(${1})`;
  },
  // (m)	Very small integer value. Signed values range from -128 to 127. Unsigned values range from 0 to 255.
  TINYINT: (columnType) => {
    const [m] = parseColumnTypeArgs(columnType);
    return `datatype.number(${m})`;
  },
  // (m)	Small integer value. Signed values range from -32768 to 32767. Unsigned values range from 0 to 65535.
  SMALLINT: (columnType) => {
    const [m] = parseColumnTypeArgs(columnType);
    return `datatype.number(${m})`;
  },
  // (m)	Medium integer value. Signed values range from -8388608 to 8388607. Unsigned values range from 0 to 16777215.
  MEDIUMINT: (columnType) => {
    const [m] = parseColumnTypeArgs(columnType);
    return `datatype.number(${m})`;
  },
  // (m)	Standard integer value. Signed values range from -2147483648 to 2147483647. Unsigned values range from 0 to 4294967295.
  INT: (columnType) => {
    const [m] = parseColumnTypeArgs(columnType);
    return `datatype.number(${m})`;
  },
  // (m)	Big integer value. Signed values range from -9223372036854775808 to 1. Unsigned values range from 0 to 18446744073709551615.
  BIGINT: (columnType) => {
    const [m] = parseColumnTypeArgs(columnType);
    return `datatype.number(${m})`;
  },
  // (m,d)	Unpacked fixed point number. m defaults to 10, if not specified. d defaults to 0, if not specified.	Where m is the total digits and d is the number ofdigits after the decimal.
  DECIMAL: (columnType) => {
    const [m, d] = parseColumnTypeArgs(columnType);
    return `datatype.float(${m}, ${d})`;
  },
  // (m,d)	Single precision floating point number.	Where m is the total digits and d is the number ofdigits after the decimal.
  FLOAT: (columnType) => {
    const [m, d] = parseColumnTypeArgs(columnType);
    return `datatype.float(${m}, ${d})`;
  },
  // (m,d)	Double precision floating point number.	Where m is the total digits and d is the number ofdigits after the decimal.
  DOUBLE: (columnType) => {
    const [m, d] = parseColumnTypeArgs(columnType);
    return `datatype.float(${m}, ${d})`;
  },
  // Synonym for TINYINT(1)	Treated as a boolean data type where a value of 0 is considered to be FALSE and any other value isconsidered to be TRUE.
  BOOLEAN: () => {
    return `datatype.number(${1})`;
  },
  //Values range from '1000-01-01' to '9999-12-31'.	Displayed as 'YYYY-MM-DD'.
  DATE: () => {
    return `date.past(1)`;
  },
  // Values range from '1000-01-01 00:00:00' to '9999-12-31 23:59:59'.	Displayed as 'YYYY-MM-DD HH:MM:SS'.
  DATETIME: () => {
    return `date.past(1)`;
  },
  // (m)	Values range from '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.	Displayed as 'YYYY-MM-DD HH:MM:SS'.
  TIMESTAMP: () => {
    const d = new Date();
    let time = d.getTime();
    return `datatype.datetime(${time})`;
  },
  // Values range from '-838:59:59' to '838:59:59'.	Displayed as 'HH:MM:SS'.
  TIME: () => {
    return `12:00:00`;
  },
  //[(2|4)]	Year value as 2 digits or 4 digits.	Default is 4 digits.
  YEAR: (columnType) => {
    const [digits] = parseColumnTypeArgs(columnType);
    if (digits === 2) {
      return `datatype.number(99)`;
    }
    return `datatype.number({\"min\": 1901, \"max\": 2155})")`;
  },
  // Maximum size of 255 bytes.
  TINYBLOB: () => {
    return `datatype.string(50)`;
  },
  // (size)	Maximum size of 65,535 bytes.	Where size is the number of characters to store. (size is optional and was introduced in MySQL 4.1)
  BLOB: () => {
    return `datatype.string(50)`;
  },
  // Maximum size of 16,777,215 bytes.
  MEDIUMBLOB: () => {
    return `datatype.string(50)`;
  },
  // Maximum size of 4GB or 4,294,967,295 characters.
  LONGTEXT: () => {
    return `datatype.string(50)`;
  },
  JSON: () => {
    return `datatype.json({})`;
  },
};

const chooseDefaultSeedMethod = (column) => {
  const defaultSeeder = DEFAULT_SEEDERS[column.dataType.toUpperCase()];
  if (defaultSeeder) {
    return defaultSeeder(column.columnnType);
  }
  return null;
};

module.exports = chooseDefaultSeedMethod;
