## API Documentation

We use [Socket.io](https://socket.io/) for real-time messaging system and event notification feature.

### Socket Channels
* Client connect to server (eg: `http://localhost:3000`) using Socket.io
* Server will return events to only required users
* Event channel is `{user_id}_events`, and data format is same as [Event Model](./event-apis.md)
* Messages channel is `{user_id}_messages`, and data format is same as [Message Model](./event-apis.md)

### Event flow
* After connecting to event channel, users will receive notification from it
* Notification will be sent to user filtered from backend side, so no need to filter from the front end

### Message flow
* Sending message will be done via HTTP request, `POST /api/chat/{chatId}/message`
* All messages will be sent to user via socket channel `{userId}_messages`
* Rendering new messages should be done using messages coming from the socket channel
* If message is not mine, the front end should call mark as read API to set that message as read
* Additional features can be implemented using Chat APIs and Socket according to the design

### LogRocketRecording flow
* Client will send LogRocket session id with HTTP request, `POST /api/log-rocket`
* That could be about a new session or status update for existing session, we have `isUpdate` flag
* All above actions will be sent via socket channel `log_rocket_recordings`
* Only super admins and contractors can observe the sessions
