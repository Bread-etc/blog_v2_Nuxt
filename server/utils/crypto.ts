/**
 * 加密解密工具类
 */
import crypto from "crypto";

export class CryptoUtils {
  /**
   * RSA解密
   * @param encryptedContent 加密的base64内容
   * @param privateKey RSA私钥
   * @returns 解密后的字符串
   */
  static decrypt(encryptedContent: string, privateKey: string): string {
    try {
      if (!encryptedContent || !privateKey) {
        throw new Error("加密内容和私钥都是必需的");
      }

      // 验证base64格式
      if (!this.isValidBase64(encryptedContent)) {
        throw new Error("无效的base64格式");
      }

      const buffer = Buffer.from(encryptedContent, "base64");
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        buffer as any,
      );

      return decrypted.toString("utf8");
    } catch (error: any) {
      if (error.code === "ERR_OSSL_RSA_OAEP_DECODING_ERROR") {
        throw new Error("解密失败：内容可能已损坏或使用了错误的密钥");
      }
      throw new Error(`RSA解密失败：${error.message}`);
    }
  }

  /**
   * RSA加密
   * @param content 要加密的内容
   * @param publicKey RSA公钥
   * @returns 加密后的base64字符串
   */
  static encrypt(content: string, publicKey: string): string {
    try {
      if (!content || !publicKey) {
        throw new Error("内容和公钥都是必需的");
      }

      const buffer = Buffer.from(content, "utf8");
      const encrypted = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        buffer as any,
      );

      return encrypted.toString("base64");
    } catch (error: any) {
      throw new Error(`RSA加密失败：${error.message}`);
    }
  }

  /**
   * 生成密码哈希
   * @param password 明文密码
   * @param salt 盐值
   * @returns 哈希后的密码和盐值
   */
  static hashPassword(
    password: string,
    salt?: string,
  ): { hash: string; salt: string } {
    try {
      const actualSalt = salt || crypto.randomBytes(16).toString("hex");
      const hash = crypto
        .pbkdf2Sync(password, actualSalt, 10000, 64, "sha512")
        .toString("hex");

      return { hash, salt: actualSalt };
    } catch (error: any) {
      throw new Error(`密码哈希失败：${error.message}`);
    }
  }

  /**
   * 验证密码
   * @param password 明文密码
   * @param hash 存储的哈希值
   * @param salt 存储的盐值
   * @returns 是否匹配
   */
  static verifyPassword(password: string, hash: string, salt: string): boolean {
    try {
      const { hash: newHash } = this.hashPassword(password, salt);
      return hash === newHash;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * 验证base64格式
   * @param str 要验证的字符串
   * @returns 是否为有效的base64
   */
  private static isValidBase64(str: string): boolean {
    try {
      return Buffer.from(str, "base64").toString("base64") === str;
    } catch {
      return false;
    }
  }

  /**
   * 生成随机字符串
   * @param length 长度
   * @returns 随机字符串
   */
  static generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }
}
