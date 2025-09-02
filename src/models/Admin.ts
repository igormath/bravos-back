import { DataTypes, Model } from "sequelize";
import sequelize from "../database/database";

interface AdminAttributes {
  id?: number;
  username: string;
  passwordHash: string;
  laneNumber: number;
}

class Admin extends Model<AdminAttributes> implements AdminAttributes {
  public id!: number;
  public username!: string;
  public passwordHash!: string;
  public laneNumber!: number;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    laneNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "admins",
    timestamps: false,
  },
);

export default Admin;
