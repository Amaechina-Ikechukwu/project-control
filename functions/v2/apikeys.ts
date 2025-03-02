import { getDatabase } from "firebase-admin/database";
import { randomBytes } from "crypto";

export const createApiKey = async (
  user: string,
  project: string
): Promise<string> => {
  const db = getDatabase();
  const apiKey = randomBytes(32).toString("hex"); // 64-char key
  const apiKeyRef = db.ref(`apiKeys/${user}/${project}`);

  await apiKeyRef.set({ apiKey, createdAt: new Date().toISOString() });

  return apiKey;
};

/**
 * Finds the project associated with a given API key.
 * @param user - The user ID.
 * @param apiKey - The API key to search for.
 * @returns The project name or null if not found.
 */
export const getProjectByApiKey = async (
  user: string,
  apiKey: string
): Promise<string | null> => {
  const db = getDatabase();
  const userApiKeysRef = db.ref(`apiKeys/${user}`);

  // Fetch all projects under the user
  const snapshot = await userApiKeysRef.once("value");

  if (!snapshot.exists()) return null;

  // Iterate through projects to find a matching API key
  const projects = snapshot.val();
  for (const project in projects) {
    if (projects[project].apiKey === apiKey) {
      return project; // Return project name if key matches
    }
  }

  return null; // No match found
};
/**
 * Retrieves an API key for a given user and project.
 * @param user - The user ID or username.
 * @param project - The project ID or name.
 * @returns A promise resolving to the API key or null if not found.
 */
export const getApiKey = async (
  user: string,
  project: string
): Promise<string | null> => {
  try {
    const db = getDatabase();
    const apiKeyRef = db.ref(`apiKeys/${user}/${project}/apiKey`);

    const snapshot = await apiKeyRef.once("value");

    if (!snapshot.exists()) {
      const apiKey = await createApiKey(user, project);
      return apiKey; // API key not found
    }

    return snapshot.val(); // Return the stored API key
  } catch (error: any) {
    throw new Error(`Failed to get API key: ${error.message}`);
  }
};
