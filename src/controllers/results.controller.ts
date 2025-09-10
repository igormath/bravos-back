import { Request, Response } from "express";
import {
    getResultsService,
    deleteResultService,
} from "../services/admin.service";

export const getResultsController = async (req: Request, res: Response) => {
    try {
        const results = await getResultsService();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteResultController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await deleteResultService(Number(id));
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
};
