const yup = require("yup");
const selectUserById = require("./queries/selectUserId");

const uploadFileSchema = yup.object().shape({
  userId: yup
    .number()
    .required()
    .label("User ID")
    .typeError("User ID must be valid.")
    .test("doesUserExist", "User ID must exist", function test(userId) {
      return selectUserById({ userId }).then(userFound => {
        return !!userFound;
      });
    }),
  fileName: yup
    .string()
    .required()
    .label("File Name")
    .typeError("File Name must be valid.")
    .matches(
      /^[a-zA-Z0-9_.-]+$/,
      "File Name can only contain letters, numbers, underscores, dashes, and periods."
    ),
  contentType: yup
    .string()
    .required()
    .label("Content Type")
    .typeError("Content Type must be valid.")
    .oneOf(
      [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "image/gif"
        // "image/bmp",
        // "text/plain",
        // "text/csv",
        // "application/msword",
        // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // "application/vnd.ms-excel",
        // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // "application/zip",
        // "application/x-rar-compressed",
        // "audio/mpeg",
        // "audio/wav",
        // "video/mp4",
        // "video/x-msvideo"
      ],
      "Content Type must be a valid MIME type."
    )
});

module.exports = uploadFileSchema;
