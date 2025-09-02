import { Request, Response } from "express";
import {
    loginSchema,
    loginService,
    updateRepsSchema,
    updateRepsService,
    setupLanesSchema,
    setupLanesService,
    createAdminSchema,
    createAdminService,
    saveFinalResultsService,
    saveResultsSchema,
    saveResultsService,
} from "../services/admin.service";
import { ZodError, z } from "zod";
import { io } from "../main";
import { AuthRequest } from "../middleware/auth"; // Importa a interface atualizada

export const createAdminController = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        const data = createAdminSchema.parse(req.body);
        const newAdmin = await createAdminService(data);
        res.status(201).json({
            message: "Admin criado com sucesso!",
            admin: newAdmin,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json({ errors: error.flatten().fieldErrors });
        }
        res.status(409).json({ message: (error as Error).message });
    }
};

export const loginController = async (req: AuthRequest, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);
        const result = await loginService(data);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json({ errors: error.flatten().fieldErrors });
        }
        res.status(401).json({ message: (error as Error).message });
    }
};

export const saveFinalResultsController = async (
    req: AuthRequest,
    res: Response,
) => {
    try {
        const result = await saveFinalResultsService();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateRepsController = async (req: AuthRequest, res: Response) => {
    try {
        // Valida apenas a ação (increment/decrement)
        const { action } = updateRepsSchema.parse(req.body);

        // Pega o laneNumber do admin autenticado, que foi adicionado pelo middleware
        const laneNumber = req.admin?.laneNumber;
        if (laneNumber === undefined) {
            return res
                .status(403)
                .json({ message: "Admin não associado a uma raia." });
        }

        const updatedRepetition = await updateRepsService(action, laneNumber);

        // Emite o evento para o front-end
        io.emit("update-reps", {
            athleteId: updatedRepetition.athleteId,
            count: updatedRepetition.count,
        });

        res.status(200).json(updatedRepetition);
    } catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json({ errors: z.treeifyError(error).errors });
        }
        res.status(500).json({ message: (error as Error).message });
    }
};

export const setupLanesController = (req: Request, res: Response) => {
    try {
        const lanes = setupLanesSchema.parse(req.body);
        const result = setupLanesService(lanes);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json({ errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: (error as Error).message });
    }
};

export const saveResultsController = async (req: Request, res: Response) => {
    try {
        const data = saveResultsSchema.parse(req.body);
        const newResults = await saveResultsService(data);
        res.status(201).json({
            message: "Resultados salvos com sucesso!",
            results: newResults,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json({ errors: error.flatten().fieldErrors });
        }
        res.status(500).json({ message: (error as Error).message });
    }
};
