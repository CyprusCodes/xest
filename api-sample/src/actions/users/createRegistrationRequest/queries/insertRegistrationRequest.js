const {
  submitQuery,
  getInsertId,
  sqlValueOrNull
} = require("~root/lib/database");

const insertRegistrationRequest = ({
  firstName,
  lastName,
  email,
  password,
  companyName,
  phoneNumber,
  userTypeId,
  registrationShortcode
}) => submitQuery`
    INSERT INTO registration_requests(
      first_name,
      last_name,
      email,
      password,
      organization_name,
      phone_number,
      user_type_id,
      registration_shortcode
    )
    VALUES
    (
      ${firstName},
      ${lastName},
      ${email},
      SHA2(CONCAT(${password},${process.env.PASSWORD_SALT}), 224),
      ${companyName},
      ${sqlValueOrNull(phoneNumber)},
      ${userTypeId},
      ${registrationShortcode}
    );
    `;
module.exports = getInsertId(insertRegistrationRequest);
