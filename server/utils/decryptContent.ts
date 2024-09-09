/**
 * 利用私钥对RSA加密内容进行解密
 * @param content
 * @param privateKey
 * @return decryptedContent
 */
import crypto from "crypto";

export function decryptContent(content: string, privateKey: string) {
  const buffer = Buffer.from(content, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer,
  );
  return decrypted.toString("utf8");
}
