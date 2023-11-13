const express = require("express");

const postLogin = require("./controllers/users/login");
const postUser = require("./controllers/users/register");
const putUserDetails = require("./controllers/users/putUserDetails");
const authentication = require("./middlewares/authentication");
const authorise = require("./middlewares/authorisation");
const getUserTypes = require("./controllers/users/userTypes");
const { ADMIN } = require("~root/constants/userTypes");
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

const router = express.Router();

// USER MANAGEMENT
router.post("/login", postLogin);
router.post(
  "/register",
  authentication,
  authorise({ roles: [ADMIN] }),
  postUser
);
router.put("/edit/user", authentication, putUserDetails);

router.get("/user-types", getUserTypes);

router.post(
  "/organizations/:orgId/invitation",
  authentication,
  postOrganizationInvitation
);

router.post(
  "/organizations/:orgId/invitations",
  authentication,
  postOrganizationInvitations
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
