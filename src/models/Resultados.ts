import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";

interface ResultadoAttributes {
  id?: number;
  athleteName: string;
  modality: string;
  reps: number;
}

class Resultado extends Model<ResultadoAttributes> implements ResultadoAttributes {
  public id!: number;
  public athleteName!: string;
  public modality!: string;
  public reps!: number;
}

Resultado.init(
  {
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
  },
  {
    sequelize,
    tableName: "resultados",
    timestamps: true,
  },
);

export default Resultado;
