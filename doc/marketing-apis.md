## API Documentation

##### POST /api/marketing/page-visit
* Add/Update anon user page visit history
* When payload has `id: UUID`, API will update entry (just update `updatedAt` field to calculate duration)
```
{
  "page": "BRIEF_PAGE",
  "sub": "string",
  "id": "string"
}
```
* Returns created/updated entry
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "page": "BRIEF_PAGE",
  "sub": "string"
}
```

##### GET /api/marketing/page-visit
* Get overall count of page visit history
```
[
  {
    "page": "BRIEF_PAGE",
    "sub": "string",
    "count": 0
  }
]
```

##### GET /api/marketing/session-count
* Get session count by time segments
* Query param: `unit: YEAR, MONTH, WEEK, DAY, HOUR` (default `DAY`)
* Query param: `from: datestring`
* Query param: `to: datestring`
```
[
  {
    "date": "string",
    "count": 0
  }
]
```

##### GET /api/marketing/projects
* Get projects with brief information
```
[
  {
    "id": "string",
    "address": "string",
    "name": "string",
    "user": "user",
    "latitude": "number",
    "longitude": "number",
  }
]
```

##### GET /api/overview/revenue/by-date
* Get payment history by time segments
* Query param: `unit: YEAR, MONTH, WEEK, DAY, HOUR` (default `DAY`)
* Query param: `from: datestring`
* Query param: `to: datestring`

Response
```
[
  {
    "date": "date",
    "stripe": "number",
    "ach": "number",
    "cash": "number",
  }
]
```

##### GET /api/overview/revenue/by-type
* Get total revenue by payment method
* Query param: `from: datestring`
* Query param: `to: datestring`

Response
```
{
  "stripe": "number",
  "ach": "number",
  "cash": "number"
}
```
