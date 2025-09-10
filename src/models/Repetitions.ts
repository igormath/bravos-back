import { DataTypes, Model } from "sequelize";

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

    public static getAttributes() {
        return {
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
        };
    }
}

export default Repetition;
