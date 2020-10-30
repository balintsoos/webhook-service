import { createHmac } from "crypto";

export type CreateHmacSha256 = (data: string, secret: string) => string;

export const createHmacSha256: CreateHmacSha256 = (data, secret) =>
  createHmac("sha256", secret).update(data).digest("base64");
