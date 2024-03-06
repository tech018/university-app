"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_joi_validation_1 = require("express-joi-validation");
const Joi = __importStar(require("joi"));
const authRegisterSchema = Joi.object({
    password: Joi.string().required().min(8),
    email: Joi.string().email().required(),
    mobile: Joi.string().required().min(11),
});
const authActivateSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
});
const authResendCodeSchema = Joi.object({
    email: Joi.string().email().required(),
});
const authChangePasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
    newpassword: Joi.string().required().min(8),
});
const authLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
});
exports.default = {
    authRegisterSchema,
    authActivateSchema,
    authResendCodeSchema,
    authChangePasswordSchema,
    authLoginSchema,
};
