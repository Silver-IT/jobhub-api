import { DeclineReason } from '../enums';

export const declineReasonTexts = {
  [DeclineReason.BudgetMismatch]: 'The project price is higher than we expected, so we are not interested in moving forward.',
  [DeclineReason.NotReady]: 'We are not ready at the moment, but we will definitely be interested to proceed in the future.',
  [DeclineReason.ChosenAnotherContractor]: 'We have chosen another contractor for this project.',
};
