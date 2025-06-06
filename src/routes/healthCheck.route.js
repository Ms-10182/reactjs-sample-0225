import { healthCheck } from "../controllers/healthcheck.controller.js";
import { Router } from "express";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.route("/").get(healthCheck);

// Test routes for error handling
router.route("/test-error").get(asyncHandler(async (req, res) => {
    throw new ApiError(400, "This is a test error");
}));

router.route("/test-server-error").get(asyncHandler(async (req, res) => {
    throw new Error("This is an unhandled server error");
}));

export default router;
