## API Documentation

### PUT /api/user/{id}/change-role
* Change role of a user (requires superadmin authentication)
```
{
  "role": "enum" [SUPER_ADMIN, CONTRACTOR, CUSTOMER]
}
```
* Returns the updated user object
```
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
```

### DELETE /api/user/{id}
* Remove a user softly
* Returns success response if successful
```
{
  "success": "boolean"
}
```

### POST /api/user/invite
* Invite a contractor or super admin user. It sends invitation mail to the user.
```
{
  "firstName": "string",
  "lastName": "string",
  "email": "email",
  "phone": "string",
  "role": "enum" (CONTRACTOR|SUPER_ADMIN)
}
```
* Returns the newly made user object
```
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
```
