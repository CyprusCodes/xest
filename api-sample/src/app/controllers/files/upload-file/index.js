const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const handleAPIError = require("~root/utils/handleAPIError");
const uploadFileSchema = require("./schemas/uploadFileShema");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET
  }
});

function modifyFilename(originalFilename, userId) {
  const parts = originalFilename.split(".");
  const fileExtension = parts.pop();
  const baseName = parts.join(".");
  const uniqueId = uuidv4()
    .replace(/-/g, "")
    .substring(0, 10);

  const newFilename = `${userId}-${uniqueId}-${baseName}.${fileExtension}`;

  return newFilename;
}

const uppyFileUpload = async (req, res) => {
  const { userId } = req.user;
  const { fileName, contentType } = req.body;

  try {
    await uploadFileSchema.validate(
      { userId, fileName, contentType },
      {
        abortEarly: false
      }
    );

    const newFileName = modifyFilename(fileName, userId);
    const bucketName = process.env.S3_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: newFileName,
      ContentType: contentType,
      ACL: "private"
    };

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(201).send({
      url: signedUrl,
      method: "POST",
      fileKey: newFileName
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = uppyFileUpload;
