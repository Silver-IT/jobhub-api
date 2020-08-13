## API Documentation

##### GET /api/project/{id}/material
* Get chosen material for a project
```
id: projectId
```
* Returns MaterialRequest object
```
[
  {
    "id": "def6a607-d068-4049-b3cf-e186efc7a131",
    "type": "WALKWAY",
    "notes": [
      "hello",
      "world"
    ]
  }
]
```

##### POST /api/project/{id}/material
* Add or update material for a project
```
id: projectId
```
* request body
```
[
  {
    "id": "def6a607-d068-4049-b3cf-e186efc7a131",
    "type": "WALKWAY",
    "notes": [
      "hello",
      "world"
    ]
  }
]
```
* Returns added/updated MaterialRequest object
```
[
  {
    "id": "def6a607-d068-4049-b3cf-e186efc7a131",
    "type": "WALKWAY",
    "notes": [
      "hello",
      "world"
    ]
  }
]
```

##### GET /api/project/{id}/material-order
* get material orders from project
```
id: projectId
```
* Returns material order groups
```
[
  {
    "id": "string",
    "createdAt": "string",
    "deletedAt": "string",
    "updatedAt": "string",
    "items": [
      {
        "id": "string",
        "createdAt": "string",
        "deletedAt": "string",
        "updatedAt": "string",
        "amount": "string",
        "amountType": "BAGS",
        "color": "string",
        "name": "string",
        "brand": "string",
        "style": "string",
        "requestDate": "2020-07-20T19:48:53.570Z",
        "comment": "string"
      }
    ],
    "layoutType": "STEPS",
    "groupType": "LAYOUT"
  }
]
```

##### POST /api/project/{id}/material-order
* add or update material orders
```
id: projectId
```
Request payload body
```
[
  {
    "items": [
      {
        "amount": "string",
        "amountType": "BAGS",
        "color": "string",
        "name": "string",
        "brand": "string",
        "style": "string",
        "requestDate": "2020-07-20T19:48:53.570Z",
        "comment": "string"
      }
    ],
    "layoutType": "STEPS",
    "groupType": "LAYOUT"
  }
]
```
* returns added/updated material orders
```
[
  {
    "id": "string",
    "createdAt": "string",
    "deletedAt": "string",
    "updatedAt": "string",
    "items": [
      {
        "id": "string",
        "createdAt": "string",
        "deletedAt": "string",
        "updatedAt": "string",
        "amount": "string",
        "amountType": "BAGS",
        "color": "string",
        "name": "string",
        "brand": "string",
        "style": "string",
        "requestDate": "2020-07-20T19:48:53.570Z",
        "comment": "string"
      }
    ],
    "layoutType": "STEPS",
    "groupType": "LAYOUT"
  }
]
```
