// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Xest Framework",
  tagline: "",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/cc_logo2.png",
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Xest",
      logo: {
        alt: "Awe framework Logo",
        src: "img/cc_logo2.png", 
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
          to: "blog",
          label: "Blog",
          position: "left",
        },
        {
          alt: "GitHub repository",
          href: "https://github.com/CyprusCodes",
          className: "header-gitlab-link",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "docs/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/awe",
            },
            {
              label: "Forum",
              href: "https://forum.aweframework.com/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label:"GitHub repository",
              href: "https://github.com/CyprusCodes",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}  Cyprus Codes, Xest framework`,
    },
    algolia: {
      apiKey: "bbb756b741640f975ac0158bcedcefcb",
      indexName: "aweframework_awe",
      contextualSearch: true,
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
          editUrl: "https://github.com/facebook/docusaurus/edit/main/website/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/edit/main/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
};

module.exports = config;
