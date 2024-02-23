// src/models/User.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Auth extends Model {
  public id!: number;
  public mobile!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isVerified!: boolean;
}

Auth.init(
  {
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Auth",
  }
);

export default Auth;
