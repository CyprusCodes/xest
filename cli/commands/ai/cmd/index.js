const yup = require("yup");
const { extendSchema } = require("@sodaru/yup-to-json-schema");
const { glob } = require("glob");
const { getSchema } = require("../../../utils/getSchema");
const validateArguments = require("../utils/validateArguments");
const yupToJsonSchema = require("../utils/yupToJsonSchema");

extendSchema({ addMethod: yup.addMethod, Schema: yup.Schema });

let GET_LIST_OF_DATABASE_TABLES;
let GET_DATABASE_TABLE_SCHEMA;
let FIND_FILES_BY_NAME;

const noParamsSchema = yup.object({});

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
  parameterize: validateArguments(noParamsSchema),
  parameters: yupToJsonSchema(noParamsSchema),
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async function () {
    const schema = await getSchema();
    return Object.keys(schema).join(",");
  },
};

const getDatabaseTableParametersSchema = yup.object({
  tableName: yup
    .string()
    .required("Table Name is required")
    .description("Name of the database table")
    .test("doesExist", "Table does not exist", async function test(tableName) {
      const schema = await getSchema();
      if (!schema[tableName]) {
        return this.createError({
          message: "tableName provided does not exist in the database",
          path: "tableName",
        });
      }
      return true;
    }),
});

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
  parameterize: validateArguments(getDatabaseTableParametersSchema),
  parameters: yupToJsonSchema(getDatabaseTableParametersSchema),
  rerun: false,
  rerunWithDifferentParameters: true,
  runCmd: async (tableName) => {
    const schema = await getSchema();
    const table = schema[tableName];
    return JSON.stringify(table);
  },
};

const findFilesByNameParametersSchema = yup.object({
  searchString: yup
    .string()
    .required("Search String is required")
    .description("The string to search for in the codebase."),
  matchCase: yup
    .boolean()
    .default(false)
    .description(
      "Specify whether the search should be case-sensitive or case-insensitive."
    ),
});

FIND_FILES_BY_NAME = {
  name: "FIND_FILES_BY_NAME",
  description:
    "Locate JavaScript modules based on their names within the codebase",
  associatedCommands: [],
  prerequisites: [],
  parameterize: validateArguments(findFilesByNameParametersSchema),
  parameters: yupToJsonSchema(findFilesByNameParametersSchema),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ searchString, matchCase }) => {
    const files = await glob(searchString, {
      ignore: ["node_modules/**", ".xest/**", "migrations/**/*.js"],
      nocase: !matchCase,
    });
    console.log(files);
  },
};

// listAPIEndpoints
// createAPIEndpoint
// createDatabaseMigration
// showControllerForApiEndpoint
// showQueryFilesForApiEndpoint
// showYupSchemaForApiEndpoint
// searchCodebaseByApiEndpoint

// readFile
// listProjectDirectoryContents
// showDependenciesFromPackageJSONFile
// showDevelopmentDependenciesFromPackageJSONFile
// showScriptsFromPackageJSONFile

// searchWithinDatabaseQueryFiles
// listEnvironmentVariables
// listServices
// listDatabaseActions
// listServerlessFunctions
// listBackgroundTasks
// listEmailTemplates
// parseModuleDependencies
// findUsagesOfModule

// get a list of dependent files
// find usages of javascript module
// lintFile
// writeFile

// test helpers
// run unit test
// run integration test
// run prettier to auto-format

// git helpers
// getGitLog(filePath: string): CommitLog[]
// Retrieves the Git log for a specific file.

// getGitDiff(filePath: string, commitHash1: string, commitHash2: string): FileDiff
// Gets the changes made to a file between two commits.

// Analyzes commit messages and changes to identify potential breaking changes.
// getAuthorOfChange(commitHash: string): string

// Determines the author of a specific change.
// getModifiedFilesInCommit(commitHash: string): string[]

// Retrieves a list of files modified in a specific commit.
// getCommitsByAuthor(author: string): Commit[]
// Lists all commits made by a specific author.

// getChangesSinceDate(date: Date): ChangeSummary
// Identifies changes made to the codebase since a specified date.

// getBranchesContainingCommit(commitHash: string): string[]
// Determines which branches contain a specific commit.

// getCommitDetails(commitHash: string): CommitDetails
// Retrieves detailed information about a specific commit.

// getFileAtCommit(filePath: string, commitHash: string): string
// Displays the content of a file at a specific commit.

// detectMergeCommits(): CommitDetails[]

//getChangedFilesInCommitRange(startCommit: string, endCommit: string): string[]
// Retrieve a list of files changed between two specified commits.

// getDiffStatForCommit(commitHash: string): DiffStat
// Get a summary of changes (additions, deletions) in a commit.
// getCommitMessagesInRange(startCommit: string, endCommit: string): string[]

// Retrieve commit messages between two specified commits.
// getAuthorsOfChangedFilesInCommit(commitHash: string): AuthorMap

// Identify authors who made changes to files in a specific commit.
// getContributorsByCodeOwnership(filePath: string): ContributorList

// Determine contributors to a specific file based on a code ownership map.
// getCommitsRelatedToIssue(issueNumber: string): CommitList

// Find commits related to a specific issue by searching commit messages.
// getFilesChangedByAuthor(author: string): ChangedFileList

// List files changed by a specific author across all commits.
// getCommitDetailsForFile(filePath: string): CommitDetailsList

// Retrieve detailed commit information for changes to a specific file.
// getMergeCommits(): CommitList

// Identify and list merge commits in the Git history.
// getFilesChangedSinceRelease(previousReleaseTag: string): ChangedFileList

// show git staged files
// show git diff
// git blame
// get_code_contributors(filePath: string): CodeContributorInfo[]

module.exports = [
  GET_LIST_OF_DATABASE_TABLES,
  GET_DATABASE_TABLE_SCHEMA,
  FIND_FILES_BY_NAME,
];
