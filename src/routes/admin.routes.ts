import { Router } from "express";
import {
    loginController,
    updateRepsController,
    setupLanesController,
    createAdminController,
    saveFinalResultsController,
    saveResultsController,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth";

const adminRoutes = Router();

// Rotas de setup
adminRoutes.post("/create", createAdminController);
adminRoutes.post("/login", loginController);

// Rota da competição
adminRoutes.post("/setup-lanes", setupLanesController);
adminRoutes.post("/save-results", authMiddleware, saveFinalResultsController);
adminRoutes.post("/results", authMiddleware, saveResultsController);

export default adminRoutes;
