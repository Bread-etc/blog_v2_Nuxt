/**
 * 使用 Jsencrypt 实现 RSA 加密
 */
import JSEncrypt from "jsencrypt";

// 调用API获取公钥
async function fetchPublicKey(): Promise<string> {
  try {
    const { publicKey } = useApi();
    const res = await publicKey.getPublicKey();
    const data = res.data;
    return data;
  } catch (error) {
    console.error("Failed to fetch public key", error);
    throw new Error("Failed to fetch public key");
  }
}

async function encryptContent(username: string, password: string) {
  // 获取公钥
  let publicKey = await fetchPublicKey();

  // 加密器
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  const encryptedUsername = encryptor.encrypt(username);
  const encryptedPassword = encryptor.encrypt(password);

  if (!encryptedUsername || !encryptedPassword) {
    throw new Error("Failed to encrypt content");
  }

  return { username: encryptedUsername, password: encryptedPassword };
}

export const encrypt = { encryptContent, fetchPublicKey };
