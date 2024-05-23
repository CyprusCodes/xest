/* eslint-disable no-console */
const hogan = require("hogan.js");
const fs = require("fs");
const mjml2html = require("mjml");
const path = require("path");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { fromEmail, replyToEmail } = require('~root/constants/emailConstants')

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: process.env.MAILGUN_API_BASE_URL
});

/**
 *
 * attachments [{filename: string, data: buffer }]
 * @returns void
 */
const sendMail = async ({
  to,
  bcc,
  template,
  version,
  metadata,
  attachment = null
}) => {
  const metadataEnriched = {
    replyTo: replyToEmail,
    ...metadata
  };
  const textFile = fs.readFileSync(
    path.join(__dirname, `./templates/${template}/${version}.txt`),
    "utf8"
  );
  const textTemplate = hogan.compile(textFile);
  const textBody = textTemplate.render(metadataEnriched);

  const subjectFile = fs.readFileSync(
    path.join(__dirname, `./templates/${template}/${version}.subject`),
    "utf8"
  );
  const subjectTemplate = hogan.compile(subjectFile);
  const subjectLine = subjectTemplate.render(metadataEnriched);

  const templateFile = fs.readFileSync(
    path.join(__dirname, `./templates/${template}/${version}.mjml`),
    "utf8"
  );
  const htmlOutput = mjml2html(templateFile);
  const emailTemplate = hogan.compile(htmlOutput.html);
  const emailBody = emailTemplate.render(metadataEnriched);

  const messageParams = {
    from: fromEmail,
    to,
    bcc,
    subject: subjectLine,
    text: textBody,
    html: emailBody,
    replyTo: replyToEmail,
    attachment: attachment
      ? [
          {
            data: attachment.data,
            filename: attachment.name
          }
        ]
      : null
  };

  try {
    const result = await mg.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageParams
    );
    return result;
  } catch (error) {
    console.error("Could not send email", error);
    return false;
  }
};

module.exports = sendMail;