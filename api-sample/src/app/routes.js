const express = require("express");

const { ADMIN } = require("~root/constants/userTypes");
const postLogin = require("./controllers/users/login");
const postUser = require("./controllers/users/registerAdmin");
const putUserDetails = require("./controllers/users/putUserDetails");
const authentication = require("./middlewares/authentication");
const authorise = require("./middlewares/authorisation");
const getUserTypes = require("./controllers/users/userTypes");

// const postOrganization = require("./controllers/organizations/postOrganization");
const postOrganizationInvitation = require("./controllers/invitations/postOrganizationInvitation");
// const postOrganizationInvitations = require("./controllers/invitations/postOrganizationInvitations");
const patchOrganizationInvitation = require("./controllers/invitations/patchOrganizationInvitation");
const deleteInvitation = require("./controllers/invitations/deleteInvitation");
const getUserInvitations = require("./controllers/invitations/getUserInvitations");
const acceptInvitation = require("./controllers/invitations/acceptInvitation");
const postOrganizationUser = require("./controllers/organizations/postOrganizationUser");
const patchOrganizationUser = require("./controllers/organizations/patchOrganizationUser");
const deleteOrganizationUser = require("./controllers/organizations/deleteOrganizationUser");
const patchUserInvitation = require("./controllers/users/patchUserInvitation");
const getOrganizationInvitations = require("./controllers/organizations/getOrganizationInvitations");
const getOrganizationUsers = require("./controllers/organizations/getOrganizationUsers");
const getUserOrganizations = require("./controllers/users/getUserOrganizations");

const getPasswordRecoveryRequestByShortcode = require("./controllers/users/getPasswordRecoveryRequestByShortcode");
const putPassword = require("./controllers/password-recovery/putPassword");
const postRecoveryRequest = require("./controllers/password-recovery/postRecoveryRequest");

const postRegistrationRequest = require("./controllers/users/postRegistrationRequest");
const postCompleteRegistration = require("./controllers/users/postCompleteRegistration");

const router = express.Router();

// USER MANAGEMENT
router.post("/login", postLogin);

router.post(
  "/register/admin",
  authentication,
  authorise({ roles: [ADMIN] }),
  postUser
);
router.post("/register", postUser);

router.post("/registration-request", postRegistrationRequest);

router.post(
  "/complete-registration/:registrationShortcode",
  postCompleteRegistration
);

router.put("/edit/user", authentication, putUserDetails);
router.get("/user-types", getUserTypes);
// router.post("/organizations/create", authentication, postOrganization);
router.get("/organizations/:orgId/users", authentication, getOrganizationUsers);
router.get("/users/organizations", authentication, getUserOrganizations);
router.post(
  "/organizations/invitation",
  authentication,
  postOrganizationInvitation
);
router.get(
  "/edit/user/request/shortcode/:shortcode",
  getPasswordRecoveryRequestByShortcode
);
router.patch("/user/invitation-details", authentication, patchUserInvitation);
// router.post(
//   "/organizations/:orgId/invitations",
//   authentication,
//   postOrganizationInvitations
// );

router.get(
  "/organizations/:orgId/invitations",
  authentication,
  getOrganizationInvitations
);
router.patch(
  "/organizations/:orgId/invitation",
  authentication,
  patchOrganizationInvitation
);
router.patch(
  "/user/invitations/:invitationId",
  authentication,
  acceptInvitation
);
router.delete(
  "/user/invitations/:invitationId",
  authentication,
  deleteInvitation
);
router.delete(
  "/organizations/invitations/:invitationId/:orgId",
  authentication,
  deleteInvitationByOrgUser
);
router.get("/user/invitations", authentication, getUserInvitations);
router.patch(
  "/user/invitations/:invitationId",
  authentication,
  acceptInvitation
);
router.post(
  "/organizations/:orgId/users",
  authentication,
  postOrganizationUser
);
router.patch(
  "/organizations/:orgId/users/:userId",
  authentication,
  patchOrganizationUser
);
router.delete(
  "/organizations/:orgId/users/:orgUserId",
  authentication,
  deleteOrganizationUser
);

router.post("/recovery-request", postRecoveryRequest);

router.put("/update-password/:shortcode", putPassword);

module.exports = router;
