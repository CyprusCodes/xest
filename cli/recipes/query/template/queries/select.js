const { submitQuery } = require("~root/database");

const select{{entityName}} = ({eventId}) => submitQuery`
    SELECT 
        event_id, 
        name,
        artist,
        date,
        description   
    FROM events
    WHERE event_id = ${eventId}
`;

module.exports = select{{entityName}};