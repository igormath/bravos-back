import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";

interface AthleteAttributes {
  id?: number;
  name: string;
  gender: "Masculino" | "Feminino";
}

class Athlete extends Model<AthleteAttributes> implements AthleteAttributes {
  public id!: number;
  public name!: string;
  public gender!: "Masculino" | "Feminino";
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
      unique: true,
    },
    gender: {
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
