/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    {
      type: "category",
      label: "Overview",
      collapsed: false,
      items: [
        "intro",
        "what-is-xest-why",
        "installation",
        "routing",
        "CRUD",
        "Pagination",
      ],
    },
    {
      type: "category",
      label: "Development Environment",
      collapsed: true,
      items: ["docker", "mysql", "node"],
    },
    {
      type: "category",
      label: "CLI",
      collapsed: true,
      items: [
        "bootstrap",
        "run",
        "refresh",
        "query-generator",
        "seed-generator",
        "endpoint-generator",
        "xest-diagram",
      ],
    },
    {
      type: "category",
      label: "Database",
      collapsed: true,
      items: [
        "use-mysql",
        "database-schema-file",
        "seed-data-file",
        "managing-migrations",
        "query-interface",
      ],
    },

    {
      type: "category",
      label: "Security",
      collapsed: true,
      items: [
        "authentication",
        "authorization",
        "securing-api-endpoints",
        // "account-system",
        // "rate-limiting",
      ],
    },  
    {
      type: "category",
      label: "Deployment",
      collapsed: true,
      items: [
        "digital-ocean",
        "aws-deployment",
        "run-schema-and-seed",
      ],
    },
    
    /* todo
    {
      type: "category",
      label: "Testing",
      collapsed: true,
      items: ["supertest"],
    },
    */
  ],
  training: [
    {
      type: "category",
      label: "Basic tutorials",
      collapsed: false,
      items: [
        "training/xest-101",
        "training/xest-102",
        "training/xest-103",
        "training/xest-104",
        "training/xest-105",
        "training/xest-106",
      ],
    },
  ],
};
