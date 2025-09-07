import { Router } from "express";
import { getResultsController } from "../controllers/results.controller";

const resultsRoutes = Router();

resultsRoutes.get("/", getResultsController);

export default resultsRoutes;
