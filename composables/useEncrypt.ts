/**
 * 使用 Jsencrypt 实现 RSA 加密
 */
import JSEncrypt from "jsencrypt";

// 调用API获取公钥
async function fetchPublicKey(): Promise<string> {
  try {
    const { publicKey } = useApi();
    const res = (await publicKey.getPublicKey()).data.publicKey;
    
    return res;
  } catch (error) {
    console.error("Failed to fetch public key", error);
    throw new Error("Failed to fetch public key");
  }
}

async function encryptContent(content: string) {
  // 实例化 store
  const secretStore = useSecretStore();
  let publicKey = secretStore.getSecret()?.publicKey;

  if (!publicKey) {
    publicKey = await fetchPublicKey();
    // 公钥有效期为3天
    const expiryTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 3;
    secretStore.setSecret(publicKey, expiryTime);
  }

  // 加密器
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  const encryptedContent = encryptor.encrypt(content);

  if (!encryptedContent) {
    throw new Error("Failed to encrypt content");
  }

  return encryptedContent;
}

export const encrypt = { encryptContent, fetchPublicKey };
