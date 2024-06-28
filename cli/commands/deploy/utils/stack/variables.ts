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

// solution stack https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platform-history-nodejs.html
const solutionStackNameFile: string =
  "64bit Amazon Linux 2023 v6.1.6 running Node.js 18"

// this should be a wildcard certificate arn using AWS ACM in the destination region
// *.mydomain.com
const sslArn: string =
  "arn:aws:acm:eu-west-2:XXXXXX:certificate/xxxxx-xxxxx-xxxx-xxxxx";

const officeIpCode: string = "xxx.xxx.xxxx.xx/32";

export { envVars, solutionStackNameFile, sslArn, officeIpCode };
