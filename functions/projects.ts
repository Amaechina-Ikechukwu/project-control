import { getDatabase } from "firebase-admin/database";
import { randomUUID } from "crypto";
import type { Request } from "express";

/**
 * Creates a new project in the Firebase database.
 * @param name - The project name.
 * @param req - Express Request object (to get IP address).
 * @returns A success message or throws an error.
 */
const createProject = async (name: string, req: Request): Promise<string> => {
  try {
    const db = getDatabase();
    const projectsRef = db.ref("projects");

    // Check if the name already exists
    const nameExists = await checkIfProjectNameExists(name);
    if (nameExists) {
      throw new Error(`Failed to create project: Name already exists`);
    }

    // Generate a unique project ID
    const projectId = randomUUID();

    // Get the client's IP address
    const clientIP = req.ip || req.headers["x-forwarded-for"] || "Unknown";

    // Project Data
    const data = {
      projectId,
      name,
      creationDate: new Date().toISOString(),
      ipAddress: clientIP,
      createdBy: req.headers["user-agent"] || "Unknown",
      status: "active",
      paidStatus: false,
    };

    // Save data to Firebase
    await projectsRef.child(projectId).set(data);
    return `${name} successfully created with ID ${projectId}. Please note your project id`;
  } catch (error: any) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
};

/**
 * Checks if a project name already exists.
 * @param name - The project name to check.
 * @returns A promise resolving to true if the name exists, otherwise false.
 */
const checkIfProjectNameExists = (name: string): Promise<boolean> => {
  const db = getDatabase();
  const projectsRef = db.ref("projects");

  return new Promise((resolve, reject) => {
    projectsRef
      .orderByChild("name")
      .equalTo(name)
      .once(
        "value",
        (snapshot) => {
          resolve(snapshot.exists());
        },
        (error) => {
          reject(error);
        }
      );
  });
};

/**
 * Retrieves the paidStatus of a project.
 * @param projectId - The unique project ID.
 * @returns A promise resolving to the paidStatus (true/false) or null if not found.
 */
const getPaidStatus = async (projectId: string): Promise<boolean | null> => {
  try {
    const db = getDatabase();
    const projectRef = db.ref(`projects/${projectId}/paidStatus`);
    const snapshot = await projectRef.once("value");

    return snapshot.exists() ? snapshot.val() : null;
  } catch (error: any) {
    throw new Error(`Failed to get paidStatus: ${error.message}`);
  }
};

/**
 * Sets the paidStatus of a project to true.
 * @param projectId - The unique project ID.
 * @returns A success message or throws an error.
 */
const setPaidStatusTrue = async (projectId: string): Promise<string> => {
  try {
    const db = getDatabase();
    const projectRef = db.ref(`projects/${projectId}/paidStatus`);
    await projectRef.set(true);
    return `Project ${projectId} marked as paid.`;
  } catch (error: any) {
    throw new Error(`Failed to update paidStatus: ${error.message}`);
  }
};

/**
 * Sets the paidStatus of a project to false.
 * @param projectId - The unique project ID.
 * @returns A success message or throws an error.
 */
const setPaidStatusFalse = async (projectId: string): Promise<string> => {
  try {
    const db = getDatabase();
    const projectRef = db.ref(`projects/${projectId}/paidStatus`);
    await projectRef.set(false);
    return `Project ${projectId} marked as unpaid.`;
  } catch (error: any) {
    throw new Error(`Failed to update paidStatus: ${error.message}`);
  }
};
/**
 * Retrieves the projectId based on the project name.
 * @param name - The project name.
 * @returns A promise resolving to the projectId or null if not found.
 */
const getProjectIdByName = async (name: string): Promise<string | null> => {
  try {
    const db = getDatabase();
    const projectsRef = db.ref("projects");

    const snapshot = await projectsRef
      .orderByChild("name")
      .equalTo(name)
      .once("value");

    if (!snapshot.exists()) {
      return null; // Project name not found
    }

    const projectData = snapshot.val();
    const projectId = Object.keys(projectData)[0]; // Get the first matching project ID
    return projectId;
  } catch (error: any) {
    throw new Error(`Failed to get projectId: ${error.message}`);
  }
};

export {
  createProject,
  checkIfProjectNameExists,
  getPaidStatus,
  setPaidStatusTrue,
  setPaidStatusFalse,
  getProjectIdByName,
};
