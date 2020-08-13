## API Documentation

##### GET /api/contractor/all
*Super admin authentication required*
* Get all contractor users
* Returns contractor user array
```
[
  {
    "id": "string",
    "createdAt": "date",
    "updatedAt": "date",
    "email": "email",
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "isEmailVerified": true,
  }
]
```
