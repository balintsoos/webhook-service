import {
  CreateHmacSha256,
  createHmacSha256,
  CreateRandomToken,
  createRandomToken,
} from "./actions";

export interface SecurityModule {
  createHmacSha256: CreateHmacSha256;
  createRandomToken: CreateRandomToken;
}

export const securityModule: SecurityModule = {
  createHmacSha256,
  createRandomToken,
};
