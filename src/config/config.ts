export interface Config {
  database: {
    url: string;
  };
  queue: {
    url: string;
    events: string;
    notifications: string;
  };
  web: {
    port: number;
  };
}

export const config: Config = {
  database: {
    url: process.env.DATABASE_URL ?? "mongodb://localhost/webhook",
  },
  queue: {
    url: process.env.QUEUE_URL ?? "amqp://localhost",
    events: process.env.EVENT_QUEUE_NAME ?? "events",
    notifications: process.env.NOTIFICATION_QUEUE_NAME ?? "notifications",
  },
  web: {
    port: parseInt(process.env.PORT ?? "3000"),
  },
};
