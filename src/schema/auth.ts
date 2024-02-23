import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import * as Joi from "joi";

export interface AuthRegisterRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    password: string;
    email: string;
    mobile: string;
  };
}

const authRegisterSchema = Joi.object({
  password: Joi.string().required().min(8),
  email: Joi.string().email().required(),
  mobile: Joi.string().required().min(11),
});

export interface AuthActivateRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
    otp: number;
  };
}

const authActivateSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
});

export interface AuthResendCodeRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
  };
}

const authResendCodeSchema = Joi.object({
  email: Joi.string().email().required(),
});

export interface AuthChangePasswordRequestSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    otp: number;
    newpassword: string;
  };
}

const authChangePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
  newpassword: Joi.string().required().min(8),
});

export interface AuthLoginRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    password: string;
  };
}

const authLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

export default {
  authRegisterSchema,
  authActivateSchema,
  authResendCodeSchema,
  authChangePasswordSchema,
  authLoginSchema,
};
