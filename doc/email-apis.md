## API Documentation

##### GET /api/project/{projecId}/emails
* Get transaction emails sent to the customer
* Returns a list of email status
```
[{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "deletedAt": "string",
  "email": "string",
  "type": "EmailType",
  "xMessageId": "string",
}]
```

##### GET /api/email/{emailLogId}/status
* Get email status details
```
emailLogId: email log uuid
```
* Returns a list of email events
```
[
  {
    "type": "enum", ('PROCESSED', 'DELIVERED', 'BOUNCE', 'OPEN', 'CLICK')
    "processedAt": "date",
    "reason": "string",
    "mailServer": "string"
  }
]
```
