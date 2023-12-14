const express = require("express");

const postLogin = require("./controllers/users/login");
const postUser = require("./controllers/users/registerAdmin");
const putUserDetails = require("./controllers/users/putUserDetails");
const authentication = require("./middlewares/authentication");
const authorise = require("./middlewares/authorisation");
const getUserTypes = require("./controllers/users/userTypes");
const { ADMIN } = require("~root/constants/userTypes");
const postOrganization = require("./controllers/organizations/postOrganization");
const postOrganizationInvitation = require("./controllers/invitations/postOrganizationInvitation");
const postOrganizationInvitations = require("./controllers/invitations/postOrganizationInvitations");
const patchOrganizationInvitation = require("./controllers/invitations/patchOrganizationInvitation");
const deleteInvitation = require("./controllers/invitations/deleteInvitation");
const deleteInvitationByOrgUser = require("./controllers/invitations/deleteInvitationByOrgUser");
const getUserInvitations = require("./controllers/invitations/getUserInvitations");
const acceptInvitation = require("./controllers/invitations/acceptInvitation");
const postOrganizationUser = require("./controllers/organizations/postOrganizationUser");
const patchOrganizationUser = require("./controllers/organizations/patchOrganizationUser");
const deleteOrganizationUser = require("./controllers/organizations/deleteOrganizationUser");
const patchUserInvitation = require("./controllers/users/patchUserInvitation");
const getOrganizationInvitations = require("./controllers/organizations/getOrganizationInvitations");
const deleteOrganizationInvitation = require("./controllers/organizations/deleteOrganizationInvitation");
const getOrganizationUsers = require("./controllers/organizations/getOrganizationUsers");
const getUserOrganizations = require("./controllers/users/getUserOrganizations");
const getRequestByShortcode = require("./controllers/users/getRequestByShortcode");

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
router.put("/edit/user", authentication, putUserDetails);
router.get("/user-types", getUserTypes);
router.post("/organizations/create", authentication, postOrganization);
router.get("/organizations/:orgId/users", authentication, getOrganizationUsers);
router.get("/users/organizations", authentication, getUserOrganizations);
router.post(
  "/organizations/:orgId/invitation",
  authentication,
  postOrganizationInvitation
);
router.get("/edit/user/request/shortcode/:shortcode", getRequestByShortcode);
router.patch("/user/invitation-details", authentication, patchUserInvitation);
router.post(
  "/organizations/:orgId/invitations",
  authentication,
  postOrganizationInvitations
);
router.delete(
  "/organizations/:orgId/invitations/:invitationId",
  authentication,
  deleteOrganizationInvitation
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

module.exports = router;
