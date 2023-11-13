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
  user_types (user_type_id, user_type)
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
    user_type_id,
    created_at
  )
VALUES
  (
    1,
    "Ahmet",
    "Akinsql",
    "ahmet@akinsql.com",
    SHA2 (CONCAT ("password", "SECRET_SALT"), 224),
    1,
    "2020-11-20 12:00:00"
  ),
  (
    2,
    "Joe",
    "Bloggs",
    "joebloggs@gmail.com",
    SHA2 (CONCAT ("password", "SECRET_SALT"), 224),
    2,
    "2020-11-20 12:00:00"
  ),
  (
    3,
    "Jim",
    "Bloggs",
    "jimbloggs@yahoo.com",
    SHA2 (CONCAT ("password", "SECRET_SALT"), 224),
    2,
    "2020-11-20 12:00:00"
  ),
  (
    4,
    "Jane",
    "Doe",
    "janedoe@example.com",
    SHA2 (CONCAT ("password", "SECRET_SALT"), 224),
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
    added_by,
    disabled_by,
    disabled_at,
    user_type_id,
    organization_id
  )
VALUES
  (1, 1, 1, '2022-01-01 00:00:00', 1, 1),
  (2, 2, 2, '2022-01-01 00:00:00', 2, 2),
  (3, 3, 3, '2022-01-01 00:00:00', 1, 3),
  (4, 4, 4, '2022-01-01 00:00:00', 2, 4);

INSERT INTO
  user_organization_invitations (
    invitation_shortcode,
    organization_id,
    email,
    invited_by,
    user_type_id,
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