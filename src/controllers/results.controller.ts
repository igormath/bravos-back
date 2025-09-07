import { Request, Response } from "express";
import { getResultsService } from "../services/admin.service";

export const getResultsController = async (req: Request, res: Response) => {
  try {
    const results = await getResultsService();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
