import { Sequelize } from "sequelize";
import "dotenv/config";
import { initializeModels } from "./model-initializer";

if (!process.env.DATABASE_PATH) {
    console.error("Variável de ambiente DATABASE_PATH não definida.");
    process.exit(1);
}

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DATABASE_PATH,
    logging: false,
});

initializeModels(sequelize);

export const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
        await sequelize.sync({ alter: true });
        console.log("Todos os modelos foram sincronizados com sucesso.");
    } catch (error) {
        console.error("Não foi possível conectar ao banco de dados: ", error);
    }
};

export default sequelize;
