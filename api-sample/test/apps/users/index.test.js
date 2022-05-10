const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const getJWTToken = require("~test/utils/getJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#PUT user details", () => {
  let userToken;

  before(async () => {
    userToken = await getJWTToken();
  });

  it("should reject requests by an unauthenticated user", async () => {
    const res = await request(app)
      .put(`/edit/user`)
      .send()
      .set("Authorization", `Bearer NO-SUCH-TOKEN`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
    expect(res.body).to.eql({});
  });

  it("should update user details", async () => {
    const res = await request(app)
      .put(`/edit/user`)
      .send({
        firstName: "Horatio",
        lastName: "Nelson",
        password: "trafalgar1805",
        jobTitle: "Admiral"
      })
      .set("Authorization", `Bearer ${userToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(200);
  });
});
