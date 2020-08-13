## API Documentation

##### POST /api/search
* Search entries through over the platform
```
{
  "keyword": "string"
}
```
* Returns search result in category of projects, customers, contractors, network contractors
```
{
  "projects": [
    {
      "id": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "customer": {
        "id": "string",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "contractor": {
        "id": "string",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "name": "string",
      "address": "string",
      "projectType": "STEPS",
      "locationType": "FRONT_YARD",
      "projectSize": "string",
      "shapeType": "STRAIGHT",
      "accessories": [
        {
          "id": "string",
          "createdAt": "string",
          "updatedAt": "string",
          "type": "STEPS",
          "materials": [
            "PAVERS"
          ],
          "locationType": "FRONT_YARD",
          "size": "string",
          "shape": "STRAIGHT",
          "groundState": "string",
          "comment": "string"
        }
      ],
      "timelineType": "IMMEDIATELY",
      "interestedInFinancing": "YES",
      "designRequired": true,
      "cleanUpType": "TOPSOIL",
      "materials": [
        "PAVERS"
      ],
      "requestDetails": "string",
      "budget": 0,
      "manufacturer": "string",
      "productName": "string",
      "preferredSize": "string",
      "preferredTexture": "string",
      "preferredPricePoint": "ECONOMY",
      "preferredColors": [
        "EARTH_TONE"
      ],
      "additionalDesigns": "string",
      "machineAccess": "YES",
      "propertyGrade": "LEVEL",
      "soilType": "CLAY",
      "drainageType": "DRY",
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
          "createdAt": "string",
          "updatedAt": "string",
          "url": "string"
        }
      ],
      "comment": "string"
    }
  ],
  "customers": [
    {
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
    }
  ],
  "contractors": [
    {
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
    }
  ],
  "networkContractors": [
    {
      "id": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "companyName": "string",
      "address": "string",
      "contacts": "string",
      "website": "string",
      "serviceDescription": "string",
      "category": {
        "id": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "name": "string",
        "published": true
      },
      "logoUrl": "string"
    }
  ]
}
```
