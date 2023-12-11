const yup = require("yup");
const { extendSchema } = require("@sodaru/yup-to-json-schema");
const { fileSearch } = require("search-in-file");
const { globSync } = require("glob");
const { dirname, join, isAbsolute } = require("path");
const acorn = require("acorn");
const traverse = require("@babel/traverse");
const fs = require("fs").promises;
const { getSchema } = require("../../../utils/getSchema");
const validateArguments = require("../utils/validateArguments");
const yupToJsonSchema = require("../utils/yupToJsonSchema");
const findProjectRoot = require("../../../utils/findProjectRoot");

extendSchema({ addMethod: yup.addMethod, Schema: yup.Schema });

let GET_LIST_OF_DATABASE_TABLES;
let GET_DATABASE_TABLE_SCHEMA;
let FIND_FILES_BY_GLOB_PATTERN;
let FIND_FILES_BY_KEYWORD;
let SEARCH_FOR_STRING_IN_FILES;
let SEARCH_FOR_REGEX_PATTERN_IN_FILES;
let LIST_DIRECTORY_CONTENTS;
let READ_FILE_AT_PATH;
let LIST_API_ENDPOINTS;

const noParamsSchema = yup.object({});

GET_LIST_OF_DATABASE_TABLES = {
  name: "get_list_of_database_tables",
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
    return Object.keys(schema).join("\n");
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
  name: "get_table_schema",
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
  runCmd: async ({ tableName }) => {
    const schema = await getSchema();
    const table = schema[tableName];
    // todo: pretty print this in a nicer way, using less chars
    return JSON.stringify(table);
  },
};

const findFilesByGlobPatternParametersSchema = yup.object({
  globPattern: yup
    .string()
    .required("Glob pattern is required")
    .description("The glob pattern to search for in the codebase."),
  matchCase: yup
    .boolean()
    .default(false)
    .description(
      "Specify whether the search should be case-sensitive or case-insensitive."
    ),
});

FIND_FILES_BY_GLOB_PATTERN = {
  name: "find_files_by_glob_pattern",
  description: "Search files by glob pattern within the codebase",
  associatedCommands: [],
  prerequisites: [],
  parameterize: validateArguments(findFilesByGlobPatternParametersSchema),
  parameters: yupToJsonSchema(findFilesByGlobPatternParametersSchema),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ globPattern, matchCase }) => {
    const projectRootPackageJSON = await findProjectRoot();
    const { filename } = projectRootPackageJSON;
    const projectRootPath = dirname(filename);

    if (!globPattern.startsWith("**/")) {
      globPattern = `**/${globPattern}`;
    }

    const files = await globSync(globPattern, {
      cwd: projectRootPath,
      ignore: [
        "node_modules/**",
        ".xest/**",
        "migrations/**/*.js",
        "**/*.md",
        "**/*.snap",
      ],
      nocase: !matchCase,
    });

    if (!files.length) {
      return `No files found containg ${globPattern}`;
    }

    return files.join("\n");
  },
};

const findFilesByKeywordParametersSchema = yup.object({
  keyword: yup
    .string()
    .required("Keyword is required")
    .description("The keyword to search for in the codebase."),
  matchCase: yup
    .boolean()
    .default(false)
    .description(
      "Specify whether the search should be case-sensitive or case-insensitive."
    ),
});

FIND_FILES_BY_KEYWORD = {
  name: "find_files_by_keyword",
  description: "Search files by keyword in their name within the codebase",
  associatedCommands: [],
  prerequisites: [],
  parameterize: validateArguments(findFilesByKeywordParametersSchema),
  parameters: yupToJsonSchema(findFilesByKeywordParametersSchema),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ keyword, matchCase }) => {
    const projectRootPackageJSON = await findProjectRoot();
    const { filename } = projectRootPackageJSON;
    const projectRootPath = dirname(filename);

    if (!keyword.startsWith("**/")) {
      keyword = `**/${keyword}`;
    }

    const files = await globSync(keyword, {
      cwd: projectRootPath,
      ignore: [
        "node_modules/**",
        ".xest/**",
        "migrations/**/*.js",
        "**/*.md",
        "**/*.snap",
      ],
      nocase: !matchCase,
    });

    if (!files.length) {
      return `No files found containg ${keyword}`;
    }

    return files.join("\n");
  },
};

const searchForStringInFilesParametersSchema = yup.object({
  keyword: yup
    .string()
    .required("Keyword is required")
    .description("The keyword to search for in the codebase."),
  matchCase: yup
    .boolean()
    .default(false)
    .description(
      "Specify whether the search should be case-sensitive or case-insensitive."
    ),
  matchWholeWord: yup
    .boolean()
    .default(false)
    .description(
      "Specify whether to match the whole word or allow partial matches."
    ),
});

