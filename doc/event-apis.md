## API Documentation

##### Available Event Types
```
export enum EventType {
  YourProjectIsApproved = 'YOUR_PROJECT_IS_APPROVED',
  YourProjectHasUpdated = 'YOUR_PROJECT_HAS_UPDATED',
  YouHaveNewEstimate = 'YOU_HAVE_NEW_ESTIMATE',
  YouHaveNewProposal = 'YOU_HAVE_NEW_PROPOSAL',
  YourProposalHasBeenChanged = 'YOUR_PROPOSAL_HAS_BEEN_CHANGED',
  YouHaveNewMilestonePaymentRequest = 'YOU_HAVE_NEW_MILESTONE_PAYMENT_REQUEST',
  YourApplicationIsApproved = 'YOUR_APPLICATION_IS_APPROVED',
  YouHaveNewSiteVisitScheduled = 'YOU_HAVE_NEW_SITE_VISIT_SCHEDULED',
  YourMilestoneHasBeenPaid = 'YOUR_MILESTONE_HAS_BEEN_PAID',
  YourMilestoneHasBeenChanged = 'YOUR_MILESTONE_HAS_BEEN_CHANGED',
  YourProposalHasBeenAccepted = 'YOUR_PROPOSAL_HAS_BEEN_ACCEPTED',
  NewProjectHasBeenRegistered = 'NEW_PROJECT_HAS_BEEN_REGISTERED',
  EstimateHasBeenAccepted = 'ESTIMATE_HAS_BEEN_ACCEPTED',
  EstimateHasBeenDeclined = 'ESTIMATE_HAS_BEEN_DECLINED',
  FinalProposalHasBeenAccepted = 'FINAL_PROPOSAL_HAS_BEEN_ACCEPTED',
  FinalProposalHasBeenDeclined = 'FINAL_PROPOSAL_HAS_BEEN_DECLINED',
  UserRegisteredEvent = 'NEW_USER_REGISTERED',
  CustomerReleasedMilestoneEvent = 'CUSTOMER_RELEASE_MILESTONE',
  ContractorRequestedToReleaseMilestone = 'CONTRACTOR_REQUESTED_TO_RELEASE_MILESTONE',
}
```

##### GET /api/event/all
* Get events per requested user
```
  skip: skip entries
  take: take amount
``` 
* Return all unread events but with **Pagination**
```
{
  "events": [
    {
      "id": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "user": {
        "id": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "email": "string",
        "firstName": "string",
        "lastName": "string",
        "phone": "string",
        "isEmailVerified": false,
        "role": "CONTRACTOR"
      },
      "type": "YOUR_PROJECT_IS_APPROVED",
      "message": "string",
      "readAt": "string",
      "image": "string",
      "meta": {}
    }
  ],
  "total": 0
}
```

#### POST /api/event/read/all
* Mark all as read
* Success response

#### POST /api/event/{eventId}/read
* Mark specific event as read
* Success response
