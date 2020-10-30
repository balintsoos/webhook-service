import { Subscription } from "../../subscriptions.interface";
import { SubscriptionsModel } from "../../subscriptions.model";

export type Subscribe = (
  partner: Subscription["partner"],
  event: Subscription["event"],
  address: Subscription["address"]
) => Promise<Subscription>;

export interface SubscribeStrategy {
  createSecret: () => Promise<string>;
}

export const subscribe = (strategy: SubscribeStrategy): Subscribe => async (
  partner,
  event,
  address
) => {
  const secret = await strategy.createSecret();
  return SubscriptionsModel.create({ partner, event, address, secret });
};
