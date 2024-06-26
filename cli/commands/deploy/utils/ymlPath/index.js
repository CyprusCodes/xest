const appYamlContent = `
name: {{projectName}}
services:
- environment_slug: node-js
  github:
    branch: {{branchName}}
    deploy_on_push: true
    repo: {{repoUrl}}
  name: {{projectName}}
`;

const deployTemplateYamlContent = `
spec:
  name: {{projectName}}
  services:
  - environment_slug: node-js
    git:
      branch: {{branchName}}
      repo_clone_url: {{repoUrl}}
    name: {{projectName}}
`;


const configYmlContentAws = `version: 2
jobs:
  build:
    working_directory: ~/app
    docker:
      - image: circleci/node:lts
      - image: mysql:5.7
        command: --sql_mode="NO_ENGINE_SUBSTITUTION"
        environment:
          MYSQL_DATABASE: "{{projectName}}_db"
          MYSQL_USER: "user"
          MYSQL_PASSWORD: "password"
          MYSQL_ROOT_PASSWORD: "password"
    steps:
      - run: sudo apt-get update
      - run: sudo apt-get install default-mysql-server
      - run: cd ~/app
      - checkout
      - restore_cache:
          keys:
            - v2-dependencies-{{ checksum "package.json" }}
            - v2-dependencies-
      - run: npm install
      - run: npm run lint
      # - run: npm run test
      - run: mysql -uroot -ppassword -h127.0.0.1 mysql < ./database/database-schema.sql
      - run: node node_modules/db-migrate/bin/db-migrate up --config ./database/test-database.json -e test
      - run: mysql -uroot -ppassword -h127.0.0.1 mysql < ./database/seed-data.sql
      - run:
          name: Run Integration Test
          command: echo "SKIPPED" # npm run integration-test
          environment:
            DB_NAME: {{projectName}}_db
            DB_USER: root
            DB_HOST: 127.0.0.1
            DB_PASSWORD: password
      - save_cache:
          paths:
            - node_modules
          key: v2-dependencies-{{ checksum "package.json" }}
      # - run: npm run merge-coverage
      # - run: npm run print-coverage-report
  deploy:
    working_directory: ~/app
    docker:
      - image: cimg/node:18.20
    environment:
      AWS_DEFAULT_REGION: eu-west-2
    steps:
      - run: cd ~/app
      - checkout
      - restore_cache:
          keys:
            - v2-dependencies-{{ checksum "package.json" }}
            - v2-dependencies-
      - run: npm install
      - run: npm run lint
      - run: npx aws-cdk deploy --all --require-approval never
      - save_cache:
          paths:
            - node_modules
          key: v2-dependencies-{{ checksum "package.json" }}
workflows:
  version: 2
  build:
    jobs:
      - build
      - deploy:
          requires:
            - build
          filters:
            branches:
              only:
                - main`;

module.exports = {
    appYamlContent,
    deployTemplateYamlContent,
    configYmlContentAws
};
