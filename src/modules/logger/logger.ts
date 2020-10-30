import winston from "winston";

export const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "webhook-service" },
  transports: [new winston.transports.Console()],
});
