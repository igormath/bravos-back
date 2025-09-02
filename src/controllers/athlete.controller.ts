import { Request, Response } from "express";
import {
  createAthleteSchema,
  createAthleteService,
  getAthletesService,
} from "../services/admin.service";
import { ZodError } from "zod";

export const createAthleteController = async (req: Request, res: Response) => {
  try {
    const data = createAthleteSchema.parse(req.body);
    const newAthlete = await createAthleteService(data);
    res
      .status(201)
      .json({ message: "Atleta criado com sucesso!", athlete: newAthlete });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(409).json({ message: (error as Error).message });
  }
};

export const getAthletesController = async (req: Request, res: Response) => {
  try {
    const athletes = await getAthletesService();
    res.status(200).json(athletes);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
