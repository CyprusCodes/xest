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
        Xest framework is designed from the ground up to be easily installed
        and used to build your REST API up and running quickly.
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.modern-ui.title",
      message: "Modern UI",
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
        {`All AWE web components let you design modern and responsive user interfaces using a declarative API.
        Works with {angularJS} and {reactJS}.`}
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.pluggable-extensible.title",
      message: "Pluggable and Extensible",
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
        {`Extend or customize all AWE features. The Spring Boot {starters} design lets you to enable the modules and features that you need.`}
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.connect-information.title",
      message: "Connect your information",
      description:
        "Title of feature of Connect your information on the home page",
    }),
    imageUrl: "img/undraw_online_connection.svg",
    description: (
      <Translate
        id="homepage.features.connect-information"
        description="Feature Connect your information"
      >
        Bind your data to web forms easily. AWE allows to connect to different
        data sources like SQL and NoSQL databases, Rest APIs, JavaBeans, etc.
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.customize-easy.title",
      message: "Customize easy",
      description: "Title of feature of Customize easy on the home page",
    }),
    imageUrl: "img/undraw_add_color.svg",
    description: (
      <Translate
        id="homepage.features.customize-easy"
        description="Feature Customize easy"
      >
        AWE has multiple preconfigured themes and multi-language support. You
        can add custom CSS according to your needs.
      </Translate>
    ),
  },
  {
    title: translate({
      id: "homepage.features.powered-by.title",
      message: "Powered by Spring Boot with AngularJS",
      description: "Title of feature of Powered By on the home page",
    }),
    imageUrl: "img/undraw_code_review.svg",
    description: (
      <Translate
        values={{ autowired: <code>@Autowired</code> }}
        id="homepage.features.powered-by"
        description="Powered by Spring Boot with AngularJS"
      >
        {`Uses Spring 5 and Spring Boot 2. {autowired} is available for AWE components and layouts.`}
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
              src={useBaseUrl("img/logo.svg")}
            />
            <span
              className={styles.heroTitleTextHtml}
              dangerouslySetInnerHTML={{
                __html: translate({
                  id: "homepage.hero.title",
                  message:
                    "Create elegant and ligth-weight <b>REST APIs</b> in seconds. <b>Xest</b> is a modern  Javascript framework <b>simply</b> built on <b>ExpresJS</b>",
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
                  <Translate
                    values={{
                      just: (
                        <CodeBlock className="language-bash step-codeblock">
                          npm i xest -g
                        </CodeBlock>
                      ),
                      justRunCommand: (
                        <CodeBlock className="language-bash step-codeblock">
                          cd my-api && just run
                        </CodeBlock>
                      ),
                    }}
                    id="homepage.features.modern-ui"
                    description="Modern UI"
                  >
                    {`{just} {justRunCommand}`}
                  </Translate>
                </div>
              ),
            }}
          >
            {`Get started in seconds with just 2 steps.  {migrationGuideLink}`}
          </Translate>
          .
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
