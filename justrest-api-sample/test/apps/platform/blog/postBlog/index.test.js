const { expect } = require("chai");
const request = require("supertest");
const app = require("~root/app/index");
const getStudentJWTToken = require("~test/utils/getStudentJWTToken");
const safeDescribe = require("~test/utils/safeDescribe");
const deleteBlogCommentById = require("./queries/deleteBlogCommentById");

safeDescribe("#POST blog/:blogId", () => {
  let studentToken;
  let insertedBlogCommentId;
  const testBlogId = 1;

  before(async () => {
    studentToken = await getStudentJWTToken();
  });

  after(async () => {
    await deleteBlogCommentById({ blogCommentId: insertedBlogCommentId });
  });

  it("should reject requests by an unauthorized student", async () => {
    const res = await request(app)
      .post(`/blog/${testBlogId}/comment/post`)
      .send({ commentContent: "This is a comment." })
      .set("Authorization", `Bearer NO-SUCH-TOKEN`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(403);
    expect(res.body).to.eql({});
  });

  it("should reject requests to non-existent page", async () => {
    const noSuchBlogId = 9119239;
    const res = await request(app)
      .post(`/blog/${noSuchBlogId}/comment/post`)
      .send({ commentContent: "This is a comment." })
      .set("Authorization", `Bearer ${studentToken}`)
      .set("Accept", "application/json");
    expect(res.statusCode).to.equal(400);
    expect(res.body).to.eql([
      {
        message: "Blog must exist",
        path: "blogId"
      }
    ]);
  });

  it("should get page details", async () => {
    const res = await request(app)
      .post(`/blog/${testBlogId}/comment/post`)
      .send({ commentContent: "This is a comment." })
      .set("Authorization", `Bearer ${studentToken}`)
      .set("Accept", "application/json");
    insertedBlogCommentId = res.body.blogComment.insertId;
    expect(res.statusCode).to.equal(200);
  });
});
