## API Documentation

##### POST /api/log-rocket
* Add/Update log rocket recording session
```
{
  "recordingId": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string"
}
```
* Returns log rocket recording entity
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "recordingId": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "isResolved": true
}
```

##### GET /api/log-rocket/all
* Filter log rocket recording sessions with pagination
* `resolved: boolean | undefined` - if session is resolved or not
* `authorized: boolean | undefined` - if session is from authorized user or anonymous user
* `email: string | undefined` - if session is from specific email
* `from: datestring | undefined` - session `createdAt` filter start date
* `to: datestring | undefined` - session `createdAt` filter end date
* Additional pagination filters - `skip: number` and `take: number (default: 20)`
* Returns session recordings in pagination format

##### POST /api/log-rocket/resolve/:id
* Mark log rocket session as resolved
* Database id entry
* Returns `null` or recording, `null` when we can't find entry for requested id
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "recordingId": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "isResolved": true
}
```

##### POST /api/log-rocket/unresolve/:id
* Mark log rocket session as unresolved
* Database id entry
* Returns `null` or recording, `null` when we can't find entry for requested id
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "recordingId": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "isResolved": false
}
```
