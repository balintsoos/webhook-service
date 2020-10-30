import { ConsumeMessage } from "amqplib";

export const parseContent = <T>(message: ConsumeMessage): T =>
  JSON.parse(message.content.toString());

export const createMessage = (data: unknown): Buffer =>
  Buffer.from(JSON.stringify(data));

export const elapsedTime = (startTime: number): number =>
  Date.now() - startTime;
