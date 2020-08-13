## API Documentation

##### GET /api/project/{id}/accept-contract
* Get estimate for a project
```
id: projectId
```
* Returns contract object
```
{
  "id": "string",
  "existingSiteAssessment": "string",
  "paversSize": "string",
  "paversColor": "string",
  "paversQuality": "string",
  "layouts": [
    {
      "id": "string",
      "type": "enum", ProjectAccessoryType
      "comment": "string"
    }
  ],
  "costEstimates": [
    {
      "id": "string",
      "name": "string",
      "comment": "string",
      "typeAndAccessory": "string",
      "price": 0
    }
  ],
  "existingMaterialsRemoval": "string",
  "workPlan": "string",
  "attachments": [
    {
      "id": "string",
      "url": "string"
    }
  ],
  "portfolios": [
    {
      "name": "string",
      "materials": [
        "enum", MaterialType
      ],
      "address": "string",
      "email": "string",
      "phone": "string",
      "comment": "string"
    }
  ]
}
```
