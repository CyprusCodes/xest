const { submitQuery, getFirst } = require("~root/lib/database");

const selectEventByOrgId = ({ eventId, orgId }) => submitQuery`
    SELECT 
        event_id
    FROM events
    WHERE event_id = ${eventId} && organization_id = ${orgId}
`;

module.exports = getFirst(selectEventByOrgId, "event_id");
