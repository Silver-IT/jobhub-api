## API Documentation

##### POST /api/chat/init/{projectId}
* Initialize or fetch chat room between clients and contractors
* Returns chat room
```
{
  "id": "string",
  "project": {
    "id": "string",
    "name": "string",
    "projectType": "enum: ProjectTypeAccessory"
  },
  "customer": {
    "createdAt": "string",
    "updatedAt": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "SUPER_ADMIN",
    "isEmailVerified": true,
    "id": "string",
    "phone": "string",
    "avatar": "string",
  },
  "contractor": {
    "createdAt": "string",
    "updatedAt": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "SUPER_ADMIN",
    "isEmailVerified": true,
    "id": "string",
    "phone": "string",
    "avatar": "string",
  },
  "unread": 0
}
```

##### GET /api/chat/all
* Get all chat rooms
* `Super admin` will get all opened rooms 
* Other users will get all opened rooms for them
```
[{
  "id": "string",
  "project": {
    "id": "string",
    "name": "string",
    "projectType": "enum: ProjectTypeAccessory",
  },
  "customer": {
    "createdAt": "string",
    "updatedAt": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "SUPER_ADMIN",
    "isEmailVerified": true,
    "id": "string",
    "phone": "string",
    "avatar": "string",
  },
  "contractor": {
    "createdAt": "string",
    "updatedAt": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "SUPER_ADMIN",
    "isEmailVerified": true,
    "id": "string",
    "phone": "string",
    "avatar": "string",
  },
  "unread": 0
}]
``` 

##### GET /api/chat/unread
* Get total count of unread messages
```
{
  "total": 0
}
```

##### POST /api/chat/message/{messageId}/read
* Set message as read by id
```
{
  "success": true
}
```

##### POST /api/chat/{chatId}/read/{until}
* Set messages as read by chat id by until date
* `until` date should be Unix timestapm
```
{
  "success": true
}
```

##### GET /api/chat/{chatId}
* Get room detail by chat id
```
{
  "id": "string",
  "project": {
    "id": "string",
    "name": "string",
    "projectType": "enum: ProjectTypeAccessory",
  },
  "customer": {
    "createdAt": "string",
    "updatedAt": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "SUPER_ADMIN",
    "isEmailVerified": true,
    "id": "string",
    "phone": "string",
    "avatar": "string",
  },
  "contractor": {
    "createdAt": "string",
    "updatedAt": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "SUPER_ADMIN",
    "isEmailVerified": true,
    "id": "string",
    "phone": "string",
    "avatar": "string",
  },
  "unread": 0
}
```

##### POST /api/chat/{chatId}/message
* Send message to chat room
```
{
  "message": "string",
  "attachments": [
    "string"
  ]
}
```
* Returns message detail
```
{
  "id": "string",
  "chatId": "string",
  "text": "string",
  "from": "FROM_CONTRACTOR",
  "attachments": [
    "string"
  ],
  "readAt": "string",
  "createdAt": "string"
}
```

##### GET /api/chat/{chatId}/messages
* Get messages by descending order based on `createdAt` property
* `skip` and `take` to get messages by pagination
* Default `take` count is `10`
```
[
  {
    "id": "string",
    "chatId": "string",
    "text": "string",
    "from": "FROM_CONTRACTOR",
    "attachments": [
      "string"
    ],
    "readAt": "string",
    "createdAt": "string"
  }
]
``` 
