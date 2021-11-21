const uploadAssets = async (req, res) => {
  try {
    res.send({ url: req.file.publicURL });
  } catch (err) {
    res.send({
      error: {
        message: "Failed to upload the image."
      }
    });
  }
};

module.exports = uploadAssets;
