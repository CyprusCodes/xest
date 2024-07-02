const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const handleAPIError = require("~root/utils/handleAPIError");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET
  }
});

const uppyFileDownload = async (req, res) => {
  const { fileUrl } = req.query;

  try {
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required" });
    }

    const parsedUrl = new URL(fileUrl);
    const bucketName = parsedUrl.hostname.split(".")[0];
    const fileKey = parsedUrl.pathname.substring(1);

    if (!bucketName || !fileKey) {
      return res.status(400).json({ message: "Invalid file URL" });
    }

    const params = {
      Bucket: bucketName,
      Key: fileKey
    };

    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(200).send({
      url: signedUrl,
      method: "GET"
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = uppyFileDownload;
