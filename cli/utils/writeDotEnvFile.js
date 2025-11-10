const path = require("path");
const fs = require("fs-extra");

const writeDotEnvFile = (projectRoot, appNameSnakeCase) => {
  const dotEnv = `// dev - dynamically generated
DB_NAME=${appNameSnakeCase}_db
APP_BASE_URL=http://localhost:3000
APP_ENVIRONMENT=DEVELOPMENT
DB_USER=root
DB_HOST=localhost
DB_PASSWORD=password
JWT_SECRET=SUPER_DUPER_SECRET
PASSWORD_SALT=SECRET_SALT

// check minio docs for self-hosting - S3 compatible
// MINIO_HOST=minio.yourdomain.com
// MINIO_ACCESS_KEY=
// MINIO_SECRET_KEY=

// mailgun credentials
MAILGUN_API_KEY=anythinggoeshere
MAILGUN_API_BASE_URL=anythinggoeshere
MAILGUN_DOMAIN=anythinggoeshere

// S3 credentials 
AWS_REGION=anythinggoeshere
S3_ACCESS_KEY=anythinggoeshere
S3_SECRET=anythinggoeshere
S3_BUCKET_NAME=anythinggoeshere

`;
  const filePath = path.join(projectRoot, "./.env");
  const doesItExist = fs.ensureFileSync(filePath);
  if (!doesItExist) {
    fs.writeFileSync(filePath, dotEnv);
  }
};

module.exports = writeDotEnvFile;
