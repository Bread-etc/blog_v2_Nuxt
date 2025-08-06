import crypto from "crypto";

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
    return createSuccessResponse(publicKey, "获取RSA密钥对成功", 200);
  } catch (error) {
    return createErrorResponse("获取RSA密钥对出错:" + error, 500, false);
  }
});

export { privateKey };
