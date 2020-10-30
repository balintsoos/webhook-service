import amqplib, { Connection, Channel, ConsumeMessage } from "amqplib";
import mongoose from "mongoose";
import { config } from "../../config";
import { createMessage, parseContent } from "./helpers";
import { Event } from "../../modules/events";
import { notificationsModule } from "../../modules/notifications";
import { subscriptionsModule, Subscription } from "../../modules/subscriptions";
import { createLogger } from "../../modules/logger";

const logger = createLogger("event-worker");

mongoose.connect(config.database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  const connection = await amqplib.connect(config.queue.url);
  const channel = await connection.createChannel();
  await channel.assertQueue(config.queue.events);
  await channel.assertQueue(config.queue.notifications);
  await channel.prefetch(1);

  const { consumerTag } = await channel.consume(
    config.queue.events,
    onMessage(connection, channel)
  );

  process.on("SIGTERM", async () => {
    await channel.cancel(consumerTag);
    await connection.close();
    logger.info("stopped");
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await channel.cancel(consumerTag);
    await connection.close();
    logger.info("stopped");
    process.exit(0);
  });
})();

function onMessage(connection: Connection, channel: Channel) {
  return async (message: ConsumeMessage | null): Promise<void> => {
    if (!message) {
      await connection.close();
      logger.error("consumer canceled");
      process.exit(0);
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

logger.info("started");
