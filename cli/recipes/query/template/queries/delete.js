const { submitQuery } = require("~root/database");

const delete{{entityName}} = ({
  slug
}) => submitQuery`
    DELETE FROM blogs
    WHERE slug = ${slug} 
`;

module.exports = delete{{entityName}};