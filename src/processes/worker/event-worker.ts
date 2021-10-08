import amqplib, { Connection, Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { config } from "../../config";
import { createMessage, parseContent } from "./helpers";
import { Event } from "../../modules/events";
import { notificationsModule } from "../../modules/notifications";
import { subscriptionsModule, Subscription } from "../../modules/subscriptions";
import { createLogger } from "../../modules/logger";

const logger = createLogger("event-worker");

(async () => {
  await mongoose.connect(config.database.url);
  const connection = await amqplib.connect(config.queue.url);
  const channel = await connection.createChannel();
  await channel.assertQueue(config.queue.events);
  await channel.assertQueue(config.queue.notifications);
  await channel.prefetch(1);

  const { consumerTag } = await channel.consume(
    config.queue.events,
    onMessage(connection, channel)
  );

  const onTermination = async () => {
    logger.info("stopped");
    await channel.cancel(consumerTag);
    await connection.close();
    process.exit();
  };

  process.on("SIGTERM", onTermination);
  process.on("SIGINT", onTermination);

  logger.info("started");
})();

function onMessage(connection: Connection, channel: Channel) {
  return async (message: ConsumeMessage | null): Promise<void> => {
    if (!message) {
      logger.error("consumer canceled");
      await connection.close();
      process.exit(1);
    }

    const event = parseContent<Event>(message);
    logger.info("event received");
    subscriptionsModule
      .getSubscriptions(event.partner, event.type)
      .on("data", onSubscription(channel, event))
      .on("end", () => {
        channel.ack(message);
        logger.info("event processed");
      })
      .on("error", (error) => {
        channel.nack(message);
        logger.error("event processing failed", { error });
      });
  };
}

function onSubscription(channel: Channel, event: Event) {
  return (subscription: Subscription): void => {
    const { address, secret } = subscription;
    const payload = { event };
    const notification = notificationsModule.createNotification(
      address,
      payload,
      secret
    );
    channel.sendToQueue(
      config.queue.notifications,
      createMessage(notification)
    );
    logger.info("notification published");
  };
}
