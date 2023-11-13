/* eslint-disable no-console */
const hogan = require("hogan.js");
const fs = require("fs");
const mjml2html = require("mjml");
const path = require("path");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  // TODO: api key
  key: process.env.MAILGUN_API_KEY,
  url: "https://api.eu.mailgun.net"
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
    // TODO: change email
    replyToEmail: "your@email.com",
    contactNumber: "0000 00 00",
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
    // TODO: change email
    from: "name <your@email.com>",
    to,
    bcc,
    subject: subjectLine,
    text: textBody,
    html: emailBody,
    // TODO: change email
    "h:Reply-To": "your@email.com",
    attachment: attachment
      ? [
          {
            data: attachment.data,
            filename: attachment.name
          }
        ]
      : null
  };
  // TODO: change email
  try {
    const result = await mg.messages.create(
      // TODO: your domain name from mailgun
      "your.domain.com",
      messageParams
    );
    return result;
  } catch (error) {
    console.error("Could not send email", error);
    return false;
  }
};

module.exports = sendMail;
