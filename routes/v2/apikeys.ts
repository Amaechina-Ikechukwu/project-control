import { Router } from "express";

import logger from "../../utils/logger";
import { createApiKey, getApiKey } from "../../functions/v2/apikeys";

const apiRouterV2 = Router();

apiRouterV2.get("/apikeys/:project", async (req, res) => {
  try {
    const { project } = req.params;
    const result = await getApiKey(req?.user, project);

    res
      .status(200)
      .json({ message: "Project created successfully", data: result });
  } catch (error: any) {
    logger.error(`Error creating project: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to create project", error: error.message });
  }
});
