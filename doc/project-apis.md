## API Documentation

##### GET /api/project/all (authentication required)
* Get all projects
 has ability to filter with contractorId
```
  skip: skip entries
  take: take amount
  contractorId: contractor id
```
* Returns project objects
```
[
  {
    "name": "string",
    "address": "string",
    "projectType": "enum" (ProjectAccessoryType),
    "locationType": "enum" (ProjectLocationType),
    "projectSize": "string",
    "latitude": "number,
    "longitude": "number,
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
  }
]
```

##### POST /api/project/register
* Register project (authentication required)
```
{
  "project": {
    "name": "string",
    "address": "string",
    "latitude": "number,
    "longitude": "number,
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
  },
  "consultation": {
    "datetime": "datetime"
  }
}
```
* Returns the register status
```
{
  "success": "boolean"
}
```

##### PUT /api/project/{id}
* Update project
```
{
  "name": "string",
  "address": "string",
  "latitude": "number,
  "longitude": "number,
  "projectType": "enum" (ProjectAccessoryType),
  "locationType": "enum" (ProjectLocationType),
  "projectSize": "string",
  "shapeType": "enum" (ProjectShapeType),
  "machineAccess": "enum" (MachineAccessType),
  "propertyGrade": "enum" (PropertyGradeType),
  "soilType": "enum" (SoilType),
  "drainageType": "enum" (DrainageType),
  "timelineType": "enum" (ProjectTimelineType),
  "budget": "number,
  "comment": "string",
  "additionalDesigns": "string",
  "exteriorUtilities": "string",
  "exteriorHazards": "string",
  "exteriorInconveniences": "string",
  "materialStorage": "string",
  "materialHaulOut": "string",
  "downSpouts": "string",
  "shrubRemoval": "string",
  "attachments": [
    "url"
  ],
  "interestedInFinancing": "YES",
  "designRequired": true,
  "cleanUpType": "enum" (CleanUpRequiredType),
  "materials": [
    "enum" (MaterialType)
  ],
  "requestDetails": "string",
  "accessories": [
    {
      "id": "string",
      "type": "enum" (ProjectAccessoryType),
      "materials": [
        "enum" (MaterialType)
      ],
      "locationType": "enum" (ProjectLocationType),
      "size": "string",
      "shape": "enum" (ProjectShapeType),
      "groundState": "string", // What's currently there
      "comment": "string"
    }
  ]
}
```
* Returns success state
```
{
  "success": "boolean"
}
```

##### GET /api/project/{id}/customer-visit-history
* Get customer visit history by project id
* Returns array of visit history
```
[
 {
    "id": "63c51324-e3f2-42d9-b610-3cc1172ff898",
    "createdAt": "2020-06-30T16:19:54.170Z",
    "updatedAt": "2020-06-30T16:19:58.979Z",
    "page": "BRIEF_PAGE",
    "projectId": "dec358c1-94de-4e23-a526-4012281ea7f8"
  }
]
```

##### POST /api/project/{id}/skip-estimate
* Skip making estimate step
```
- query param
  id: "uuid" project id
- body 
{
  "contractorUserId": "uuid",
  "siteVisitDate": "string" (iso date)
}
```
* Returns project object

##### GET /api/project/{id}/estimate
* Get estimate for a project
```
id: projectId
```
* Returns estimate object
```
{
  "id": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "items": [
    {
      "type": "enum" (ProjectAccessoryType),
      "materials": [
        "enum" (MaterialType)
      ],
      "projectLocation": "enum" (ProjectLocationType),
      "approxSize": "string",
      "projectDescription": "string",
      "pricePerUnit": 0
    }
  ],
  "siteVisitSchedules": [
    {
      "id": "string",
      "from": "date",
      "to": "date"
    }
  ],
  "timelineType": "IMMEDIATELY",
  "comment": "string"
}
```

##### POST /api/project/{id}/estimate
* Add or update estimate
```
id: projectId
```
* Returns added/updated estimate object
```
{
  "id": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "items": [
    {
      "type": "enum" (ProjectAccessoryType),
      "materials": [
        "enum" (MaterialType)
      ],
      "projectLocation": "enum" (ProjectLocationType),
      "approxSize": "string",
      "projectDescription": "string",
      "pricePerUnit": 0
    }
  ],
  "siteVisitSchedules": [
    {
      "id": "string",
      "from": "date",
      "to": "date"
    }
  ],
  "timelineType": "IMMEDIATELY",
  "comment": "string"
}
```

