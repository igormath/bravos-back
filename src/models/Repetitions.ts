import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";

interface RepetitionAttributes {
  id?: number;
  athleteId: string | number;
  count: number;
}

class Repetition
  extends Model<RepetitionAttributes>
  implements RepetitionAttributes
{
  public id!: number;
  public athleteId!: string;
  public count!: number;
}

Repetition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    athleteId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "repetitions",
    timestamps: true,
  },
);

export default Repetition;
