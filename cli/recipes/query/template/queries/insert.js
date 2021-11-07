const { submitQuery } = require("~root/database");

const insert{{entityName}} = ({
  productRef,
  title,
  productId,
}) => submitQuery`
  INSERT INTO events (
    name,
    artist,
    date,
    description
  )
  VALUES (
    "L'imperatrice Paris",
    "L'imperatrice",
    NOW(),
    "Bon magnifique"
  );
`;

module.exports = insert{{entityName}};