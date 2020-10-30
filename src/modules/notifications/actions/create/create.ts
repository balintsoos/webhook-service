import { Notification } from "../../notifications.interface";

export type CreateNotification = (
  address: Notification["address"],
  payload: Notification["payload"],
  secret: string
) => Notification;

export interface CreateNotificationStrategy {
  createSignature: (data: string, secret: string) => string;
}

export const createNotification = (
  strategy: CreateNotificationStrategy
): CreateNotification => (address, payload, secret) => {
  const signature = strategy.createSignature(
    JSON.stringify({ address, payload }),
    secret
  );
  return { address, payload, signature };
};
