import winston, { Logger } from "winston";

export const createLogger = (process: string): Logger => {
  return winston.createLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
    defaultMeta: {
      service: "webhook-service",
      process,
    },
  });
};
