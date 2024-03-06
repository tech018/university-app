"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/User.ts
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class OTP extends sequelize_1.Model {
}
OTP.init({
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    authId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    expiration: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: "OTP",
});
exports.default = OTP;
