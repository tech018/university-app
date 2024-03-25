import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import * as Joi from 'joi';

export interface PaymentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    price: string;
    desc: string;
  };
}

export const PaymentSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.string().required(),
  desc: Joi.string().required(),
});

export interface ApprovedPaymentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    payerId: string;
    paymentId: string;
    total: string;
    email: string;
    appId: number;
  };
}

export const ApprovedPaymentSchema = Joi.object({
  payerId: Joi.string().required(),
  paymentId: Joi.string().required(),
  total: Joi.string().required(),
  email: Joi.string().required().email(),
  appId: Joi.string().required(),
});

export default {
  ApprovedPaymentSchema,
  PaymentSchema,
};
