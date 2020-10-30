import mongoose from "mongoose";
import { Subscription } from "./subscriptions.interface";

const subscriptionSchema = new mongoose.Schema(
  {
    partner: { type: Number, required: true },
    address: { type: String, required: true },
    event: { type: String, required: true },
    secret: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionsModel = mongoose.model<Subscription>(
  "Subscription",
  subscriptionSchema
);
