import amqplib, { Connection, Channel, ConsumeMessage } from "amqplib";
import { config } from "../../config";
import { parseContent } from "./helpers";
import { Notification, notificationsModule } from "../../modules/notifications";
import { createLogger } from "../../modules/logger";

const logger = createLogger("notification-logger");

(async () => {
  const connection = await amqplib.connect(config.queue.url);
  const channel = await connection.createChannel();
  await channel.assertQueue(config.queue.notifications);
  await channel.prefetch(1);

  const { consumerTag } = await channel.consume(
    config.queue.notifications,
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

    const notification = parseContent<Notification>(message);
    logger.info("notification received", { notification });
    try {
      await notificationsModule.sendNotification(notification);
      channel.ack(message);
      logger.info("notification success", { notification });
    } catch (error) {
      channel.nack(message);
      logger.error("notification failed", { error });
    }
  };
}

logger.info("started");
