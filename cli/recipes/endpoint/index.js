const inquirer = require("inquirer");
const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);
const chalk = require("chalk");
const { getSchema, getForeignKeys } = require("../../utils/getSchema");
const useForm = require("../../components/Form");
const { flatten, toLower } = require("lodash");
const asyncSeries = require("../../utils/asyncSeries");
const fs = require("fs");
const path = require("path");
const camelCase = require("lodash/camelCase");
const uniqBy = require("lodash/uniqBy");
const ColumnSelector = require("../../components/ColumnSelector");
const TableSelector = require("../../components/TableSelector");
const { writeFile } = require("../../utils/createFile");
const render = require("../../utils/templateRenderer");
const toPascalCase = require("../../utils/toPascalCase");
const prettifyFile = require("../../utils/prettifyFile");

let schema;
const ENDPOINT_TYPES = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    ALL: "All of the above",
    PAGINATED_GET: "Paginated GET",
}

module.exports = {
    name: "endpoint",
    userPrompt: async () => {
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
                choices: Object.values(ENDPOINT_TYPES).slice(0, -1),
            };
        });

        addArrayField((values) => {
            if (values.endpointTypes === ENDPOINT_TYPES.ALL) {
                values.endpointTypes = Object.values(ENDPOINT_TYPES).slice(0, -2)
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
                message: "What will be the main entity for this endpoint?",
                choices: tablesToSelect,
                default: tablesToSelect[0].value,
            };
        });

        addField((values) => {
            if (values.endpointTypes.includes(ENDPOINT_TYPES.GET)) {
                return {
                    type: "list",
                    name: "isPaginated",
                    message: "Should GET endpoint be paginated?",
                    choices: ["Yes", "No"],
                };
            } else {
                values.isPaginated = "No";
            }
        });

        const { add } = addArrayField((values) => {
            if (values.isPaginated == "Yes") {
                const tablesSelected = values.table || [];
                const existingForeignKeys = flatten(
                    tablesSelected.map((table) => getForeignKeys(table))
                );
                const currentlySelectableTables = existingForeignKeys.map(
                    (x) => x.foreignKeyTo.targetTable
                );

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

                return TableSelector({
                    tables: tablesToSelect,
                    onReply: async (tableNameSelected) => {
                        const newForeignKeys = getForeignKeys(tableNameSelected);
                        const allForeignKeys = uniqBy(
                            [...newForeignKeys, ...existingForeignKeys],
                            (check) => `${check.table}.${check.column}`
                        );
                        const selectableTables = allForeignKeys.map(
                            (x) => x.foreignKeyTo.targetTable
                        );
                        const areThereAnyOtherTablesToJoin = selectableTables.some(
                            (table) => !tablesSelected.includes(table)
                        );
                        if (areThereAnyOtherTablesToJoin) {
                            const hasSelectedTables = tablesSelected.length;
                            console.log(
                                `You will be querying ${chalk.green`${hasSelectedTables ? tablesSelected.join(",") : tableNameSelected
                                    }`}`
                            );

                            const result = await inquirer.prompt({
                                type: "confirm",
                                name: "addMore",
                                message: chalk.yellow`Would you like to join onto another table?`,
                                default: "y",
                            });
                            if (result.addMore) {
                                add();
                            }
                        }
                    },
                });
            } else {
                values.joinTables = [];
            }
        });

        addField((values) => {
            if (values.isPaginated == "Yes") {
                const { entityName } = values;

                const tablesSelected = entityName;
                const columns = flatten(tablesSelected.map((table) => schema[table]));
                const defaultColumns = columns
                    .filter((c) => c.columnKey === "PRI")
                    .map((c) => `${c.table}.${c.column}`);

                return ColumnSelector({
                    columns,
                    default: [defaultColumns[0]],
                    message: "Select columns to sort for paginated GET",
                    name: "sortColumns",
                });
            } else {
                values.sortColumns = [];
            }
        });


        addField((values) => {
            const { endpointTypes, entityName } = values;
            const { POST } = ENDPOINT_TYPES;

            if (endpointTypes.length === 1 && endpointTypes.includes(POST)) {
                values.filterColumns = [];
                return;
            }

            const tablesSelected = entityName;
            const columns = flatten(tablesSelected.map((table) => schema[table]));
            const defaultColumns = columns
                .filter((c) => c.columnKey === "PRI")
                .map((c) => `${c.table}.${c.column}`);

            return ColumnSelector({
                columns,
                default: [defaultColumns[0]],
                message: "Select columns to filter (Must be atleast one filter for GET, PUT, DELETE)",
                name: "filterColumns",
            });
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
            targetFileWriter: async ({ userVariables, targetFilePath }) => {
                const { endpointTypes, filterColumns, entityName, includeColumns, isPaginated } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;
                return Promise.all(endpointTypes.map(async (endpoint, index) => {
                    const filePath = targetFilePath[index];
                    const templateFile = fs.readFileSync(filePath.templatePath, "utf-8");
                    let renderedTemplate = "";

                    let filteredColumns = [...filterColumns]
                    if (filterColumns.length === 0) {
                        const columns = flatten(schema[entityName]);
                        filteredColumns = columns
                            .filter((c) => c.columnKey === "PRI")
                            .map((c) => `${c.table}.${c.column}`);
                    }

                    if (endpoint === GET && isPaginated == 'No') {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filteredColumns
                        });
                    }
                    if (endpoint === POST) {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            tableFields: includeColumns,
                        });
                    }
                    if (endpoint === PUT || endpoint === DELETE) {
                        const argsColumns = uniqBy([...filteredColumns, ...includeColumns]);
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filteredColumns,
                            includeColumns,
                            argsColumns
                        });
                    }

                    if (renderedTemplate) {
                        await writeFile(filePath.path, renderedTemplate);
                        await prettifyFile(filePath.path);
                    }
                }))
            },
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
                            paginatedTemplatePath: path.join(__dirname, "template", "controllers", "paginatedGet.liquid"),
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
            targetFileWriter: async ({ userVariables, targetFilePath }) => {
                const { endpointTypes, filterColumns, entityName, includeColumns, sortColumns, isPaginated, table } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;

                let filteredColumns = [...filterColumns]
                if (filterColumns.length === 0) {
                    const columns = flatten(schema[entityName]);
                    filteredColumns = columns
                        .filter((c) => c.columnKey === "PRI")
                        .map((c) => `${c.table}.${c.column}`);
                }

                return Promise.all(endpointTypes.map(async (endpoint, index) => {
                    const filePath = targetFilePath[index];
                    const templateFile = fs.readFileSync(filePath.templatePath, "utf-8");
                    let renderedTemplate;

                    const columns = flatten(schema[entityName]);
                    const defaultColumns = columns.map((c) => `${c.table}.${c.column}`);

                    if (endpoint === GET) {
                        if (isPaginated == 'Yes') {
                            const paginatedTemplate = fs.readFileSync(filePath.paginatedTemplatePath, "utf-8");

                            const defaultFilterColumns = columns.filter((c) => {
                                return filteredColumns.includes(`${c.table}.${c.column}`);
                            });

                            const filtersToAssign = defaultFilterColumns.map((c) => {
                                const columnName = `${c.table}.${c.column}`;
                                const applicableFilters = getApplicableFilterForDataType(c.dataType, c.nullable);
                                return `{ column: "${columnName}", operations: [${applicableFilters.map(f => `FILTERS.${f.operator}`).join(",")}]}`
                            })

                            const selectableColumns = uniqBy([...sortColumns, ...includeColumns])

                            renderedTemplate = await render(paginatedTemplate, {
                                entityName,
                                filtersToAssign,
                                sortColumns,
                                tablesToJoin: table,
                                selectableColumns,
                                schema
                            });

                        } else {
                            renderedTemplate = await render(templateFile, {
                                entityName,
                                filteredColumns
                            });
                        }
                    }
                    if (endpoint === POST) {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            defaultColumns,
                            includeColumns
                        });
                    }
                    if (endpoint === PUT || endpoint === DELETE) {
                        const argsColumns = uniqBy([...filteredColumns, ...includeColumns]);
                        const uniqueIncludeColumns = includeColumns.filter((c) => !filteredColumns.includes(c));
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filteredColumns,
                            uniqueIncludeColumns,
                            argsColumns
                        });
                    }

                    await writeFile(filePath.path, renderedTemplate);
                    await prettifyFile(filePath.path);
                }));
            },
        },
        {
            source: "queries",
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
            targetFileWriter: async ({ userVariables, targetFilePath }) => {
                const { endpointTypes, filterColumns, entityName, includeColumns, isPaginated } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;

                let filteredColumns = [...filterColumns]
                if (filterColumns.length === 0) {
                    const columns = flatten(schema[entityName]);
                    filteredColumns = columns
                        .filter((c) => c.columnKey === "PRI")
                        .map((c) => `${c.table}.${c.column}`);
                }

                return Promise.all(endpointTypes.map(async (endpoint, index) => {
                    const filePath = targetFilePath[index];
                    const templateFile = fs.readFileSync(filePath.templatePath, "utf-8");
                    let renderedTemplate = "";

                    if (endpoint === GET && isPaginated == 'No') {
                        const selectableColumns = includeColumns
                            .filter((c) => !filteredColumns.includes(c))
                            .map((c) => c.split(".")[1]);
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            filteredColumns,
                            selectableColumns
                        });
                    }

                    const columns = flatten(schema[entityName]);
                    const schemaColumns = columns.filter((c) => {
                        return includeColumns.includes(`${c.table}.${c.column}`);
                    });

                    if (endpoint === POST) {
                        const tableFields = includeColumns.map((c) => c.split(".")[1]);

                        let defaultImport = '';
                        defaultImport = 'const { submitQuery, getInsertId } = require("~root/lib/database");'
                        if (schemaColumns.some((c) => c.nullable)) {
                            defaultImport = 'const { submitQuery, getInsertId, sqlValueOrNull } = require("~root/lib/database");'
                        }

                        renderedTemplate = await render(templateFile, {
                            entityName,
                            tableFields,
                            schemaColumns,
                            defaultImport
                        });
                    }
                    if (endpoint === PUT || endpoint === DELETE) {
                        const defaultFilterColumns = filteredColumns.map((c) => c.split(".")[1]);

                        const uniqueSchemaColumns = schemaColumns.filter((c) => {
                            return !filteredColumns.includes(`${c.table}.${c.column}`);
                        });

                        let defaultImport = '';
                        defaultImport = 'const { submitQuery, sql, sqlReduce } = require("~root/lib/database");'
                        if (schemaColumns.some((c) => c.nullable)) {
                            defaultImport = 'const { submitQuery, sql, sqlReduce, sqlValueOrNull } = require("~root/lib/database");'
                        }


                        renderedTemplate = await render(templateFile, {
                            entityName,
                            defaultFilterColumns,
                            uniqueSchemaColumns,
                            defaultImport
                        });
                    }
                    if (renderedTemplate) {
                        await writeFile(filePath.path, renderedTemplate);
                        await prettifyFile(filePath.path);
                    }
                }));
            },
        },
        {
            source: "schemas",
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
                            path: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `get${toPascalCase(entityName)}`, 'schema', `newGet${toPascalCase(entityName)}Schema.js`),
                            templatePath: path.join(__dirname, "template", "schemas", "get.liquid"),
                            queriesPath: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `get${toPascalCase(entityName)}`, 'schema', 'queries'),
                            queriesTemplatePath: path.join(__dirname, "template", "schemas", "queries", "select.liquid"),
                        })
                    }
                    if (endpoint === POST) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `post${toPascalCase(entityName)}`, 'schema', `newPost${toPascalCase(entityName)}Schema.js`),
                            templatePath: path.join(__dirname, "template", "schemas", "post.liquid"),
                            queriesPath: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `post${toPascalCase(entityName)}`, 'schema', 'queries'),
                            queriesTemplatePath: path.join(__dirname, "template", "schemas", "queries", "select.liquid"),
                        })
                    }
                    if (endpoint === PUT) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `put${toPascalCase(entityName)}`, 'schema', `newPut${toPascalCase(entityName)}Schema.js`),
                            templatePath: path.join(__dirname, "template", "schemas", "put.liquid"),
                            queriesPath: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `put${toPascalCase(entityName)}`, 'schema', 'queries'),
                            queriesTemplatePath: path.join(__dirname, "template", "schemas", "queries", "select.liquid"),
                        })
                    }
                    if (endpoint === DELETE) {
                        filePaths.push({
                            path: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `delete${toPascalCase(entityName)}`, 'schema', `newDelete${toPascalCase(entityName)}Schema.js`),
                            templatePath: path.join(__dirname, "template", "schemas", "delete.liquid"),
                            queriesPath: path.join(projectRootPath, "src", "app", "controllers", camelCase(entityName), `delete${toPascalCase(entityName)}`, 'schema', 'queries'),
                            queriesTemplatePath: path.join(__dirname, "template", "schemas", "queries", "select.liquid"),
                        })
                    }
                    return filePaths;
                });

                return filePathsToGenerate.flat();
            },
            targetFileWriter: async ({ projectRootPath, userVariables, targetFilePath }) => {
                const { endpointTypes, filterColumns, entityName, includeColumns, isPaginated } = userVariables;
                const { GET, POST, PUT, DELETE } = ENDPOINT_TYPES;
                let index = 0;

                let filteredColumns = [...filterColumns]
                if (filterColumns.length === 0) {
                    const columns = flatten(schema[entityName]);
                    filteredColumns = columns
                        .filter((c) => c.columnKey === "PRI")
                        .map((c) => `${c.table}.${c.column}`);
                }

                return asyncSeries(endpointTypes, async (endpoint) => {
                    const filePath = targetFilePath[index];

                    const templateFile = fs.readFileSync(filePath.templatePath, "utf-8");
                    let renderedTemplate;

                    const routesFilePath = path.join(projectRootPath, "src", "app", "routes.js");
                    const columns = flatten(schema[entityName]);
                    const schemaColumns = columns.filter((c) => {
                        return includeColumns.includes(`${c.table}.${c.column}`);
                    });

                    if (endpoint === GET || endpoint === DELETE) {
                        if (isPaginated == 'No') {
                            const filteredSchemaColumns = columns.filter((c) => {
                                return filteredColumns.includes(`${c.table}.${c.column}`);
                            });

                            const filteredFinalColumns = [];
                            filteredSchemaColumns.map((c) => {
                                if (c.columnKey === 'PRI') {
                                    filteredFinalColumns.push({
                                        ...c,
                                        foreignKeyTo: {
                                            targetTable: c.table,
                                            targetColumn: c.column
                                        }
                                    })
                                } else {
                                    filteredFinalColumns.push(c);
                                }
                            });

                            renderedTemplate = await render(templateFile, {
                                entityName,
                                filteredFinalColumns
                            });

                            await Promise.all(filteredFinalColumns.map(async (t) => {
                                if (t.foreignKeyTo) {
                                    const queriesFilePath = path.join(filePath.queriesPath, `select${toPascalCase(t.foreignKeyTo.targetTable)}ById.js`);
                                    const queriesTemplateFile = fs.readFileSync(filePath.queriesTemplatePath, "utf-8");

                                    const renderedQueriesTemplate = await render(queriesTemplateFile, {
                                        targetTable: t.foreignKeyTo.targetTable,
                                        targetColumn: t.foreignKeyTo.targetColumn,
                                    });

                                    await writeFile(queriesFilePath, renderedQueriesTemplate);
                                    await prettifyFile(queriesFilePath);
                                }
                            }
                            ));
                        }
                        await importControllerAsARoute(routesFilePath, endpoint, entityName);
                    }
                    if (endpoint === PUT) {
                        const filteredSchemaColumns = columns.filter((c) => {
                            return filteredColumns.includes(`${c.table}.${c.column}`);
                        });

                        const filteredFinalColumns = [];
                        filteredSchemaColumns.map((c) => {
                            if (c.columnKey === 'PRI') {
                                filteredFinalColumns.push({
                                    ...c,
                                    foreignKeyTo: {
                                        targetTable: c.table,
                                        targetColumn: c.column
                                    }
                                })
                            } else {
                                filteredFinalColumns.push(c);
                            }
                        });

                        const importsColumns = uniqBy([...schemaColumns, ...filteredFinalColumns]);
                        const uniqueSchemaColumns = schemaColumns.filter((c) => {
                            return !filteredColumns.includes(`${c.table}.${c.column}`);
                        });

                        renderedTemplate = await render(templateFile, {
                            entityName,
                            uniqueSchemaColumns,
                            filteredFinalColumns,
                            importsColumns
                        });

                        const filteredSchema = schemaColumns.filter((c) => c.columnKey === 'MUL' && c.dataType === 'int');
                        const finalFilteredSchemaColumns = [...filteredFinalColumns, ...filteredSchema];

                        const uniqueTargetTableObjectsMap = new Map();

                        finalFilteredSchemaColumns.map(item => {
                            if (item.foreignKeyTo) {
                                const targetTable = item.foreignKeyTo.targetTable;
                                if (!uniqueTargetTableObjectsMap.has(targetTable)) {
                                    uniqueTargetTableObjectsMap.set(targetTable, item);
                                }
                            }
                        });

                        const uniqueTargetTableObjects = Array.from(uniqueTargetTableObjectsMap.values());
                        await Promise.all(uniqueTargetTableObjects.map(async (t) => {
                            if (t.foreignKeyTo) {
                                const queriesFilePath = path.join(filePath.queriesPath, `select${toPascalCase(t.foreignKeyTo.targetTable)}ById.js`);
                                const queriesTemplateFile = fs.readFileSync(filePath.queriesTemplatePath, "utf-8");

                                const renderedQueriesTemplate = await render(queriesTemplateFile, {
                                    targetTable: t.foreignKeyTo.targetTable,
                                    targetColumn: t.foreignKeyTo.targetColumn,
                                });

                                await writeFile(queriesFilePath, renderedQueriesTemplate);
                                await prettifyFile(queriesFilePath);
                            }
                        }));

                        await importControllerAsARoute(routesFilePath, endpoint, entityName);
                    }
                    if (endpoint === POST) {
                        renderedTemplate = await render(templateFile, {
                            entityName,
                            schemaColumns
                        });

                        const filteredSchema = schemaColumns.filter((c) => c.columnKey === 'MUL' && c.dataType === 'int');
                        const uniqueTargetTableObjectsMap = new Map();

                        filteredSchema.map(item => {
                            const targetTable = item.foreignKeyTo.targetTable;
                            if (!uniqueTargetTableObjectsMap.has(targetTable)) {
                                uniqueTargetTableObjectsMap.set(targetTable, item);
                            }
                        });
                        const uniqueTargetTableObjects = Array.from(uniqueTargetTableObjectsMap.values());

                        await Promise.all(uniqueTargetTableObjects.map(async (t) => {
                            if (t.foreignKeyTo) {
                                const queriesFilePath = path.join(filePath.queriesPath, `select${toPascalCase(t.foreignKeyTo.targetTable)}ById.js`);
                                const queriesTemplateFile = fs.readFileSync(filePath.queriesTemplatePath, "utf-8");

                                const renderedQueriesTemplate = await render(queriesTemplateFile, {
                                    targetTable: t.foreignKeyTo.targetTable,
                                    targetColumn: t.foreignKeyTo.targetColumn,
                                });

                                await writeFile(queriesFilePath, renderedQueriesTemplate);
                                await prettifyFile(queriesFilePath);
                            }
                        }
                        ));

                        await importControllerAsARoute(routesFilePath, endpoint, entityName);
                    }

                    if (renderedTemplate) {
                        // write schema file
                        await writeFile(filePath.path, renderedTemplate);
                        await prettifyFile(filePath.path);
                    }
                    index = index + 1;
                });
            },
        },
    ],
    postGeneration: async () => {
        console.log(chalk.green`Succesfully generated. Happy developing!`);
    }
};

