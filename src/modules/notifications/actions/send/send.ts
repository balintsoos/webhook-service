import { AxiosInstance } from "axios";
import { Notification } from "../../notifications.interface";

export type SendNotification = (notification: Notification) => Promise<void>;

export interface SendNotificationStrategy {
  post: AxiosInstance["post"];
}

export const sendNotification = (
  strategy: SendNotificationStrategy
): SendNotification => async (notification) => {
  const { address, payload, signature } = notification;
  const response = await strategy.post(address, payload, {
    headers: {
      "X-Webhook-Signature": signature,
    },
    timeout: 1000,
  });
  if (response.status !== 200) {
    throw new Error("Non-200 response received");
  }
};
