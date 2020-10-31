/* eslint-disable @typescript-eslint/no-non-null-assertion */

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
    url: process.env.DATABASE_URL!,
  },
  queue: {
    url: process.env.QUEUE_URL!,
    events: "events",
    notifications: "notifications",
  },
  web: {
    port: parseInt(process.env.PORT!),
  },
};
