import Axios from "axios";
import { securityModule } from "../security";
import {
  CreateNotification,
  createNotification,
  sendNotification,
  SendNotification,
} from "./actions";

export interface NotificationsModule {
  createNotification: CreateNotification;
  sendNotification: SendNotification;
}

export const notificationsModule: NotificationsModule = {
  createNotification: createNotification({
    createSignature: securityModule.createHmacSha256,
  }),
  sendNotification: sendNotification({
    post: Axios.post,
  }),
};
