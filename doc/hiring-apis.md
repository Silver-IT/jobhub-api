## API Documentation

##### GET /api/job/all
* Get all available jobs
```
  skip: skip entries
  take: take amount
``` 
* Return all available jobs
```
[
  {
    "id": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "title": "string",
    "description": "string",
    "type": "PART_TIME | FULL_TIME",
    "salary": "number",
    "salaryType": "YEAR | MONTH | HOUR",
    "remote": "boolean",
    "hardSkills": [
      "string"
    ],
    "softSkills": [
      "string"
    ]
  }
]
```

##### GET /api/job/{jobId}
* Get job by id
* Return job detail
```
{
"id": "string",
"createdAt": "string",
"updatedAt": "string",
"title": "string",
"description": "string",
"type": "PART_TIME | FULL_TIME",
"salary": "number",
"salaryType": "YEAR | MONTH | HOUR",
"remote": "boolean",
"hardSkills": [
  "string"
],
"softSkills": [
  "string"
]
}
```

##### POST /api/job (authentication required)
* Create a new job detail
```
{
  "title": "string",
  "description": "string",
  "type": "PART_TIME | FULL_TIME",
  "salary": "number",
  "salaryType": "YEAR | MONTH | HOUR",
  "remote": "boolean",
    "hardSkills": [
      "string"
    ],
    "softSkills": [
      "string"
    ]
}
```
* Returns created job entry
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "title": "string",
  "description": "string",
  "type": "PART_TIME | FULL_TIME",
  "salary": "number",
  "salaryType": "YEAR | MONTH | HOUR",
  "remote": "boolean",
    "hardSkills": [
      "string"
    ],
    "softSkills": [
      "string"
    ]
}
```

##### PUT /api/job/{jobId} (authentication required)
* Update existing job entry
```
{
  "title": "string",
  "description": "string",
  "type": "PART_TIME | FULL_TIME",
  "salary": "number",
  "salaryType": "YEAR | MONTH | HOUR",
  "remote": "boolean",
    "hardSkills": [
      "string"
    ],
    "softSkills": [
      "string"
    ]
}
```
* Returns updated job entry
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "title": "string",
  "description": "string",
  "type": "PART_TIME | FULL_TIME",
  "salary": "number",
  "salaryType": "YEAR | MONTH | HOUR",
  "remote": "boolean",
    "hardSkills": [
      "string"
    ],
    "softSkills": [
      "string"
    ]
}
```

##### DELETE /api/job/{jobId} (authentication required)
* Delete job by id
* Success response

##### POST /api/job/{jobId}/apply
* Apply for an open position
```
{
  "email": "string",
  "fullName": "string",
  "phone": "string",
  "cv": "string",   
}
```
* Returns proposal details
```
{
  "email": "string",
  "fullName": "string",
  "phone": "string",
  "job": Job Detail,
  "cv": "string",
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
}
```
* 400 Error when applied doesn't exist

##### GET /api/job/applicant/all (authentication required)
* Retrieve all applicants
```
  skip: skip entries
  take: take amount
```
* Returns all applicants
```
[
  {
    "id": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "cv": "string"
  }
]
```
* 400 Error when applied doesn't exist

##### POST /api/job/applicant/{applicantId}/decline (authentication required)
* Decline applicant's proposal
* Success response
