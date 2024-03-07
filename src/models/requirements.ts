// src/models/User.ts
import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/db';

class Requirements extends Model {
  public id!: number;
  public drLicenseNo!: string;
  public email!: string;
  public fullName!: string;
  public age!: string;
  public address!: string;
  public dateOfBirth!: string;
  public licenseExpiration!: string;
  public gender!: string;
}

Requirements.init(
  {
    drLicenseNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licenseExpiration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
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
