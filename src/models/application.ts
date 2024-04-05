// src/models/User.ts
import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/db';

class Applications extends Model {
  public id!: number;
  public applicationType!: string;
  public vehicleType!: string;
  public plateNumber!: string;
  public email!: string;
  public imageURI!: string;
}

Applications.init(
  {
    applicationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageURI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // status: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // dateofApproval: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
  },
  {
    sequelize,
    modelName: 'Applications',
  },
);

export default Applications;