SEARCH_FOR_STRING_IN_FILES = {
  name: "search_for_string_in_files",
  description:
    "Searches for a specified string within files and provides information on matching occurrences and their file paths.",
  associatedCommands: [],
  prerequisites: [],
  parameterize: validateArguments(searchForStringInFilesParametersSchema),
  parameters: yupToJsonSchema(searchForStringInFilesParametersSchema),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ keyword, matchCase, matchWholeWord }) => {
    const projectRootPackageJSON = await findProjectRoot();
    const { filename } = projectRootPackageJSON;
    const projectRootPath = dirname(filename);

    try {
      const results = await fileSearch([projectRootPath], keyword, {
        recursive: true,
        words: matchWholeWord,
        ignoreCase: !matchCase,
        isRegex: false,
        ignoreDir: [
          `${projectRootPath}/node_modules`,
          `${projectRootPath}/.xest`,
        ],
        fileMask: "js",
      });

      if (!results.length) {
        return `No files found containing the keyword: ${keyword}`;
      }

      return `${results.length} files found with: ${keyword}\n${results.join(
        "\n"
      )}`;
    } catch (err) {
      console.log(err);
      return `Error happened whilst doing code search. Report this please.`;
    }
  },
};

const searchForRegexPatternInFilesParametersSchema = yup.object({
  regexPattern: yup
    .string()
    .required("regexPattern is required")
    .description("The regex pattern to search for in the codebase."),
});

SEARCH_FOR_REGEX_PATTERN_IN_FILES = {
  name: "search_for_regex_pattern_in_files",
  description:
    "Searches for a regex pattern within files and provides information on matching occurrences and their file paths.",
  associatedCommands: [],
  prerequisites: [],
  parameterize: validateArguments(searchForRegexPatternInFilesParametersSchema),
  parameters: yupToJsonSchema(searchForRegexPatternInFilesParametersSchema),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ regexPattern }) => {
    const projectRootPackageJSON = await findProjectRoot();
    const { filename } = projectRootPackageJSON;
    const projectRootPath = dirname(filename);

    try {
      const results = await fileSearch([projectRootPath], regexPattern, {
        recursive: true,
        words: false,
        ignoreCase: false,
        isRegex: true,
        ignoreDir: [
          `${projectRootPath}/node_modules`,
          `${projectRootPath}/.xest`,
        ],
        fileMask: "js",
      });

      if (!results.length) {
        return `No files contain the regex pattern: ${regexPattern}`;
      }

      return `${
        results.length
      } files found with the regex pattern: ${regexPattern}\n${results.join(
        "\n"
      )}`;
    } catch (err) {
      console.log(err);
      return `Error happened whilst doing code search. Report this please.`;
    }
  },
};

const listDirectoryContentsParametersSchema = yup.object({
  path: yup.string().description("the directory path to show contents"),
});

LIST_DIRECTORY_CONTENTS = {
  name: "list_directory_contents",
  description:
    "Lists contents of a given directory. It displays project root by default.",
  associatedCommands: [],
  prerequisites: [],
  parameterize: validateArguments(listDirectoryContentsParametersSchema),
  parameters: yupToJsonSchema(listDirectoryContentsParametersSchema),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ path }) => {
    const projectRootPackageJSON = await findProjectRoot();
    const { filename } = projectRootPackageJSON;
    const projectRootPath = dirname(filename);

    if (!path) {
      // if there is no path argument, then use project root as default
      path = projectRootPath;
    } else {
      // if there is a path provided, but it's not absolute, then tie it together
      if (!isAbsolute(path)) {
        path = join(projectRootPath, path);
      }
    }

    try {
      const files = await fs.readdir(path, { withFileTypes: true });
      const outputArray = [];

      outputArray.push(
        "Type  Permissions  Owner  Group  Size  Last Modified           Name\n"
      );

      for (const file of files) {
        const filePath = join(path, file.name);
        const stats = await fs.stat(filePath);

        const permissions = stats.mode.toString(8).slice(-3);
        const owner = stats.uid;
        const group = stats.gid;
        const size = stats.size;
        const modifiedTime = stats.mtime.toLocaleString();
        const fileType = file.isDirectory() ? "directory" : "file";

        outputArray.push(
          `${fileType}      ${permissions}         ${owner}      ${group}      ${size}    ${modifiedTime}     ${file.name}`
        );
      }

      return outputArray.join("\n");
    } catch (err) {
      return `Error reading directory ${path}: ${err.message}`;
    }
  },
};

