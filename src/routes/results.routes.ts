import { Router } from "express";
import {
    getResultsController,
    deleteResultController,
} from "../controllers/results.controller";
import { authMiddleware } from "../middleware/auth";

const resultsRoutes = Router();

resultsRoutes.get("/", getResultsController);
resultsRoutes.delete("/:id", deleteResultController);

export default resultsRoutes;
