import { QueryCursor } from "mongoose";
import { Subscription } from "../../subscriptions.interface";
import { SubscriptionsModel } from "../../subscriptions.model";

export type GetSubscriptions = (
  partner: Subscription["partner"],
  event: Subscription["event"]
) => QueryCursor<Subscription>;

export const getSubscriptions: GetSubscriptions = (partner, event) => {
  return SubscriptionsModel.find({ partner, event }).lean().cursor();
};
