import { randomBytes } from "crypto";

export type CreateRandomToken = () => Promise<string>;

export const createRandomToken: CreateRandomToken = () => {
  return new Promise((resolve, reject) => {
    randomBytes(48, (error, buffer) => {
      if (error) {
        reject(error);
      }
      resolve(buffer.toString("base64"));
    });
  });
};
