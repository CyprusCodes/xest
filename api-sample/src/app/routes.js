const express = require("express");

const { ADMIN } = require("~root/constants/userTypes");
const postLogin = require("./controllers/users/login");
const postUser = require("./controllers/users/registerAdmin");
const putUserDetails = require("./controllers/users/putUserDetails");
const authentication = require("./middlewares/authentication");
const authorise = require("./middlewares/authorisation");

const postRegistrationRequest = require("./controllers/users/postRegistrationRequest");
const postCompleteRegistration = require("./controllers/users/postCompleteRegistration");

const getPasswordRecoveryRequestByShortcode = require("./controllers/users/getPasswordRecoveryRequestByShortcode");
const putPassword = require("./controllers/password-recovery/putPassword");
const postRecoveryRequest = require("./controllers/password-recovery/postRecoveryRequest");

const postOrganizationInvitation = require("./controllers/invitations/postOrganizationInvitation");
const getUserInvitations = require("./controllers/invitations/getUserInvitations");
const acceptInvitation = require("./controllers/invitations/acceptInvitation");
const patchUserInvitation = require("./controllers/users/patchUserInvitation");
const getOrganizationUsers = require("./controllers/organizations/getOrganizationUsers");
const getUserOrganizations = require("./controllers/users/getUserOrganizations");

const postOrganization = require("./controllers/organizations/postOrganization");
const postOrganizationInvitations = require("./controllers/invitations/postOrganizationInvitations");
const patchOrganizationInvitation = require("./controllers/invitations/patchOrganizationInvitation");
const deleteInvitation = require("./controllers/invitations/deleteInvitation");
const postOrganizationUser = require("./controllers/organizations/postOrganizationUser");
const patchOrganizationUser = require("./controllers/organizations/patchOrganizationUser");
const deleteOrganizationUser = require("./controllers/organizations/deleteOrganizationUser");
const getOrganizationInvitations = require("./controllers/organizations/getOrganizationInvitations");

const postNewOrganization = require("./controllers/organizations/postNewOrganization");
const getOrganizationsByEmail = require("./controllers/organizations/getOrganizationsByEmail");
const getOrganizationsByUserId = require("./controllers/organizations/getOrganizationsByUserId");
const getAllUsersByOrgId = require("./controllers/userOrganizations/getAllUsersByOrgId");
const getUserOrganizationInvitations = require("./controllers/userOrganizationInvitations/getUserOrganizationInvitations");
const deleteInvitationByOrgUser = require("./controllers/invitations/deleteInvitationByOrgUser");
const postRegisterWithInvitation = require("./controllers/users/postRegisterWithInvitation");
const getRegisterWithInvitation = require("./controllers/users/getRegisterWithInvitation");

const router = express.Router();

router.post("/login", postLogin);
router.post(
  "/register/admin",
  authentication,
  authorise({ roles: [ADMIN] }),
  postUser
);
router.post("/registration-request", postRegistrationRequest);
router.post(
  "/complete-registration/:registrationShortcode",
  postCompleteRegistration
);
router.post("/recovery-request", postRecoveryRequest);
router.get(
  "/edit/user/request/shortcode/:shortcode",
  getPasswordRecoveryRequestByShortcode
);
router.put("/update-password/:shortcode", putPassword);
router.put("/edit/user", authentication, putUserDetails);

router.post("/organizations/create", authentication, postOrganization);
router.get("/organizations/:orgId/users", authentication, getOrganizationUsers);
router.get("/users/organizations", authentication, getUserOrganizations);
router.post(
  "/organizations/invitation",
  authentication,
  postOrganizationInvitation
);

router.patch("/user/invitation-details", authentication, patchUserInvitation);
router.post(
  "/organizations/:orgId/invitations",
  authentication,
  postOrganizationInvitations
);
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
router.delete("/user/invitations", authentication, deleteInvitation);
router.delete(
  "/organizations/invitations/:invitationId/:orgId",
  authentication,
  deleteInvitationByOrgUser
);
router.get("/user/invitations", authentication, getUserInvitations);
router.post("/organizations/users", authentication, postOrganizationUser);
router.patch(
  "/organizations/:orgId/users/:userId",
  authentication,
  patchOrganizationUser
);
router.delete("/organizations/users", authentication, deleteOrganizationUser);
router.post("/organization", authentication, postNewOrganization);
router.get("/organizations/:email", getOrganizationsByEmail);
router.get("/organizations", authentication, getOrganizationsByUserId);
router.get("/organizations/:orgId/users", authentication, getAllUsersByOrgId);
router.get(
  "/organizations/:orgId/invitations",
  authentication,
  getUserOrganizationInvitations
);

router.post(
  "/register-with-invitation/:invitationShortcode",
  postRegisterWithInvitation
);

router.get(
  "/register-with-invitation/:invitationShortcode",
  getRegisterWithInvitation
);

module.exports = router;
