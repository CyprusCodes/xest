import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./index.module.css";
import Translate from "@docusaurus/Translate";
import { translate } from "@docusaurus/core/lib/client/exports/Translate";
import CodeBlock from "@theme/CodeBlock";

const features = [
  {
    title: translate({
      id: "homepage.features.easy-to-use.title",
      message: "Easy to Use",
      description: "Title of feature of Easy to use on the home page",
    }),
    imageUrl: "img/undraw_just_browsing.svg",
    description: (
      <Translate
        id="homepage.features.easy-to-use"
        description="Feature easy to use"
      >
        Xest framework is designed from the ground up to be easily installed and
        used to build your REST API up and running quickly.
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.modern-ui.title",
      message: "CLI Tool",
      description: "Title of feature of Modern UI on the home page",
    }),
    imageUrl: "img/undraw_responsive.svg",
    description: (
      <Translate
        values={{
          angularJS: <code>AngularJS</code>,
          reactJS: <code>ReactJS</code>,
        }}
        id="homepage.features.modern-ui"
        description="Modern UI"
      >
        {`Modern CLI tool lets you use your CLI for generating tables, seed-data, do your migrations. No need to worry about complex data structures.`}
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.pluggable-extensible.title",
      message: "Built in authentication",
      description:
        "Title of feature of pluggable and extensible on the home page",
    }),
    imageUrl: "img/undraw_switches.svg",
    description: (
      <Translate
        values={{ starters: <code>starters</code> }}
        id="homepage.features.pluggable-extensible"
        description="Feature Pluggable and Extensible"
      >
        {`Xest framework comes with built-in authentication, which allows you to save a lot of time.`}
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.connect-information.title",
      message: "All required packages in one place",
      description:
        "Title of feature of Connect your information on the home page",
    }),
    imageUrl: "img/undraw_online_connection.svg",
    description: (
      <Translate
        id="homepage.features.connect-information"
        description="Feature Connect your information"
      >
        Bind your data with single framework. XEST allows to connect to
        different data sources like MySQL databases, Rest APIs, Docker, etc.
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.customize-easy.title",
      message: "Easy configuration",
      description: "Title of feature of Customize easy on the home page",
    }),
    imageUrl: "img/undraw_add_color.svg",
    description: (
      <Translate
        id="homepage.features.customize-easy"
        description="Feature Customize easy"
      >
        Xest has multiple preconfigured built in features to allow you to build
        your API. You can form tables, edit seed-data according to your needs.
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.powered-by.title",
      message: "Built with NPM, Express JS, Node.js and Docker",
      description: "Title of feature of Powered By on the home page",
    }),
    imageUrl: "img/undraw_code_review.svg",
    description: (
      <Translate
        values={{ autowired: <code>@Autowired</code> }}
        id="homepage.features.powered-by"
        description="Built with NPM, Express JS, Node.js and Docker"
      >
        {`Uses Express JS and Node.js. Xest framework is built on top of Express.js, which is one of the most popular Node.js libraries and it takes a “convention over configuration” approach which means developers are not required to create the build process themselves. 
`}
      </Translate>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig: { customFields = {}, tagline } = {} } = context;
  return (
    <Layout title={tagline} description={customFields.description}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroProjectTagline}>
            <img
              alt="Awe logo"
              className={styles.heroLogo}
              src={useBaseUrl("img/xest-icon.png")}
            />
            <span
              className={styles.heroTitleTextHtml}
              dangerouslySetInnerHTML={{
                __html: translate({
                  id: "homepage.hero.title",
                  message:
                    "Create elegant and fast Node.js APIs in seconds with <b>Xest</b>",
                  description:
                    "Home page hero title, can contain simple html tags",
                }),
              }}
            />
          </h1>
          <div className={styles.indexCtas}>
            <Link
              className={styles.indexCtasGetStartedButton}
              to={useBaseUrl("docs/")}
            >
              <Translate>Documentation</Translate>
            </Link>
            <Link
              className={clsx("margin-left--md", styles.indexTryMeButton)}
              to={useBaseUrl("docs/installation")}
            >
              <Translate>Get Started</Translate>
            </Link>
          </div>
        </div>
      </div>
      <div className={clsx(styles.announcement, styles.announcementDark)}>
        <div className={styles.announcementInner}>
          <Translate
            values={{
              migrationGuideLink: (
                <div>
                  <br></br>
                  <Translate
                    values={{
                      c1: (
                        <CodeBlock className="language-bash step-codeblock">
                          npm i xest -g
                        </CodeBlock>
                      ),
                      c2: (
                        <CodeBlock className="language-bash step-codeblock">
                          xx my-xest-api
                        </CodeBlock>
                      ),
                      c3: (
                        <CodeBlock className="language-bash step-codeblock">
                          cd my-xest-api && xx run
                        </CodeBlock>
                      ),
                    }}
                    id="homepage.features.modern-ui"
                    description="Modern UI"
                  >
                    {`{c1} {c2} {c3}`}
                  </Translate>
                </div>
              ),
            }}
          >
            {`Get your API up and running in 3 steps 🚀 {migrationGuideLink}`}
          </Translate>
        </div>
      </div>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
