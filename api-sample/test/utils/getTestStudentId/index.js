const { submitQuery, getFirst } = require("~root/lib/database");

const getTestStudent = (firstName, lastName) => submitQuery`
  SELECT user_id 
  FROM users 
  WHERE first_name = ${firstName}
  AND last_name = ${lastName}
`;

const getTestStudentId = async (firstName, lastName) => {
  const studentId = await getFirst(getTestStudent, "user_id")(
    firstName,
    lastName
  );
  if (!studentId) {
    throw new Error(
      "No Test Client was found, did you forget to run `make db-init`?"
    );
  }
  return studentId;
};

module.exports = getTestStudentId;
