import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import * as Plaid from 'plaid';

import { Project } from '../project/entities/project.entity';
import { Milestone } from '../project/entities/milestone.entity';
import { PaymentAddOn } from './entities/payment-add-on.entity';

@Injectable()
export class PaymentService {

  stripe = null;
  plaidClient = null;

  async ytd(): Promise<number> {
    this.initStripe();
    const fromDate = new Date();
    fromDate.setMonth(0);
    fromDate.setDate(0);
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);
    const payouts = await this.stripe.payouts.list({
      // eslint-disable-next-line @typescript-eslint/camelcase
      arrival_date: { gt: fromDate.getTime() / 1000 },
      status: 'paid',
    });
    let sum = 0;
    payouts.data.forEach(payout => sum += payout.amount);
    return sum / 100; // convert to cent
  }

  async createPaymentIntent(amount: number, customer: string, confirm = false): Promise<[string, string]> {
    this.initStripe();
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        customer,
        confirm,
      });
      return [paymentIntent.id, paymentIntent.client_secret];
    } catch (e) {
      throw e;
    }
  }

  async createCustomer(name: string, email: string): Promise<string> {
    this.initStripe();
    const customer = await this.stripe.customers.create({ name, email });
    return customer.id;
  }

  createPaymentEvent(signature: string, requestBody: any): [string, string] {
    this.initStripe();
    try {
      const event = this.stripe.webhooks.constructEvent(
        requestBody,
        signature,
        process.env.STRIPE_WEB_HOOK_SECRET,
      );
      const pi = event.data.object as Stripe.PaymentIntent;
      return [pi.id, event.type];
    } catch (e) {
      throw e;
    }
  }

  retrievePayment(paymentIntentId: string): Promise<any> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async createBankAccountToken(plaidPublicToken: string, accountId: string): Promise<string> {
    try {
      this.initStripe();
      const res1 = await this.plaidClient.exchangePublicToken(plaidPublicToken);
      const res2 = await this.plaidClient.createStripeToken(res1.access_token, accountId);
      return res2.stripe_bank_account_token;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async makeCharge(source: string, amount: number, description: string) {
    try {
      await this.stripe.charges.create({
        amount,
        currency: 'usd',
        source,
        description,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updateCustomerBankToken(customerId: string, token: string): Promise<string> {
    try {
      await this.stripe.customers.update(customerId, {
        source: token,
      });
      return customerId;
    } catch (e) {
      throw e;
    }
  }

  private initStripe() {
    if (!this.stripe) {
      this.stripe = new Stripe(process.env.STRIPE_SK, {
        apiVersion: '2020-03-02',
        typescript: true,
      });
    }
    if (!this.plaidClient) {
      this.plaidClient = new Plaid.Client(
        process.env.PLAID_CLIENT_ID,
        process.env.PLAID_SECRET_KEY,
        process.env.PLAID_PUBLIC_KEY,
        process.env.SANDBOX_MODE ? Plaid.environments.sandbox : Plaid.environments.production,
      );
    }
  }

  addOnAmountFromMilestone(milestone: Milestone): number {
    const addOnReducer = (sum, addOn: PaymentAddOn) => sum + addOn.amount;
    return milestone.paymentAddOns.reduce(addOnReducer, 0);
  }

  addOnAmountFromProject(project: Project): number {
    const addOnReducer = (sum, milestone: Milestone) => sum + this.addOnAmountFromMilestone(milestone);
    return project.milestones.reduce(addOnReducer, 0);
  }
}
