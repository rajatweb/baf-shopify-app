import "dotenv/config";
import Cryptr from "cryptr";

// Initialize Cryptr with the encryption key from the environment variables
const cryption = new Cryptr(process.env.ENCRYPTION_KEY as string);

/**
 * Encrypts data, handling both strings and objects.
 */
export const encryptData = (data: any): string => {
  if (!data) return "";
  const stringData = typeof data === "string" ? data : JSON.stringify(data);
  return cryption.encrypt(stringData);
};

/**
 * Decrypts data and automatically parses JSON if applicable.
 */
export const decryptData = (encryptedData: string): any => {
  if (!encryptedData) return null;
  const decrypted = cryption.decrypt(encryptedData);
  try {
    return JSON.parse(decrypted); // Attempt to parse JSON
  } catch {
    return decrypted; // Return as string if parsing fails
  }
};