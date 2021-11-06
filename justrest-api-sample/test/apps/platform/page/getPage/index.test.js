const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app");
const getStudentJWTToken = require("~test/utils/getStudentJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");

safeDescribe("#GET page/:pageId", () => {
  let studentToken;
  const testPageId = 1;

  before(async () => {
    studentToken = await getStudentJWTToken();
  });

  it("should reject requests by an unauthorized student", async () => {
    const res = await request(app)
      .get(`/page/${testPageId}`)
      .send()
      .set("Authorization", `Bearer NO-SUCH-TOKEN`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
    expect(res.body).to.eql({});
  });

  it("should reject requests to non-existent page", async () => {
    const noSuchPageId = 9119239;
    const res = await request(app)
      .get(`/page/${noSuchPageId}`)
      .send()
      .set("Authorization", `Bearer ${studentToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.eql([
      { path: "pageId", message: "Page must exist and belong to user." }
    ]);
  });

  it("should get page details", async () => {
    const res = await request(app)
      .get(`/page/${testPageId}`)
      .send()
      .set("Authorization", `Bearer ${studentToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(200);
    expect(res.body.page.pageContent).to.eql(
      "First page content of Intro to Programming chapter (chapter1)"
    );
  });
});
