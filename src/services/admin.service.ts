import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import Repetition from "../models/Repetitions";
import { Op } from "sequelize";
import { getCompetitionState } from "../main";
import Athlete from "../models/Athlete";
import Resultado from "../models/Resultados";

// Mapa em memória para associar raias a atletas
// Em um cenário de produção, isso poderia ser armazenado no banco de dados
const laneToAthleteMap = new Map<number, string | number>();

export const setLaneAthlete = (
    laneNumber: number,
    athleteId: string | number,
) => {
    laneToAthleteMap.set(laneNumber, athleteId);
    console.log(`Raia ${laneNumber} associada ao atleta ${athleteId}`);
};

// Esquemas de validação
export const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export const updateRepsSchema = z.object({
    action: z.enum(["increment", "decrement"]),
});

export const createAdminSchema = z.object({
    username: z
        .string()
        .min(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    laneNumber: z.number().int().min(0, "O número da raia é obrigatório."),
});

export const createAdminService = async (
    data: z.infer<typeof createAdminSchema>,
) => {
    const { username, password, laneNumber } = data;
    const existingAdmin = await Admin.findOne({
        where: { [Op.or]: [{ username }, { laneNumber }] },
    });
    if (existingAdmin) {
        throw new Error("Usuário ou raia já em uso.");
    }
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const newAdmin = await Admin.create({
        username,
        passwordHash,
        laneNumber,
    });
    const { passwordHash: _, ...adminData } = newAdmin.toJSON();
    return adminData;
};

/**
 * Serviço de login que agora inclui 'laneNumber' no token.
 */
export const loginService = async (data: z.infer<typeof loginSchema>) => {
    const { username, password } = data;
    const admin = await Admin.findOne({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
        throw new Error("Usuário ou senha inválidos");
    }
    const token = jwt.sign(
        { id: admin.id, laneNumber: admin.laneNumber },
        process.env.JWT_SECRET!,
        { expiresIn: "8h" },
    );
    return { token, laneNumber: admin.laneNumber };
};

/**
 * Serviço que atualiza repetições com base na raia do admin autenticado.
 */
export const updateRepsService = async (
    action: "increment" | "decrement",
    laneNumber: number,
) => {
    const athleteId = laneToAthleteMap.get(laneNumber);
    if (!athleteId) {
        throw new Error(`Nenhum atleta associado à raia ${laneNumber}`);
    }

    const [repetition] = await Repetition.findOrCreate({
        where: { athleteId },
        defaults: { athleteId, count: 0 },
    });

    if (action === "increment") {
        repetition.count += 1;
    } else if (action === "decrement" && repetition.count > 0) {
        repetition.count -= 1;
    }

    await repetition.save();
    return repetition;
};

// NOVAS LINHAS
export const setupLanesSchema = z.array(
    z.object({
        laneNumber: z.number().min(1),
        athleteId: z.union([z.string(), z.number()]),
    }),
);

/**
 * Serviço para configurar o mapeamento de raia para atleta.
 * @param lanes - Um array de objetos de configuração de raia.
 */
export const setupLanesService = (lanes: z.infer<typeof setupLanesSchema>) => {
    lanes.forEach(({ laneNumber, athleteId }) => {
        setLaneAthlete(laneNumber, athleteId);
    });
    // Retorna a configuração atual para confirmação
    return {
        message: "Raias configuradas com sucesso.",
        configuration: Array.from(laneToAthleteMap.entries()),
    };
};

export const saveFinalResultsService = async () => {
    const finalState = getCompetitionState();
    if (finalState.size === 0) {
        throw new Error("Nenhum dado de competição para salvar.");
    }

    const promises = [];
    for (const [athleteId, count] of finalState.entries()) {
        // 'upsert' vai criar ou atualizar o registro do atleta
        const promise = Repetition.upsert({
            athleteId,
            count,
        });
        promises.push(promise);
    }

    await Promise.all(promises);
    return {
        message: "Resultados finais salvos com sucesso!",
        results: Object.fromEntries(finalState),
    };
};

export const createAthleteSchema = z.object({
    name: z
        .string()
        .min(3, "O nome do atleta deve ter pelo menos 3 caracteres."),
    gender: z.enum(["Masculino", "Feminino"]),
    prova: z.string(),
    peso: z.string(),
    time: z.string(),
});

export const createAthleteService = async (
    data: z.infer<typeof createAthleteSchema>,
) => {
    const { name, gender, prova, peso, time } = data;
    const existingAthlete = await Athlete.findOne({ where: { name } });
    if (existingAthlete) {
        throw new Error("Atleta já cadastrado.");
    }
    const newAthlete = await Athlete.create({
        name,
        gender,
        prova,
        peso,
        time,
    });
    return newAthlete;
};

export const getAthletesService = async () => {
    const athletes = await Athlete.findAll();
    return athletes;
};

export const saveResultsSchema = z.array(
    z.object({
        athleteName: z.string(),
        modality: z.string(),
        reps: z.number(),
        gender: z.string(),
        time: z.string(),
        peso: z.string(),
    }),
);

export const saveResultsService = async (
    data: z.infer<typeof saveResultsSchema>,
) => {
    const results = await Resultado.bulkCreate(data);
    return results;
};

export const getResultsService = async () => {
    const results = await Resultado.findAll({
        order: [["reps", "DESC"]],
    });
    return results;
};

export const deleteResultService = async (id: number) => {
    const result = await Resultado.destroy({ where: { id } });
    if (result === 0) {
        throw new Error("Resultado não encontrado.");
    }
    return { message: "Resultado deletado com sucesso." };
};
