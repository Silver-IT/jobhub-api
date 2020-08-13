## API Documentation

##### GET /api/overview/stats
* Get overall stats of application
```
{
  "applicants": 0,
  "customers": 0,
  "estimates": 0,
  "projects": 0,
  "ytd": 0,
}
```

##### GET /api/overview/projects-stat
* Get overall stats of projects
```
{
  "inProgress": 0,
  "estimatePending": 0,
  "finalProposalPending": 0,
  "pendingSiteVisitSchedule": 0
}
```

##### GET /api/overview/pending-projects
* Get first 10 pending projects and total count
```
query params (optional)
skip: skip entries
take: take amount
```
* Returns pagination result
```
{
  "data": [
    "ProjectDetail"
  ],
  "count": 0
}
```
