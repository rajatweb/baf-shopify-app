import "dotenv/config";
import prisma from "./prisma";
import { Session } from "@shopify/shopify-api";
import { encryptData, decryptData } from "./encryption";

export const storeSession = async (session: any) => {
  try {
    // Upsert session data into the database
    await prisma.session.upsert({
      where: { id: session.id },
      update: {
        shop: session.shop,
        content: encryptData(session),
        isOnline: session.isOnline,
      },
      create: {
        id: session.id,
        shop: session.shop,
        content: encryptData(session),
        isOnline: session.isOnline,
      },
    });

    return true;
  } catch (err) {
    console.error("Failed to store session:", err);
    return false;
  }
};

export const loadSession = async (id: string) => {
  try {
    // Find session by ID
    const session = await prisma.session.findUnique({
      where: { id }, // Ensure the ID is properly cast to a number
    });
    if (session) {
      const sessionObj = decryptData(session?.content) || "{}";
      const returnSession = new Session(sessionObj);
      return returnSession;
    }

    return session;
  } catch (err) {
    console.error("Failed to load session:", err);
    return undefined;
  }
};

export const deleteSession = async (id: string) => {
  try {
    // Delete session by ID
    await prisma.session.delete({
      where: { id }, // Ensure the ID is properly cast to a number
    });

    return true;
  } catch (err) {
    console.error("Failed to delete session:", err);
    return false;
  }
};

// Export all session handlers as a default export
const sessionHandler = { storeSession, loadSession, deleteSession };

export default sessionHandler;