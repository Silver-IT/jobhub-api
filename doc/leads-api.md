## API Documentation

##### GET /api/leads (authentication required)
* Gets all leads
```
skip: number
take: number
archivedType: [ACTIVE, ARCHIVED]
sortByDate: [MOST_RECENT, FROM_OLDEST]
```
```
{
  "data": {
    "id": "uuid",
    "email": "email",
    "phone": "string",
    "fullName": "string",
    "address": "string",
    "latitude": "number",
    "longitude": "number",
    "message": "string",
    "type": "eunm", LeadType,
    "patioPackage": "PatioPackage",
    "sourceFoundUs": "enum", SourceFoundUs,
    "createdAt": "date",
  },
  "count": "number"
}
```
  
##### GET /api/lead/{id} (authentication required)
* Get lead by id
```
id: lead id
```
```
{
   "id": "uuid",
   "email": "email",
   "phone": "string",
   "fullName": "string",
   "address": "string",
   "latitude": "number",
   "longitude": "number",
   "message": "string",
   "type": "eunm", LeadType,
   "patioPackage": "PatioPackage",
   "sourceFoundUs": "enum", SourceFoundUs,
}
```

##### PUT /api/lead/{id} (authentication required)
* Update lead by id
```
id: lead id
```
```
{
   "id": "uuid",
   "email": "email",
   "phone": "string",
   "fullName": "string",
   "address": "string",
   "latitude": "number",
   "longitude": "number",
   "message": "string",
   "type": "eunm", LeadType,
   "patioPackage": "PatioPackage",
   "sourceFoundUs": "enum", SourceFoundUs,
}
```

##### PUT /api/lead/{id} (authentication required)
* Update lead by id
```
{
  "email": "email",
  "phone": "string",
  "fullName": "string",
  "address": "string",
  "latitude": "number",
  "longitude": "number",
  "message": "string",
  "type": "eunm", LeadType,
  "patioPackage": "PatioPackage",
  "sourceFoundUs": "enum", SourceFoundUs,
}
```
* Returns updated lead entry
```
{
  "email": "email",
  "phone": "string",
  "fullName": "string",
  "address": "string",
  "latitude": "number",
  "longitude": "number",
  "message": "string",
  "type": "eunm", LeadType,
  "patioPackage": "PatioPackage",
  "sourceFoundUs": "enum", SourceFoundUs,
}
```

##### POST /api/lead/{id}/project
* Create a project from lead
```
id: lead id
```
* Returns created project
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
      }
    ],
    "comment": "string"
```

##### POST /api/lead/{id}/archive
* archive an existing lead
```
id: lead id
```
* returns success response
```
{
  "success": "boolean"
}
```
