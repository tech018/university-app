// src/models/User.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class OTP extends Model {
  public id!: number;
  public email!: string;
  public otp!: number;
  public expiration!: string;
}

OTP.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    authId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OTP",
  }
);

export default OTP;
