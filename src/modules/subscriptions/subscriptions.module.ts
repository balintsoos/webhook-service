import { securityModule } from "../security";
import { getSubscriptions, GetSubscriptions } from "./actions";
import { subscribe, Subscribe } from "./actions/subscribe/subscribe";

export interface SubscriptionsModule {
  getSubscriptions: GetSubscriptions;
  subscribe: Subscribe;
}

export const subscriptionsModule: SubscriptionsModule = {
  getSubscriptions,
  subscribe: subscribe({
    createSecret: securityModule.createRandomToken,
  }),
};