##### GET /api/project/{id}/final-proposal
* Gets final proposal with project id
```
id: project id
```
* Returns final proposal object (new from estimate if it doesn't exist)
```
{
  "id": "uuid",
  "existingSiteAssessment": "string",
  "paversSize": "string",
  "paversColor": "string",
  "paversQuality": "string",
  "layouts": [
    {
      "id": "uuid",
      "type": "STEPS",
      "comment": "string",
      "attachments": [
        {
          "id": "uuid",
          "url": "string"
        }
      ]
    }
  ],
  "existingMaterialRemoval": "string",
  "procedures": [
    {
      "id": "uuid",
      "type": "enum", (ProjectAccessoryType)
      "steps": [
        {
          "id": "uuid",
          "title": "string",
          "comment": "string"
        }
      ]
    }
  ],
  "startDate": "date",
  "endDate": "date",
  "workPlan": "string",
  "attachments": {
    "id": "uuid",
    "url": "string"
  },
  "costEstimates": {
    "id": "uuid",
    "type": "STEPS",
    "comment": "string",
    "cost": 0,
    "accept": true
  },
  "status": "enum", (FinalProposalStatus)
  "declineReasons": "enum", (DeclineReason)
  "declineComment": "string",
  "discount": "number",
  "applyTax": "boolean"
}
```
##### POST/api/project/{id}/final-proposal
* Save or update final proposal and makes notification to user
```
id: project id
```
* Returns saved/updated final proposal object
   `id` fields are optional.
```
{
  "id": "uuid",
  "existingSiteAssessment": "string",
  "paversSize": "string",
  "paversColor": "string",
  "paversQuality": "string",
  "layouts": [
    {
      "id": "uuid",
      "type": "STEPS",
      "comment": "string",
      "attachments": [
        {
          "id": "uuid",
          "url": "string"
        }
      ]
    }
  ],
  "existingMaterialRemoval": "string",
  "procedures": [
    {
      "id": "uuid",
      "type": "enum", (ProjectAccessoryType)
      "steps": [
        {
          "id": "uuid",
          "title": "string",
          "comment": "string"
        }
      ]
    }
  ],
  "startDate": "date",
  "endDate": "date",
  "workPlan": "string",
  "attachments": {
    "id": "uuid",
    "url": "string"
  },
  "costEstimates": {
    "id": "uuid",
    "type": "STEPS",
    "comment": "string",
    "cost": 0,
    "accept": true
  },
  "status": "enum", (FinalProposalStatus)
  "declineReasons": "enum", (DeclineReason)
  "declineComment": "string",
  "discount": "number",
  "applyTax": "boolean"
}
```

##### GET /api/project/estimate/all
* Get estimates with date condition
```
from: fromDate
to: toDate
skip: skip count
take: take count
```
* Returns estimate object
```
{
  "id": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "items": [
    {
      "type": "enum" (ProjectAccessoryType),
      "materials": [
        "enum" (MaterialType)
      ],
      "projectLocation": "enum" (ProjectLocationType),
      "approxSize": "string",
      "projectDescription": "string",
      "pricePerUnit": 0
    }
  ],
  "siteVisitSchedules": [
    {
      "id": "string",
      "from": "date",
      "to": "date"
    }
  ],
  "project": "object" (Project) # project contains user object
  "timelineType": "IMMEDIATELY",
  "comment": "string"
}
```

##### POST /api/project/{id}/final-proposal/accept
* Accept final proposal
```
- query params
id: project id
- payload
{
  "acceptedItems": ["proposalItemId"]
}
```
* Returns milestones
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

##### POST /api/project/{id}/estimate/accept
* Accept project estimate
```
{
  "scheduleId": "string"
}
```
* Returns updated estimate object
```
{
  "id": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "items": [
    {
      "type": "enum" (ProjectAccessoryType),
      "materials": [
        "enum" (MaterialType)
      ],
      "projectLocation": "enum" (ProjectLocationType),
      "approxSize": "string",
      "projectDescription": "string",
      "pricePerUnit": 0
    }
  ],
  "siteVisitSchedules": [
    {
      "id": "string",
      "from": "date",
      "to": "date"
    }
  ],
  "timelineType": "IMMEDIATELY",
  "comment": "string"
}
```

##### POST /api/project/{id}/estimate/decline
* decline project estimate
* Returns updated estimate object
```
{
  "id": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "items": [
    {
      "type": "enum" (ProjectAccessoryType),
      "materials": [
        "enum" (MaterialType)
      ],
      "projectLocation": "enum" (ProjectLocationType),
      "approxSize": "string",
      "projectDescription": "string",
      "pricePerUnit": 0
    }
  ],
  "siteVisitSchedules": [
    {
      "id": "string",
      "from": "date",
      "to": "date"
    }
  ],
  "timelineType": "IMMEDIATELY",
  "comment": "string"
}
```

##### GET /api/project/{projectId}/request-review
* Request customer to review on a project. Notification must be sent to the customer.
```
projectId: string
```
* returns success response
```
{
  "success": "boolean"
}
```

##### POST /api/project/{projectId}/reschedule-site-visit
* Reschedule site visit schedule of a project
```
query param:
projectId: string
body:
{
  "scheduleId": "uuid"
}
```
* Returns rescheduled site visit schedules
```
[{
  "id": "string",
  "from": "date",
  "selected": "boolean",
  "to": "date"
}]
```

##### POST /api/project/{projectId}/cancel-site-visit
* Cancel site visit schedule of a project
```
projectId: string
```
* Returns site visit schedule candidates
```
[{
  "id": "string",
  "from": "date",
  "selected": "boolean",
  "to": "date"
}]
```

##### POST /api/project/{projectId}/request-pick-out-pavers-schedule-change
* Request another for pick out pavers schedule
```
query param:
projectId: string
```
* Returns success response
```
{
  "success": "boolean"
}
```

##### DELETE /api/project/{projectId}
* Soft remove a project and it's estimate, finalProposal, siteVisitSchedules
```
query param:
projectId: string
```
* Returns success response
```
{
  "success": "boolean"
}
```

##### POST /api/project/{projectId}/continue-to-payment
* make empty estimate, proposal and skip to payment
```
projectId: string
```
* returns project object
```
{
    "name": "string",
    "address": "string",
    "projectType": "enum" (ProjectAccessoryType),
    "locationType": "enum" (ProjectLocationType),
    "projectSize": "string",
    "latitude": "number,
    "longitude": "number,
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
}
```

##### POST /api/project/{projectId}/confirm-government-call
* Set government call confirmed for a project
```
# route params
projectId: string
# payload
{
  "comment": "string" (optional)
}
```
* returns success response
```
{
  "success": "boolean"
}
```
