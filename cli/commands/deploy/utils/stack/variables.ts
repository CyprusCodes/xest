const envVars: [string, string, string][] = [
  [
    "aws:elasticbeanstalk:application:environment",
    "MAILGUN_API_KEY",
    `api_key_here`,
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "MAILGUN_API_BASE_URL",
    `https://api.eu.mailgun.net`,
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "MAILGUN_DOMAIN",
    `mg.yourdomain.com`,
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "JWT_SECRET",
    `jwt_secret_code_here`,
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "PASSWORD_SALT",
    `your_password_here`,
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "APP_BASE_URL",
    `https://app.forgefront.net`,
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "APP_ENVIRONMENT",
    `PRODUCTION`,
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "SMTP_HOST",
    process.env.SMTP_HOST || "",
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "SMTP_PORT",
    process.env.SMTP_PORT || "",
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "SMTP_USER",
    process.env.SMTP_USER || "",
  ],
  [
    "aws:elasticbeanstalk:application:environment",
    "SMTP_PASSWORD",
    process.env.SMTP_PASSWORD || "",
  ],
  ["aws:elasticbeanstalk:application:environment", "npm_config_force", "true"],
  ["aws:elasticbeanstalk:application:environment", "PORT", "8080"],
];

const solutionStackNameFile: string =
  "64bit Amazon Linux 2023 v6.1.5 running Node.js 18";

const sslArn: string =
  "arn:aws:acm:eu-west-2:626535391715:certificate/d5572ca7-612b-4181-b7a3-804a649889bb";

const officeIpCode: string = "212.175.253.84/32";

export { envVars, solutionStackNameFile, sslArn, officeIpCode };
