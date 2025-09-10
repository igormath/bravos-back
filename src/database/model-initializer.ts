import { Sequelize } from "sequelize";
import Admin from "../models/Admin";
import Athlete from "../models/Athlete";
import Repetition from "../models/Repetitions";
import Resultado from "../models/Resultados";

export const initializeModels = (sequelize: Sequelize) => {
    Admin.init(Admin.getAttributes(), { sequelize, tableName: "admins", timestamps: false });
    Athlete.init(Athlete.getAttributes(), { sequelize, tableName: "athletes", timestamps: false });
    Repetition.init(Repetition.getAttributes(), { sequelize, tableName: "repetitions", timestamps: true });
    Resultado.init(Resultado.getAttributes(), { sequelize, tableName: "resultados", timestamps: true });
};
