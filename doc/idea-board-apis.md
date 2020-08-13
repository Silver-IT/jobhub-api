## API Documentation

##### GET /api/idea-board?skip={skip}&take={take}&projectType={projectType}&materialType={materialType}
* Get `liked` idea board entries. (Customer authentication required)<br>
```
  skip: skip entries
  take: take amount
  projectType: project accessory type
  materialType: material type
```
 *All query parameters are optional*
* Returns idea board entries
```
[
  {
    "id": "string",
    "url": "url",
    "projectType": "enum" (ProjectAccessoryType),
    "materialTypes": [
      "enum" (MaterialType)
    ]
  }
]
```


##### GET /api/idea-board/customer/{userId}?projectType={projectType}&materialType={materialType}
* Get `liked` idea board entries for a Customer with `userId`. (Contractor authentication required)<br>
```
  projectType: project accessory type
  materialType: material type
```
 *All query parameters are optional*
* Returns idea board entries
```
[
  {
    "id": "string",
    "url": "url",
    "projectType": "enum" (ProjectAccessoryType),
    "materialTypes": [
      "enum" (MaterialType)
    ]
  }
]
```


##### GET /api/idea-board/all?skip={skip}&take={take}&projectType={projectType}&materialType={materialType}
* Get all idea board entries (No authentication required)<br>
```
  skip: skip entries
  take: take amount
  projectType: project accessory type
  materialType: material type
```
 *All query parameters are optional*
* Returns idea board entries
```
[
  {
    "id": "string",
    "url": "url",
    "selected": "boolean",
    "projectType": "enum" (ProjectAccessoryType),
    "materialTypes": [
      "enum" (MaterialType)
    ]
  }
]
```

##### GET /api/idea-board/as-block
* Get idea items as block. Each block has 6 idea-board items. 4 1x1, 1 2x1, 1 1x2
```
query params
projectType: "enum" ProjectAccessoryType (optional)
count: "number"
```
* Returns count * 6 idea-board items.
```
[
  {
     "id": "string",
     "url": "url",
     "width": "number",
     "height": "number",
     "projectType": "enum" (ProjectAccessoryType),
     "materialTypes": [
       "enum" (MaterialType)
     ]
  }
]
```

##### PUT /api/idea-board/{id}
* Update idea board entry (Contractor authentication required)<br>
```
{
  "projectType": "enum" (ProjectAccessoryType),
  "materialTypes": [
    "enum" (MaterialType)
  ]
}
```
 *All query parameters are optional*
* Returns updated entry
```
{
  "id": "string",
  "url": "url",
  "projectType": "enum" (ProjectAccessoryType),
  "materialTypes": [
    "enum" (MaterialType)
  ]
}
```

##### POST /api/idea-board/{id}/like
* add idea to user's liked array (authentication required)
```
id: string
```
* returns success response
```
{
  "success": "boolean"
}
```

##### POST /api/idea-board/{id}/like
* remove idea from user's liked array (authentication required)
```
id: string
```
* returns success response
```
{
  "success": "boolean"
}
```

##### POST /api/idea-board
* bulk add idea-board items
```
{
   "files": [
{
      "projectType": "enum" ProjectAccessoryType
      "materialTypes": [
         "enum" MaterialType
      ],
      "url": "url"
    }
   ]
}
```
* returns added idea-board items
```
[
  {
    "projectType": "enum", ProjectAccessoryType
    "materialTypes": [
      "enum" MaterialType
    ],
    "url": "url",
    "indexNumber": "number",
    "width": "number",
    "height": "number",
    "id": "uuid",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

##### DELETE /api/idea-board/{id}
* soft delete given idea-board item
```
id: string
```
* returns success response
```
{
  "success": "boolean"
}
```
