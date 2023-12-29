[
    {
        useful: boolean,
        timestamp: datetime,
        prompt_tokens: number,
        completion_tokens: number,
        confirmed: boolean,
        fn_call_id: number,
        content: {}
    }
]

function_type: api, ui

GET /sessions
GET /sessions/:id
POST /sessions/:id
GET /tools

Dialog Hud:
Show context window length (total tokens)
Show total conversation cost (estimated)

Dialog Session Preferences:
Model selection
Output token length
Ask permission before function runs [all, only dangerous, only ui, only api, none]
Cost limit: $$$
Context limit: 2k token

Message options:
Delete
Flag unuseful
Rewind to specific message
Refute (not MVP, socratic introspection of current dialogue with different persona)

Function call display:
show confirmation dialog
show function name and call params
show function call output

Tool select panel:
toggle tool on and off

Conversations panel:
Delete conversation
Title and date time

Message panel:
choose files via file picker
choose from prompt templates (not MVP)


context forking
context folding