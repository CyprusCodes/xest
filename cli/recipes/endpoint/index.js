const inquirer = require("inquirer");
const kebabCase = require("lodash/kebabCase");

const { execSync } = require("child_process");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
const chalk = require("chalk");
const { getSchema, getPrimaryKey, getForeignKeys, } = require("../../utils/getSchema");
const useForm = require("../../components/Form");
const { flatten } = require("lodash");
const fs = require("fs");
const path = require("path");
const startCase = require("lodash/startCase");
const camelCase = require("lodash/camelCase");
const uniqBy = require("lodash/uniqBy");
const TableSelector = require("../../components/TableSelector");
const ColumnSelector = require("../../components/ColumnSelector");
const { writeFile } = require("../../utils/createFile");
const render = require("../../utils/templateRenderer");
const toPascalCase = require("../../utils/toPascalCase");
const prettifyFile = require("../../utils/prettifyFile");
const { command } = require("execa");

let schema;
const ENDPOINT_TYPES = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    ALL: "All of the above",
}

module.exports = {
    name: "endpoint",
    userPrompt: async (projectRootPath) => {
        schema = getSchema();
        if (!schema) {
            return;
        }

        const { addField, addArrayField, getAnswers } = useForm();

        addField(() => {
            return {
                type: "list",
                name: "endpointTypes",
                message: "What type of endpoint will this be?",
                choices: Object.values(ENDPOINT_TYPES),
            };
        });

        addArrayField((values) => {
            if (values.endpointTypes === ENDPOINT_TYPES.ALL) {
                values.endpointTypes = Object.values(ENDPOINT_TYPES).slice(0, -1)
            } else {
                values.endpointTypes = [values.endpointTypes];
            }
            const tablesToSelect = Object.keys(schema)
                .map((table) => ({
                    name: table,
                    value: table,
                }))
                .filter((c) => !(values.table || []).includes(c.name))
                .filter((c) => {
                    if ((values.table || []).length > 0) {
                        return currentlySelectableTables.find((st) => st === c.name);
                    }
                    return true;
                });

            return {
                type: "list",
                name: "entityName",
                message: "Select table to database transactions",
                choices: tablesToSelect,
                default: tablesToSelect[0].value,
            };
        });

        addField((values) => {
            const { endpointTypes, entityName } = values;
            const { POST } = ENDPOINT_TYPES;

            if (!endpointTypes.includes(POST)) {
                const tablesSelected = entityName;
                const columns = flatten(tablesSelected.map((table) => schema[table]));
                const defaultColumns = columns
                    .filter((c) => c.columnKey === "PRI")
                    .map((c) => `${c.table}.${c.column}`);

                return ColumnSelector({
                    columns,
                    default: [defaultColumns[0]],
                    message: "Select columns to filter",
                    name: "filterColumns",
                });
            }

            values.filterColumns = [];
        });

        addField((values) => {
            const { endpointTypes, entityName } = values;
            const { POST, GET, PUT } = ENDPOINT_TYPES;
            const tablesSelected = entityName;
            const columns = flatten(tablesSelected.map((table) => schema[table])).filter((c) => c.columnKey !== "PRI");
            const defaultColumns = columns
                .filter((c) => c.columnKey !== "PRI")
                .map((c) => `${c.table}.${c.column}`);


            if (endpointTypes.includes(POST)) {
                return ColumnSelector({
                    columns,
                    default: defaultColumns,
                    message: "Select columns to insert",
                    name: "includeColumns",
                });
            }
            if (endpointTypes.includes(GET)) {
                return ColumnSelector({
                    columns,
                    default: defaultColumns,
                    message: "Select columns for response",
                    name: "includeColumns",
                });
            }
            if (endpointTypes.includes(PUT)) {
                return ColumnSelector({
                    columns,
                    default: defaultColumns,
                    message: "Select columns to update",
                    name: "includeColumns",
                });
            }
            values.includeColumns = [];
        });
        const responses = await getAnswers();
        return responses;
    },
    files: [
        {
            source: "actions",
            targetFileNameMapper: async ({
                projectRootPath,
                userVariables
            }) => {
                const { endpointTypes, entityName } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;

                const filePathsToGenerate = endpointTypes.map((endpoint) => {
                    let filePaths = [];
                    if (endpoint === GET) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "actions", camelCase(entityName), `fetch${toPascalCase(entityName)}`, `index.js`),
                            templatePath: path.join(__dirname, "template", "actions", "fetch.liquid"),
                        })
                    }
                    if (endpoint === POST) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "actions", camelCase(entityName), `create${toPascalCase(entityName)}`, `index.js`),
                            templatePath: path.join(__dirname, "template", "actions", "create.liquid"),
                        })
                    }
                    if (endpoint === PUT) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "actions", camelCase(entityName), `modify${toPascalCase(entityName)}`, `index.js`),
                            templatePath: path.join(__dirname, "template", "actions", "modify.liquid"),
                        })
                    }
                    if (endpoint === DELETE) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "actions", camelCase(entityName), `remove${toPascalCase(entityName)}`, `index.js`),
                            templatePath: path.join(__dirname, "template", "actions", "remove.liquid"),
                        })
                    }
                    return filePaths;
                });
                return filePathsToGenerate.flat();
            },
            targetFileWriter: async ({ userVariables, sourceFileRelative, sourceFilePath, targetFilePath }) => {
                const { endpointTypes, filterColumns, entityName, includeColumns } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;
                endpointTypes.map(async (endpoint, index) => {
                    const filePath = targetFilePath[index];
                    const templateFile = fs.readFileSync(filePath.templatePath, "utf-8");
                    let renderedTemplate;

                    if (endpoint === GET) {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filterColumns
                        });
                    }
                    if (endpoint === POST) {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            tableFields: includeColumns,
                        });
                    }
                    if (endpoint === PUT || endpoint === DELETE) {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filterColumns,
                            includeColumns
                        });
                    }

                    await writeFile(filePath.path, renderedTemplate);
                    await prettifyFile(filePath.path);
                    console.log(chalk.green`Succesfully generated. Happy hacking !`);
                })
            }
        },
        {
            source: "controllers",
            targetFileNameMapper: async ({
                projectRootPath,
                userVariables
            }) => {
                const { endpointTypes, entityName } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;


                const filePathsToGenerate = endpointTypes.map((endpoint) => {
                    let filePaths = [];
                    if (endpoint === GET) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `get${toPascalCase(entityName)}`, `index.js`),
                            templatePath: path.join(__dirname, "template", "controllers", "get.liquid"),
                        })
                    }
                    if (endpoint === POST) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `post${toPascalCase(entityName)}`, `index.js`),
                            templatePath: path.join(__dirname, "template", "controllers", "post.liquid"),
                        })
                    }
                    if (endpoint === PUT) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `put${toPascalCase(entityName)}`, `index.js`),
                            templatePath: path.join(__dirname, "template", "controllers", "put.liquid"),
                        })
                    }
                    if (endpoint === DELETE) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `delete${toPascalCase(entityName)}`, `index.js`),
                            templatePath: path.join(__dirname, "template", "controllers", "delete.liquid"),
                        })
                    }
                    return filePaths;
                });

                return filePathsToGenerate.flat();
            },
            targetFileWriter: async ({ userVariables, sourceFileRelative, sourceFilePath, targetFilePath }) => {
                const { endpointTypes, filterColumns, entityName, includeColumns } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;

                endpointTypes.map(async (endpoint, index) => {
                    const filePath = targetFilePath[index];
                    const templateFile = fs.readFileSync(filePath.templatePath, "utf-8");
                    let renderedTemplate;

                    const columns = flatten(schema[entityName]);
                    const defaultColumns = columns.map((c) => `${c.table}.${c.column}`);

                    if (endpoint === GET) {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filterColumns
                        });
                    }
                    if (endpoint === POST) {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            defaultColumns,
                            includeColumns
                        });
                    }
                    if (endpoint === PUT || endpoint === DELETE) {
                        const argsColumns = [...filterColumns, ...includeColumns];
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filterColumns,
                            includeColumns,
                            argsColumns
                        });
                    }

                    await writeFile(filePath.path, renderedTemplate);
                    await prettifyFile(filePath.path);
                    console.log(chalk.green`Succesfully generated. Happy hacking !`);
                });
            }
        },
        {
            source: "queries",
            targetFileNameMapper: async ({
                projectRootPath,
                userVariables
            }) => {
                const { endpointTypes, entityName } = userVariables;
                const { GET, POST, PUT, DELETE, ALL } = ENDPOINT_TYPES;

                const filePathsToGenerate = endpointTypes.map((endpoint) => {
                    let filePaths = [];
                    if (endpoint === GET) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "actions", camelCase(entityName), `fetch${toPascalCase(entityName)}`, "queries", `select${toPascalCase(entityName)}.js`),
                            templatePath: path.join(__dirname, "template", "queries", "select.liquid"),
                        })
                    }
                    if (endpoint === POST) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "actions", camelCase(entityName), `create${toPascalCase(entityName)}`, "queries", `insert${toPascalCase(entityName)}.js`),
                            templatePath: path.join(__dirname, "template", "queries", "insert.liquid"),
                        })
                    }
                    if (endpoint === PUT) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "actions", camelCase(entityName), `modify${toPascalCase(entityName)}`, "queries", `update${toPascalCase(entityName)}.js`),
                            templatePath: path.join(__dirname, "template", "queries", "update.liquid"),
                        })
                    }
                    if (endpoint === DELETE) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "actions", camelCase(entityName), `remove${toPascalCase(entityName)}`, "queries", `delete${toPascalCase(entityName)}.js`),
                            templatePath: path.join(__dirname, "template", "queries", "delete.liquid"),
                        })
                    }
                    return filePaths;
                });

                return filePathsToGenerate.flat();
            },
            targetFileWriter: async ({ userVariables, sourceFileRelative, sourceFilePath, targetFilePath }) => {
                const { endpointTypes, filterColumns, entityName, includeColumns } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;

                endpointTypes.map(async (endpoint, index) => {
                    const filePath = targetFilePath[index];
                    const templateFile = fs.readFileSync(filePath.templatePath, "utf-8");
                    let renderedTemplate;

                    if (endpoint === GET) {
                        const selectableColumns = includeColumns
                            .filter((c) => !filterColumns.includes(c))
                            .map((c) => c.split(".")[1]);
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filterColumns,
                            selectableColumns
                        });
                    }
                    if (endpoint === POST) {
                        const tableFields = includeColumns.map((c) => c.split(".")[1]);
                        const insertParameters = includeColumns.map((c) => camelCase(c.split(".")[1]))

                        renderedTemplate = await render(templateFile, {
                            entityName,
                            tableFields,
                            insertParameters
                        });
                    }
                    if (endpoint === PUT || endpoint === DELETE) {
                        const argsColumns = [...filterColumns, ...includeColumns];
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filterColumns,
                            includeColumns,
                            argsColumns
                        });
                    }

                    await writeFile(filePath.path, renderedTemplate);
                    await prettifyFile(filePath.path);
                    console.log(chalk.green`Succesfully generated. Happy hacking !`);
                });
            }
        }
    ]
};