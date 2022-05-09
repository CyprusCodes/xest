// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Xest",
  tagline: "REST APIs made easy",
  url: "https://xestjs.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "CyprusCodes", // Usually your GitHub org/user name.
  projectName: "xest", // Usually your repo name.
  deploymentBranch: "gh-pages",
  themeConfig: {
    navbar: {
      title: "Xest",
      logo: {
        alt: "Xest Logo",
        src: "img/xest-icon.png",
        // srcDark: 'img/logo white.svg'
      },
      hideOnScroll: true,
      items: [
        {
          type: "docsVersion",
          position: "left",
          label: "Docs",
        },
        {
          type: "doc",
          docId: "training/xest-101",
          position: "left",
          label: "Training",
          activeSidebarClassName: "navbar__link--active",
        },
        {
          to: "blog",
          label: "Blog",
          position: "left",
        },
        {
          alt: "Github repository",
          href: "https://github.com/CyprusCodes/xest",
          className: "header-gitlab-link",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Xest Framework <br/> Built with ❤️ in Cyprus ☀️.`,
    },
    /*
    algolia: {
      apiKey: "",
      indexName: "",
      contextualSearch: true,
    },
    hideableSidebar: true,
    */
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      additionalLanguages: ["java"],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/CyprusCodes/xest/tree/main/documentation/docs/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/CyprusCodes/xest/tree/main/documentation/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
};

module.exports = config;