const readFileParametersSchema = yup.object({
  path: yup
    .string()
    .required()
    .description("the directory path to show contents"),
});

READ_FILE_AT_PATH = {
  name: "read_file_at_path",
  description: "Read file content at a given path",
  associatedCommands: [],
  prerequisites: [],
  parameterize: validateArguments(readFileParametersSchema),
  parameters: yupToJsonSchema(readFileParametersSchema),
  rerun: true,
  rerunWithDifferentParameters: true,
  runCmd: async ({ path }) => {
    const projectRootPackageJSON = await findProjectRoot();
    const { filename } = projectRootPackageJSON;
    const projectRootPath = dirname(filename);

    if (!isAbsolute(path)) {
      path = join(projectRootPath, path);
    }

    try {
      // Check if the path exists
      const stats = await fs.stat(path);

      // Check if it's a file
      if (!stats.isFile()) {
        return `Path is not a file: ${path}`;
      }

      // Read the file contents
      const contents = await fs.readFile(path, "utf-8");
      return contents;
    } catch (error) {
      if (error.code === "ENOENT") {
        return `File not found: ${path}`;
      }

      return `Error reading file ${path}: ${err.message}`;
    }
  },
};

LIST_API_ENDPOINTS = {
  name: "list_api_endpoints",
  description: "Shows the list of API endpoints",
  associatedCommands: [],
  prerequisites: [],
  parameterize: validateArguments(noParamsSchema),
  parameters: yupToJsonSchema(noParamsSchema),
  rerun: false,
  rerunWithDifferentParameters: false,
  runCmd: async () => {
    const projectRootPackageJSON = await findProjectRoot();
    const { filename } = projectRootPackageJSON;
    const projectRootPath = dirname(filename);

    const routesFile = join(projectRootPath, "src/app/routes.js");

    try {
      // Check if the path exists
      const stats = await fs.stat(routesFile);

      // Read the file contents
      const contents = await fs.readFile(routesFile, "utf-8");

      // run through acorn
      const routesFileAST = acorn.parse(contents, { ecmaVersion: "2020" });
      let routes = [];
      let controllers = [];

      traverse.default(routesFileAST, {
        VariableDeclaration(path) {
          if (
            path.node.kind === "const" &&
            path.node.declarations &&
            path.node.declarations[0] &&
            path.node.declarations[0].init &&
            path.node.declarations[0].init.type === "CallExpression" &&
            path.node.declarations[0].init.callee.name === "require"
          ) {
            const functionName = path.node.declarations[0].id.name;
            const functionPath =
              path.node.declarations[0].init.arguments[0].value;
            controllers.push({ functionName, functionPath });
          }
        },
        CallExpression(path) {
          const { callee, arguments: argsArr } = path.node;
          if (
            callee.type === "MemberExpression" &&
            callee.object &&
            callee.object.name === "router"
          ) {
            const routeMethod = callee.property.name;
            const route = argsArr[0].value;
            const functionName = argsArr[argsArr.length - 1].name;
            const cntrllr = controllers.find(
              (c) => c.functionName === functionName
            );
            routes.push({
              route,
              method: routeMethod,
              controllerName: functionName,
              controllerPath: cntrllr ? cntrllr.functionPath : "",
            });
          }
        },
      });

      const routesList = routes
        .map((r) => `${r.method.toUpperCase()} ${r.route}`)
        .join("\n");

      return `Here are the REST API endpoints\n\n${routesList}`;
    } catch (error) {
      console.log(`Report this error to Xest: ${error.message}`);

      if (error.code === "ENOENT") {
        return `Could not identify routes within Repo.`;
      }

      return `Could not identify routes within Repo.`;
    }
  },
};

// parseModuleDependencies -- chipper integration

// IDENTIFY_DEPENDENT_FILES
// IDENTIFY_DEPENDENCIES_OF_FILE

// showControllerForApiEndpoint
// showQueryFilesForApiEndpoint
// showYupSchemaForApiEndpoint
// searchCodebaseByApiEndpoint
// callApiEndpoint
// getTestAuthToken

// writeFile
// createAPIEndpoint
// createDatabaseMigration
// runDatabaseQuery (potentially dangerous)
// runTerminalCommand

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

// lintFile

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
  FIND_FILES_BY_GLOB_PATTERN,
  FIND_FILES_BY_KEYWORD,
  SEARCH_FOR_STRING_IN_FILES,
  SEARCH_FOR_REGEX_PATTERN_IN_FILES,
  LIST_DIRECTORY_CONTENTS,
  READ_FILE_AT_PATH,
  LIST_API_ENDPOINTS,
];
