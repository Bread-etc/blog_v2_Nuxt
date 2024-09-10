import crypto from "crypto";
import {
  useErrorWrapper,
  useResponseWrapper,
} from "~/server/utils/responseWrapper";

// 生成 RSA 密钥对
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

export default defineEventHandler((event) => {
  try {
    return useResponseWrapper(publicKey);
  } catch (error) {
    return useErrorWrapper(error, 500);
  }
});

export { privateKey };
