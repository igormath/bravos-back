import { DataTypes, Model } from "sequelize";

interface ResultadoAttributes {
    id?: number;
    athleteName: string;
    modality: string;
    reps: number;
    gender: string;
    time: string;
    peso: string;
}

class Resultado
    extends Model<ResultadoAttributes>
    implements ResultadoAttributes
{
    public id!: number;
    public athleteName!: string;
    public modality!: string;
    public reps!: number;
    public gender!: string;
    public time!: string;
    public peso!: string;

    public static getAttributes() {
        return {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            athleteName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            modality: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            reps: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            time: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            peso: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        };
    }
}

export default Resultado;
