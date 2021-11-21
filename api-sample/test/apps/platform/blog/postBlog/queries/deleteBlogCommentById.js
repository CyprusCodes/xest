const { submitQuery } = require("~root/lib/database");

const deleteBlogCommentById = ({ blogCommentId }) => submitQuery`
    DELETE FROM blog_comments WHERE comment_id = ${blogCommentId};
`;

module.exports = deleteBlogCommentById;
