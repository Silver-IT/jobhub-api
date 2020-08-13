## API Documentation

##### POST /api/payment/{milestoneId}/request-cash-pay
* Request milestone payment with cash (customer authentication required)
* Returns Milestone object
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "project": "Project",
  "name": "string",
  "payWithCash": "boolean",
  "amount": "number",
  "comment": "string",
  "paidDate": "date",
}
```

##### POST /api/payment/{milestoneId}/confirm-cash-pay
* Set milestone as paid with cash (contractor authentication required)
* Returns Milestone object
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "project": "Project",
  "name": "string",
  "payWithCash": "boolean",
  "amount": "number",
  "comment": "string",
  "paidDate": "date",
}
```

##### POST /api/payment/{milestoneId}/request-release
* Request to release a milestone. Notification is sent to customer (contractor authentication required)
* Returns Milestone object
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "project": "Project",
  "name": "string",
  "payWithCash": "boolean",
  "amount": "number",
  "comment": "string",
  "paidDate": "date",
}
```

##### POST /api/payment/pay-with-card
* Initiate card payment with stripe
```
milestoneId: string
```
* Returns stripe clientSecret and publishableKey to confirm payment in client side
```
{
  "clientSecret": "string",
  "publishableKey": "string"
}
```

##### POST /api/payment/pay-with-ach
* Perform ach payment
```
{
    "milestoneId": "string",
    "plaidPublicToken": "string",
    "plaidAccountId": "string"
}
```
*   Returns milestone object
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "project": "Project",
  "name": "string",
  "payWithCash": "boolean",
  "amount": "number",
  "comment": "string",
  "paidDate": "date",
}
```

##### GET /api/payment/verify
* Verify stripe card payment
```
milestoneId: string
```
* Returns milestone object
```
{
  "id": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "project": "Project",
  "name": "string",
  "payWithCash": "boolean",
  "amount": "number",
  "comment": "string",
  "paidDate": "date",
}
```

##### POST /api/payment/{milestoneId}/add-on
* add a payment-add-on to a milestone
```
milestoneId: string
```
```
{
  "amount": "number",
  "comment": "string"
}
```
* Returns milestone list
```
["Milestone"]
```


##### DELETE /api/payment/add-on/{addOnId}
* deletes an payment-add-on item from a milestone
```
addOnId: string
```
* Returns milestone list
```
["Milestone"]
```

##### POST /api/payment/{milestoneId}/edit-amount
* updates the amount of a milestone (only the deposit milestone edit is allowed)
```
milestoneId: string
```
* Returns updated milestone array
```
[{
  "id": "string"
  "createdAt": "string"
  "updatedAt": "string"
  "project": "Project" (refer other apis)
  "name": "string"
  "amount": "number"
  "comment": "string"
  "paidDate": "date"
}]
```
