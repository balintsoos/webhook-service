import { Document } from "mongoose";

export interface Subscription extends Document {
  partner: number;
  address: string;
  event: string;
  secret: string;
}
