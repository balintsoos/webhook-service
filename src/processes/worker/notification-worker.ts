import amqplib, { Connection, Channel, ConsumeMessage } from "amqplib";
import { config } from "../../config";
import { parseContent } from "./helpers";
import { Notification, notificationsModule } from "../../modules/notifications";
import { logger } from "../../modules/logger";

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
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await channel.cancel(consumerTag);
    await connection.close();
    process.exit(0);
  });
})();

function onMessage(connection: Connection, channel: Channel) {
  return async (message: ConsumeMessage | null): Promise<void> => {
    if (!message) {
      await connection.close();
      process.exit(0);
    }

    const notification = parseContent<Notification>(message);
    logger.info("notification received", { notification });
    try {
      await notificationsModule.sendNotification(notification);
      logger.info("notification success", { notification });
      channel.ack(message);
    } catch (error) {
      logger.error("notification failed", { error });
      channel.nack(message);
    }
  };
}

logger.info("notification worker started");
