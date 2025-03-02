import { Router } from "express";
import {
  createProject,
  getPaidStatus,
  getProjectIdByName,
  setPaidStatusFalse,
  setPaidStatusTrue,
} from "../../functions/projects";
import logger from "../../utils/logger";

const projectRouterV2 = Router();

projectRouterV2.post("/createproject/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const result = await createProject(name, req);
    logger.info(`Project created: ${name}`);
    res
      .status(201)
      .json({ message: "Project created successfully", data: result });
  } catch (error: any) {
    logger.error(`Error creating project: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to create project", error: error.message });
  }
});

projectRouterV2.get("/getpaidstatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getPaidStatus(id);
    logger.info(`Retrieved paid status for project ${id}`);
    res.status(200).json({ message: "Paid status retrieved", data: result });
  } catch (error: any) {
    logger.error(
      `Error retrieving paid status for ${req.params.id}: ${error.message}`
    );
    res
      .status(500)
      .json({ message: "Failed to get paid status", error: error.message });
  }
});

projectRouterV2.post("/setpaidtofalse/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await setPaidStatusFalse(id);
    logger.info(`Set paidStatus to FALSE for project ${id}`);
    res.status(200).json({ message: "Paid status set to false" });
  } catch (error: any) {
    logger.error(
      `Error setting paidStatus to FALSE for ${req.params.id}: ${error.message}`
    );
    res.status(500).json({
      message: "Failed to set paid status to false",
      error: error.message,
    });
  }
});

projectRouterV2.post("/setpaidtotrue/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await setPaidStatusTrue(id);
    logger.info(`Set paidStatus to TRUE for project ${id}`);
    res.status(200).json({ message: "Paid status set to true" });
  } catch (error: any) {
    logger.error(
      `Error setting paidStatus to TRUE for ${req.params.id}: ${error.message}`
    );
    res.status(500).json({
      message: "Failed to set paid status to true",
      error: error.message,
    });
  }
});

projectRouterV2.get("/getprojectid/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const result = await getProjectIdByName(name);
    logger.info(`Retrieved project ID for name: ${name}`);
    res.status(200).json({ message: "Project ID retrieved", data: result });
  } catch (error: any) {
    logger.error(
      `Error retrieving project ID for ${req.params.name}: ${error.message}`
    );
    res
      .status(500)
      .json({ message: "Failed to get project ID", error: error.message });
  }
});

export default projectRouterV2;
