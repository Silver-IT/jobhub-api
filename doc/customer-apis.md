## API Documentation

##### POST /api/customer/register
* Register customer. (projects, consultation, user)
```
{
  "projects": [{
    "name": "string",
    "address": "string",
    "projectType": "enum" (ProjectAccessoryType),
    "locationType": "enum" (ProjectLocationType),
    "projectSize": "enum" (ApproxProjectSize),
    "shapeType": "enum" (ShapeType),
    "accessories": [
      "enum" (ProjectAccessoryType)
    ],
    "machineAccess": "enum" (MachineAccessType),
    "propertyGrade": "enum" (PropertyGradeType),
    "soilType": "enum" (SoilType),
    "drainageType": "enum" (DrainageType),
    "timelineType": "enum" (ProjectTimelineType),
    "budget": 0,
    "comment": "string",
    "attachments": [
      "string"
    ]
  }],
  "consultation": {
    "datetime": "datetime",
    "patioPackage": {
      "packageType": "enum", (PackageType)
        "additional": [
          "enum" (AdditionalPackage)
        ],
        "option": "string",   optional parameter
    }
  },
  "sourceFoundUs": "enum", SourceFoundUs
  "user":  {
    "email": "email",
    "firstName": "string",
    "lastName": "string",
    "password": "string",
    "phone": "string",
    "ideas": [
      "string"
    ]
  }
}
```
* Returns the register status
```
{
  "token": "string"
}
```

##### GET /api/customer/{userId}/contracts
* Get contract list of a customer
```
userId: user id
```
* returns contract list of a customer
```
[
{
    "id": "uuid",
    "deletedAt": "date",
    "createdAt": "date",
    "updatedAt": "date",
    "existingSiteAssessment": "string",
    "paversSize": "string",
    "paversColor": "string",
    "paversQuality": "string",
    "existingMaterialsRemoval": "string",
    "workPlan": "string",
    "signedDate": "date"
  }
]
```

##### POST /api/customer/invite
* Invite customer. (projects, consultation(optional), user)
```
{
  "projects": [{
    "name": "string",
    "address": "string",
    "projectType": "enum" (ProjectAccessoryType),
    "locationType": "enum" (ProjectLocationType),
    "projectSize": "enum" (ApproxProjectSize),
    "shapeType": "enum" (ShapeType),
    "accessories": [
      "enum" (ProjectAccessoryType)
    ],
    "machineAccess": "enum" (MachineAccessType),
    "propertyGrade": "enum" (PropertyGradeType),
    "soilType": "enum" (SoilType),
    "drainageType": "enum" (DrainageType),
    "timelineType": "enum" (ProjectTimelineType),
    "budget": 0,
    "comment": "string",
    "attachments": [
      "string"
    ]
  }],
  "consultation": {    (optional)
    "datetime": "datetime"
  },
  "user":  {
    "email": "email",
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "ideas": [
      "string"
    ]
  }
}
```
* Returns the register status
```
{
  "success": "boolean"
}
```

##### GET /api/customer/all
* Get all customers (Contractor login required)
```
  skip: skip entries
  take: take amount
```
* Returns project objects
```
[{
  "id": "uuid",
  "email": "email",
  "phone": "string",
  "firstName": "string",
  "lastName": "string",
  "isEmailVerified": boolean,
  "role": "enum" (CONTRACTOR | CUSTOMER),
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "projectCount": "number",
  "ideaCount": "number"
}]
```

##### GET /api/customer/{id}
* Get one customer object (Contractor login required)
```
id: customer id
```
* Returns Customer object
```
{
  "id": "uuid",
  "email": "email",
  "phone": "string",
  "firstName": "string",
  "lastName": "string",
  "isEmailVerified": boolean,
  "role": "enum" (CONTRACTOR | CUSTOMER),
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "projectCount": "number",
  "ideaCount": "number"
}
```

##### GET /api/customer/{id}/projects
* Get all projects registered by customer {id}
```
skip: number
take: number
```
* Returns customer projects
```
[
  {
    "name": "string",
    "address": "string",
    "projectType": "enum" (ProjectAccessoryType),
    "locationType": "enum" (ProjectLocationType),
    "projectSize": "string",
    "shapeType": "enum" (ProjectShapeType),
    "timelineType": "enum" (ProjectTimelineType),
    "interestedInFinancing": "enum" (OpinionType),
    "designRequired": true,
    "cleanUpType": "enum" (CleanUpRequiredType),
    "materials": [
      "enum" (MaterialType)
    ],
    "requestDetails": "string",
    "budget": "number",
    "manufacturer": "string",
    "productName": "string",
    "preferredSize": "string",
    "preferredTexture": "string",
    "preferredPricePoint": "enum" (PreferredPricePoint),
    "preferredColors": [
      "enum" (PreferredColor)
    ]
    "additionalDesigns": "string",
    "machineAccess": "enum" (MachineAccessType),
    "propertyGrade": "enum" (PropertyGradeType),
    "soilType": "enum" (SoilType),
    "drainageType": "enum" (DrainageType),
    "exteriorUtilities": "string",
    "exteriorHazards": "string",
    "exteriorInconveniences": "string",
    "materialStorage": "string",
    "materialHaulOut": "string",
    "downSpouts": "string",
    "shrubRemoval": "string",
    "attachments": [
      {
        "id": "string",
        "url": "string"
    ],
    "comment": "string"
]
```

##### POST /api/customer/visit/page
* Adds a page visit history of a customer
```
{
  "page": "enum" [BRIEF_PAGE, ESTIMATE_PAGE, PROPOSAL_PAGE, CONTRACT_PAGE, PAYMENT_PAGE]
  "projectId": "uuid"
  "id": "uuid"
}
```
* returns added page visit history object
```
{
  "id": "uuid",
  "page": "enum" [BRIEF_PAGE, ESTIMATE_PAGE, PROPOSAL_PAGE, CONTRACT_PAGE, PAYMENT_PAGE],
  "project": "Project"
}
```

##### POST /api/customer/search-by-email
* Search customer by email
```
{
  "email": "email"
}
```
* throws 404 if customer does not exist
```
{
  "id": "c520f665-8287-4e11-97a2-a40b325341a3",
  "deletedAt": null,
  "createdAt": "2020-07-10T21:00:36.517Z",
  "updatedAt": "2020-07-10T21:00:36.517Z",
  "email": "honglin328@yandex.com",
  "firstName": "Hong",
  "lastName": "Lin",
  "phone": "(123) 123-1234",
  "isEmailVerified": false,
  "role": "CUSTOMER",
  "password": "$2b$10$s63r1TXnmXkDRrlXOntYAe/XWHptS4J/2t6xHGW6/RZYxwlCZKiDO",
  "avatar": null,
  "address": "2250 Charleston Rd, Mountain View, CA 94043, USA",
  "latitude": 37.421552399999996,
  "longitude": -122.09509510000001,
  "stripeCustomerId": null,
  "invitationStatus": "PENDING",
  "ideas": [],
  "customerProfile": {
    "id": "f26044a2-674d-4606-8c67-0679f6b148b8",
    "deletedAt": null,
    "createdAt": "2020-07-10T21:00:36.482Z",
    "updatedAt": "2020-07-10T21:00:36.482Z",
    "sourceFoundUs": "INSTAGRAM"
  },
  "contractorProfile": null,
  "patioPackage": null
}
```
