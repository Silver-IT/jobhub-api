## API Documentation

*All Apis require authentication*

##### GET /api/network-contractor/all
* Get all Network Contractors
```
  skip: skip entries
  take: take amount
```
* Returns network contractors
```
[
  {
    "id": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "companyName": "string",
    "address": "string",
    "contacts": [
      "string"
    ],
    "website": "string",
    "serviceDescription": "string",
    "category": {
      "id": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "name": "string",
      "published": "boolean"
    },
    "logoUrl": "string"
  }
]
```

##### GET /api/network-contractor/{id}
* Get Network Contractor from id
```
  id: network contractor id
```
* Returns Network Contractor object
```
{
  "id": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "companyName": "string",
  "address": "string",
  "contacts": [
    "string"
  ],
  "website": "string",
  "serviceDescription": "string",
  "category": {
    "id": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "name": "string",
    "published": "boolean"
  },
  "logoUrl": "string"
}
```

##### PUT /api/network-contractor/{id}
* Update Network Contractor with id
```
  id: network contractor id
```
* Returns updated Network Contractor object
```
{
  "id": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "companyName": "string",
  "address": "string",
  "contacts": [
    "string"
  ],
  "website": "string",
  "serviceDescription": "string",
  "category": {
    "id": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "name": "string",
    "published": "boolean"
  },
  "logoUrl": "string"
}
```

##### POST /api/network-contractor
* Add Network Contractor
```
{
  "companyName": "string",
  "address": "string",
  "contacts": [
    "string"
  ],
  "website": "string",
  "serviceDescription": "string",
  "category": {
    "id": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "name": "string",
    "published": "boolean"
  },
  "logoUrl": "string"
}
```
* Returns Network Contractor object
```
{
  "id": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "companyName": "string",
  "address": "string",
  "contacts": [
    "string"
  ],
  "website": "string",
  "serviceDescription": "string",
  "category": {
    "id": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "name": "string",
    "published": "boolean"
  },
  "logoUrl": "string"
}
```

##### DELETE /api/network-contractor/{id}
* Delete Network Contractor with id
```
  id: network contractor id
```
* Returns success state
```
{
  "success": "boolean"
}
```

##### GET /api/network-contractor/category/all
* Get all Network Contractor categories
```
  skip: skip entries
  take: take amount
```
* Returns Network Contractor categories
```
[
  {
    "id": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "name": "string",
    "published": "boolean"
  }
]
```

##### GET /api/network-contractor/category/{id}
* Get network contractor category with id
```
id: uuid
```
* Returns network contractor category
```
{
  "id": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "name": "string",
  "published": "boolean"
}
```

##### PUT /api/network-contractor/category/{id}
* Update network contractor category with id
```
{
  "id": "uuid",
  "deletedAt": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "name": "string",
  "published": "boolean"
}
```
* Returns updated network contractor category
```
{
  "id": "uuid",
  "deletedAt": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "name": "string",
  "published": "boolean"
}
```

##### DELETE /api/network-contractor/category/{id}
* Softly delete network contractor category
```
id: uuid
```
* Returns success state
```
{
  "success": "boolean"
}
```

##### POST /api/network-contractor/category
* Add network contractor category item
```
{
  "name": "string",
  "published": "boolean"
}
```
* Returns network contractor category item
```
{
  "id": "uuid",
  "deletedAt": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "name": "string",
  "published": "boolean"
}
```
