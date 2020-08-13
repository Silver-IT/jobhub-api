## API Documentation

##### GET /api/schedule (authentication required)
* Get schedule items
```
  from: daterange start (optional)
  to: daterange end (optional)
  take: number (optional)
  excludeConstructionSchedule: boolean (optional)
```
* Returns schedule items
```
[
  {
    "type": "enum" (CONSULTATION | SITE_VISIT_SCHEDULE | PROJECT_START),
    "from": "date",
    "to": "date",
    "done": "boolean",
    "accepted": "boolean", (only or site visit schedule)
  }
]
```

##### GET /api/schedule/calendars/{token}
* Get google calendars
* `token` should be obtained from Google OAuth Response with some specific scopes
* Required scope: `profile email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events`
* Returns writable calendars
```
[
  {
    "id": "string",
    "summary": "string",
    "timeZone": "string",
    "backgroundColor": "string",
    "foregroundColor": "string"
  }
]
```

##### POST /api/schedule/calendars/{token}/{calendarId}
* Add event to google calendar
* `token` is same as get calendars api
* `calendarId` from calenders response
```
Schema
{
  "start": "string",
  "end": "string",
  "summary": "string",
  "description": "string"
}
```
* Returns success response

##### PUT /api/schedule/{scheduleId}
* Update a schedule item
* `scheduleId` schedule id
```
{
  "from": "date",
  "to": "date"
}
```
* Updates a schedule item(site visit schedule or pick out pavers) and returns schedule object
```
{
  "id": "string",
  "type": "enum", [SITE_VISIT_SCHEDULE, PICK_OUT_PAVER]
  "from": "date",
  "to": "date",
  "active": true,
  "data": {
    "id": "string",
    "name": "string",
    "user": "User",
    "project": "Project"
  }
}
``` 

##### DELETE /api/schedule/{scheduleId}
* Remove a schedule item
```
`scheduleId` schedule id
```
* Returns success response
```
{
  "success": "boolean"
}
```

##### POST /api/project/{id}/schedule-pick-pavers
* Add a pick-out-pavers schedule
```
id: project id
```
payload
```
{
  "from": "date",
  "to": "date"
}
```
* Returns schedule object
```
{
  "id": "string",
  "type": "PICK_OUT_PAVER",
  "from": "date",
  "to": "date",
  "data": {
    "id": "string",
    "name": "string",
    "user": "user",
    "project": "project",
  }
}
``` 

##### PUT /api/schedule/{scheduleId}/set-done
* Update a schedule item
* `scheduleId` schedule id
* Set a pick pavers schedule item done and returns schedule object
```
{
  "id": "string",
  "type": "enum", [SITE_VISIT_SCHEDULE, PICK_OUT_PAVER]
  "from": "date",
  "to": "date",
  "done": "boolean",
  "active": true,
  "data": {
    "id": "string",
    "name": "string",
    "user": "User",
    "project": "Project"
  }
}
```
