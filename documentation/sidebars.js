/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// overview
// development environment
// CLI
//database Model
// Security
// Testing

module.exports = {
  docs: [
    {
      type: "category",
      label: "Overview",
      collapsed: false,
      items: ["what-is-xest-why", "installation", "routing", "CRUD"],
    },
    {
      type: "category",
      label: "Development Environment",
      collapsed: false,
      items: ["docker", "mysql", "node"],
    },
    {
      type: "category",
      label: "CLI",
      collapsed: false,
      items: [
        "bootstrap",
        "run",
        "refresh",
        "query-generator",
        "seed-generator",
      ],
    },
    {
      type: "category",
      label: "Database Model",
      collapsed: false,
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
      label: "Xest framework",
      collapsed: false,
      items: ["intro", "purpose", "architecture", "security"],
    },
    {
      type: "category",
      label: "Getting Started",
      collapsed: true,
      items: [
        "installation",
        {
          Configuration: [
            "maven",
            {
              type: "category",
              label: "Modules",
              collapsed: true,
              items: [
                "annotations",
                "developer-tools",
                "builder",
                "rest",
                "scheduler",
                "notifier",
                "database-migration",
              ],
            },
            "properties",
            "application-options",
            "session",
          ],
        },
        "deployment",
      ],
    },
    {
      type: "category",
      label: "CLI Reference",
      items: [
        "api/screens",
        "api/menu",
        "api/enumerate",
        "api/query",
        "api/maintain",
        "api/service",
        "api/queues",
        "api/email",
        "api/i18n-internationalization",
      ],
    },
    {
      type: "category",
      label: "Guides",
      collapsed: true,
      items: [
        "guides/project-structure",
        "guides/scheduler",
        "guides/notifier",
        "guides/selenium-testing",
        "guides/print-engine",
        "guides/debugging",
        "guides/validation",
        "guides/v4-migration",
        "guides/default-screens",
      ],
    },
  ],
  screens: [
    {
      type: "ref",
      id: "api/screens",
    },
    {
      type: "category",
      label: "API Reference",
      collapsed: false,
      items: [
        "api/screen",
        "api/template",
        "api/layout",
        "api/tags",
        "api/window",
        "api/resizable",
        "api/button",
        "api/criteria",
        "api/tab-and-tabcontainer",
        "api/wizard-and-wizard-panel",
        "api/accordion",
        "api/grids",
        "api/pivot-table",
        "api/context-menu",
        "api/messages",
        "api/info",
        "api/include",
        "api/dialog",
        "api/chart",
        "api/actions",
        "api/dependencies",
      ],
    },
  ],
  schedule: [
    {
      type: "ref",
      id: "guides/scheduler",
    },
    {
      type: "category",
      label: "Schedule Task",
      collapsed: false,
      items: ["guides/schedule-configuration", "guides/dependency-task"],
    },
  ],
  training: [
    {
      type: "category",
      label: "Basic tutorials",
      collapsed: false,
      items: [
        "training/awe-101",
        "training/awe-102",
        "training/awe-103",
        "training/awe-104",
        "training/awe-105",
        "training/awe-106",
        "training/awe-107",
        "training/awe-108",
      ],
    },
  ],
};
