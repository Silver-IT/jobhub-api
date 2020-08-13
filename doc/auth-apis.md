## API Documentation

##### POST /api/auth/login
* Login
```
{
  "email": "email",
  "password": "string"
}
```
* Returns an access token (expires in 2h)
```
{
  "accessToken": "string"
}
```

##### POST /api/auth/register
* Register an account
* Send an account verification email
```
{
  "email": "email",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "password": "string",
  "role": "enum" [CONTRACTOR|CUSTOMER]
}
```
* Returns
```
{
  "success": "boolean"
}
``` 

##### GET /api/auth
* Get authorization information
* Returns authorization information based on authorization header
```
{
  "email": "email",
  "role": "enum" [CONTRACTOR|CUSTOMER]
}
```

##### POST /api/auth/accept-invite
* Accept invitation and set a new password (verifies email)
```
{
  "temporaryPassword": "string",
  "password": "string",
  "token": "string"
}
```
* Returns token response
```
{
  "accessToken": "string"
}
```

##### POST /api/auth/forgot-password
* Send a password reset link to the email
```
{
  "email": "email"
}
```
* Returns
```
{
  "success": "boolean"
}
```

##### POST /api/auth/reset-password
* Resets password
```
{
  "email": "email",
  "password": "string",
  "resetToken": "uuid"
}
```
* Returns
```
{
  "success": "boolean"
}
```

##### GET /api/auth/verify/{token}
* Verify an account using verification token given as {token}
* Returns
```
{
  "success": "boolean"
}
```

##### POST /api/contact
* Send a contact-us message
```
{
  "email": "email",
  "phone": "string",
  "fullName": "string",
  "message": "string"
}
```
* Returns message send status
```
{
  "success": "boolean"
}
```
