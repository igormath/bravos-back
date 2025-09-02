import { Router } from "express";
import {
    createAthleteController,
    getAthletesController,
} from "../controllers/athlete.controller";

const athleteRoutes = Router();

athleteRoutes.post("/", createAthleteController);
athleteRoutes.get("/", getAthletesController);

export default athleteRoutes;
