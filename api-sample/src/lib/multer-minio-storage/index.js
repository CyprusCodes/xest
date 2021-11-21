/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Minio = require("minio");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST, // e.g: "minio.yourdomain.com"
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

const bucket = process.env.BUCKET_NAME;

function MulterMinioStorage() {}

MulterMinioStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  const uniqFileName = uuidv4();
  const fileExt = path.extname(file.originalname);
  const key = `${uniqFileName}${fileExt}`;

  return minioClient.putObject(bucket, key, file.stream, function(
    err1,
    objInfo
  ) {
    if (err1) {
      console.log(err1);
      return cb(err1);
    }
    return cb(null, {
      bucket,
      key,
      ...objInfo,
      publicURL: `https://${process.env.MINIO_HOST}/${bucket}/${key}`
    });
  });
};

MulterMinioStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  minioClient.removeObject(file.bucket, file.key, function(err) {
    if (err) {
      console.log("Unable to remove object", err);
      return cb(err);
    }
    return cb({
      removed: true
    });
  });
};

module.exports = opts => {
  return new MulterMinioStorage(opts);
};
