/**
 * 使用 node-forge 实现 RSA 加密
 */
import forge, { md } from "node-forge";

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
  let publicKeyPem = await fetchPublicKey();

  // 解析公钥
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  // 加密内容
  const encryptedUsername = forge.util.encode64(
    publicKey.encrypt(username, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    })
  );

  const encryptedPassword = forge.util.encode64(
    publicKey.encrypt(password, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    })
  );

  return { username: encryptedUsername, password: encryptedPassword };
}

export const encrypt = { encryptContent, fetchPublicKey };
