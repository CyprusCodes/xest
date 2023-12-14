USE `{{PROJECT_NAME_SNAKECASE}}_db`;

-- DONT MODIFY THIS MIGRATION
-- it is used by Xest local development pipeline
DROP TABLE IF EXISTS `migrations`;

CREATE TABLE
  `migrations` (
    `id` int (11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `run_on` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 0 DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO
  `migrations` (name, run_on)
VALUES
  (
    "/20211107064324-database-schema",
    "20211107064324"
  );

-- YOU CAN MODIFY BELOW THIS LINE

-- USER_ROLES TABLE START
DROP TABLE IF EXISTS user_roles;
CREATE TABLE user_roles(
  user_role_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  user_role VARCHAR(100) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USER_ROLES TABLE END

-- USERS TABLE START
DROP TABLE IF EXISTS users;
CREATE TABLE
  users (
    user_id int AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(500) NOT NULL,
    user_role_id int NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_role_id) REFERENCES user_roles (user_role_id)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USERS TABLE END

-- ORGANIZATIONS TABLE START
DROP TABLE IF EXISTS organizations;
CREATE TABLE
  organizations (
    organization_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    organization_name VARCHAR(100) NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;
-- ORGANIZATIONS TABLE END

-- USER_ORGANIZATION TABLE START
DROP TABLE IF EXISTS user_organizations;
CREATE TABLE user_organizations(
  user_organization_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  user_id INT NOT NULL,
  user_role_id INT NOT NULL,
  organization_id INT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (user_role_id) REFERENCES user_roles(user_role_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USER_ORGANIZATION TABLE END

-- USER_ORGANIZATION_INVITATIONS TABLE START
DROP TABLE IF EXISTS user_organization_invitations;
CREATE TABLE user_organization_invitations(
  user_organization_invitation_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  invitation_shortcode VARCHAR(200) NOT NULL,
  organization_id INT NOT NULL,
  email VARCHAR (200) NOT NULL,
  invited_by INT NOT NULL,
  user_role_id INT NOT NULL,
  comment VARCHAR(500),
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  accepted_at DATETIME,
  declined_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_role_id) REFERENCES user_roles(user_role_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id),
  FOREIGN KEY (invited_by) REFERENCES user_organizations(user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USER_ORGANIZATION_INVITATIONS TABLE END


DROP TABLE IF EXISTS password_recovery_requests;
CREATE TABLE password_recovery_requests(
	password_recovery_request_id int AUTO_INCREMENT PRIMARY KEY,
  requested_email VARCHAR(150) NOT NULL,
	shortcode VARCHAR(40) NOT NULL UNIQUE,
  recovered_at DATETIME,
  expiry_date DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (requested_email) REFERENCES users(email)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;
