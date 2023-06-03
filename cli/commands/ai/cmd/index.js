let GET_LIST_OF_DATABASE_TABLES;
let GET_DATABASE_TABLE_SCHEMA;

GET_LIST_OF_DATABASE_TABLES = {
  name: "getListOfDatabaseTables",
  description:
    "returns the full list of all tables in the MySQL database for the project",
  associatedCommands: [
    {
      command: GET_DATABASE_TABLE_SCHEMA,
      description:
        "you can use the output of table names, and read the schema for each table",
    },
  ],
  prerequisites: [],
  parameterize: () => {
    return ``;
  },
  parameters: [],
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: () => {
    return `users
            organizations
            payments
            uploads
            events
            user_events`;
  },
};

GET_DATABASE_TABLE_SCHEMA = {
  name: "getTableSchema",
  description: "returns the table schema",
  associatedCommands: [],
  prerequisites: [
    {
      command: GET_LIST_OF_DATABASE_TABLES,
      description: `each table can be investigate further with getTableSchema command`,
    },
  ],
  parameterize: () => {
    return ``;
  },
  parameters: [{
    name: "tableName",
    required: true,
    description: "name of the database table",
    type: "string"
  }],
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: () => {
    return `CREATE TABLE users (
        user_id int(11) NOT NULL AUTO_INCREMENT,
        first_name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
        last_name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
        date_of_birth date DEFAULT NULL,
        email varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
        password varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
        address varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        address_line_1 varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        address_line_2 varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        postcode varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        city varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        town varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        state varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        country varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        phone_number varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
        emergency_contact_name varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        contact_number varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        user_type_id int(11) NOT NULL,
        github_profile varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        codewars_profile varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        image varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        PRIMARY KEY (user_id),
        UNIQUE KEY email (email),
        KEY user_type_id (user_type_id),
        CONSTRAINT users_ibfk_1 FOREIGN KEY (user_type_id) REFERENCES user_types (user_type_id)
      ) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
  },
};

module.exports = [GET_LIST_OF_DATABASE_TABLES, GET_DATABASE_TABLE_SCHEMA];
