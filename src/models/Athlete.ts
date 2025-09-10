import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";

interface AthleteAttributes {
    id?: number;
    name: string;
    gender: "Masculino" | "Feminino";
    prova: string;
    peso: string;
    time: string;
}

class Athlete extends Model<AthleteAttributes> implements AthleteAttributes {
    public id!: number;
    public name!: string;
    public gender!: "Masculino" | "Feminino";
    public prova!: string;
    public peso!: string;
    public time!: string;
}

Athlete.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prova: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        peso: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "athletes",
        timestamps: false,
    },
);

export default Athlete;