const dataFilters = [
    {
        "operator": "equals",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT",
            "BINARY",
            "VARBINARY",
            "BIT",
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE",
            "BOOLEAN",
            "DATE",
            "DATETIME",
            "TIMESTAMP",
            "TIME",
            "YEAR",
            "TINYBLOB",
            "BLOB",
            "MEDIUMBLOB",
            "JSON"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "notEquals",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT",
            "BINARY",
            "VARBINARY",
            "BIT",
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE",
            "BOOLEAN",
            "DATE",
            "DATETIME",
            "TIMESTAMP",
            "TIME",
            "YEAR",
            "TINYBLOB",
            "BLOB",
            "MEDIUMBLOB",
            "JSON"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "greaterThan",
        "applicableDataTypes": [
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "greaterThanOrEqual",
        "applicableDataTypes": [
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "lessThan",
        "applicableDataTypes": [
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "lessThanOrEqual",
        "applicableDataTypes": [
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "isNull",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT",
            "BINARY",
            "VARBINARY",
            "BIT",
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE",
            "BOOLEAN",
            "DATE",
            "DATETIME",
            "TIMESTAMP",
            "TIME",
            "YEAR",
            "TINYBLOB",
            "BLOB",
            "MEDIUMBLOB",
            "JSON"
        ],
        "applicableToNullableFields": true
    },
    {
        "operator": "isNotNull",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT",
            "BINARY",
            "VARBINARY",
            "BIT",
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE",
            "BOOLEAN",
            "DATE",
            "DATETIME",
            "TIMESTAMP",
            "TIME",
            "YEAR",
            "TINYBLOB",
            "BLOB",
            "MEDIUMBLOB",
            "JSON"
        ],
        "applicableToNullableFields": true
    },
    {
        "operator": "in",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT",
            "BINARY",
            "VARBINARY",
            "BIT",
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE",
            "BOOLEAN",
            "DATE",
            "DATETIME",
            "TIMESTAMP",
            "TIME",
            "YEAR",
            "TINYBLOB",
            "BLOB",
            "MEDIUMBLOB",
            "JSON"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "notIn",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT",
            "BINARY",
            "VARBINARY",
            "BIT",
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE",
            "BOOLEAN",
            "DATE",
            "DATETIME",
            "TIMESTAMP",
            "TIME",
            "YEAR",
            "TINYBLOB",
            "BLOB",
            "MEDIUMBLOB",
            "JSON"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "between",
        "applicableDataTypes": [
            "TINYINT",
            "SMALLINT",
            "MEDIUMINT",
            "INT",
            "BIGINT",
            "DECIMAL",
            "FLOAT",
            "DOUBLE"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "isDateAfter",
        "applicableDataTypes": [
            "DATE",
            "DATETIME",
            "TIMESTAMP"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "isDateOnOrAfter",
        "applicableDataTypes": [
            "DATE",
            "DATETIME",
            "TIMESTAMP"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "isDateBefore",
        "applicableDataTypes": [
            "DATE",
            "DATETIME",
            "TIMESTAMP"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "isDateOnOrBefore",
        "applicableDataTypes": [
            "DATE",
            "DATETIME",
            "TIMESTAMP"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "isDateBetween",
        "applicableDataTypes": [
            "DATE",
            "DATETIME",
            "TIMESTAMP"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "contains",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "startsWith",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "endsWith",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "containsIgnoreCase",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "startsWithIgnoreCase",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "endsWithIgnoreCase",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT"
        ],
        "applicableToNullableFields": false
    },
    {
        "operator": "matchesRegExp",
        "applicableDataTypes": [
            "CHAR",
            "VARCHAR",
            "TINYTEXT",
            "TEXT",
            "MEDIUMTEXT",
            "LONGTEXT"
        ],
        "applicableToNullableFields": false
    }
];

const getApplicableFilterForDataType = (dataType, isNullable) => {
    return dataFilters.filter(operator => {
        const operatorApplicateToType = operator.applicableDataTypes.map(v => v.toLowerCase()).includes(dataType.toLowerCase());
        if (operator.applicableToNullableFields) {
            return isNullable;
        }
        return operatorApplicateToType;
    })
}

async function importControllerAsARoute(routesFilePath, endpoint, entityName) {
    const routesFileContent = fs.readFileSync(routesFilePath, 'utf8');
    const routesContent = `router.${toLower(endpoint)}("/${camelCase(entityName)}", /*- TODO: auth middleware -*/ ${toLower(endpoint)}${toPascalCase(entityName)})\n`;
    const targetLine = 'module.exports = router;';
    const position = routesFileContent.indexOf(targetLine);

    const newRoutesFileContent = routesFileContent.slice(0, position) + routesContent + routesFileContent.slice(position);
    await fs.writeFileSync(routesFilePath, newRoutesFileContent);
    await prettifyFile(routesFilePath);

    const requiredFileContent = fs.readFileSync(routesFilePath, 'utf8');
    const requiredContent = `const ${toLower(endpoint)}${toPascalCase(entityName)} = require("./controllers/${camelCase(entityName)}/${toLower(endpoint)}${toPascalCase(entityName)}");\n`;

    const lastRequireIndex = requiredFileContent.lastIndexOf("require(");
    const lastRequireLineStart = requiredFileContent.indexOf(";", lastRequireIndex);
    const beforeLastRequire = requiredFileContent.slice(0, lastRequireLineStart + 1);
    const afterLastRequire = requiredFileContent.slice(lastRequireLineStart + 1);

    const modifiedContent = beforeLastRequire + requiredContent + afterLastRequire;

    await fs.writeFileSync(routesFilePath, modifiedContent);
    await prettifyFile(routesFilePath);
}
