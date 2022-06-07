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
  favicon: "icon/favicon.ico",
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
          type: "doc",
          position: "left",
          label: "Docs",
          docId: "intro",
        },
        {
          type: "doc",
          position: "left",
          docId: "training/xest-101",
          label: "Training",
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
    algolia: {
      appId: "2DDWA1ZXGW",
      apiKey: "8db3ccb1c8e18edce8deacf6fc9d84d2",
      indexName: "xestjs"
    },
    hideableSidebar: true,
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
          editUrl:
            "https://github.com/CyprusCodes/xest/tree/main/documentation/docs/",
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