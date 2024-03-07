// src/models/User.ts
import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/db';

class Requirements extends Model {
  public id!: number;
  public drLicense!: string;
  public email!: string;
}

Requirements.init(
  {
    drLicense: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Requirements',
  },
);

export default Requirements;
