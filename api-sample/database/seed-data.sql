/* Initialize DB with some seed data */
USE `{{PROJECT_NAME_SNAKECASE}}_db`;

-- DONT MODIFY THIS MIGRATION
-- it is used by Xest local development pipeline
INSERT INTO
  `migrations` (name, run_on)
VALUES
  ("/20211107064324-seed-data", "20211107064324");

-- YOU CAN MODIFY BELOW THIS LINE
INSERT INTO
  user_roles (user_role_id, user_role)
VALUES
  (1, "admin"),
  (2, "user");

INSERT INTO
  users (
    user_id,
    first_name,
    last_name,
    email,
    password,
    user_role_id,
    created_at
  )
VALUES
  (
    1,
    "Ahmet",
    "Akinsql",
    "ahmet@akinsql.com",
    SHA2 (CONCAT ("12345678", "SECRET_SALT"), 224),
    1,
    "2020-11-20 12:00:00"
  ),
  (
    2,
    "Joe",
    "Bloggs",
    "joebloggs@gmail.com",
    SHA2 (CONCAT ("12345678", "SECRET_SALT"), 224),
    2,
    "2020-11-20 12:00:00"
  ),
  (
    3,
    "Jim",
    "Bloggs",
    "jimbloggs@yahoo.com",
    SHA2 (CONCAT ("12345678", "SECRET_SALT"), 224),
    2,
    "2020-11-20 12:00:00"
  ),
  (
    4,
    "Jane",
    "Doe",
    "janedoe@example.com",
    SHA2 (CONCAT ("12345678", "SECRET_SALT"), 224),
    1,
    "2020-11-20 12:00:00"
  );

INSERT INTO
  organizations (organization_name)
VALUES
  ('Organization 1'),
  ('Organization 2'),
  ('Organization 3'),
  ('Organization 4'),
  ('Organization 5');

INSERT INTO
  user_organizations (
    user_id,
    user_role_id,
    organization_id
  )
VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 1, 1),
  (4, 2, 2);

INSERT INTO
  user_organization_invitations (
    invitation_shortcode,
    organization_id,
    email,
    invited_by,
    user_role_id,
    comment,
    sent_at,
    accepted_at
  )
VALUES
  (
    'shortcode1',
    1,
    'email1@example.com',
    1,
    1,
    'Comment 1',
    '2022-01-01 00:00:00',
    '2022-01-02 00:00:00'
  ),
  (
    'shortcode2',
    1,
    'email2@example.com',
    1,
    2,
    'Comment 2',
    '2022-01-02 00:00:00',
    '2022-01-03 00:00:00'
  ),
  (
    'shortcode3',
    2,
    'email3@example.com',
    2,
    1,
    'Comment 3',
    '2022-01-03 00:00:00',
    '2022-01-04 00:00:00'
  ),
  (
    'shortcode4',
    2,
    'email4@example.com',
    2,
    2,
    'Comment 4',
    '2022-01-04 00:00:00',
    '2022-01-05 00:00:00'
  );
INSERT INTO password_recovery_requests(shortcode,requested_email,expiry_date,created_at)
VALUES ("321","ahmet@akinsql.com","2020-09-20 12:30:00","2022-01-03 12:30:00");

INSERT INTO registration_requests(
  first_name,
  last_name,
  email,
  password,
  user_type_id,
  organization_name,
  phone_number,
  registration_shortcode
) VALUES (
  'John',
  'Doe',
  'john.doe@example.com',
  SHA2 (CONCAT ("12345678", "SECRET_SALT"), 224),
  1,
  'Example Organization',
  '1234567890',
  'shortcode1'
), (
  'Jane',
  'Doe',
  'jane.doe@example.com',
  SHA2 (CONCAT ("12345678", "SECRET_SALT"), 224),
  2,
  'Example Organization 2',
  '0987654321',
  'shortcode2'
);