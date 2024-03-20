import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import * as Joi from 'joi';

export interface RequirementsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    data: string;
    email: string;
  };
}

const requirementsSchema = Joi.object({
  data: Joi.string().required(),
  email: Joi.string().email().required(),
});

export interface RequirementInfoRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    email: string;
  };
}

const requirementInfoSchema = Joi.object({
  email: Joi.string().email().required(),
});

export interface application {
  email: string;
  plateNumber: string;
  applicationType: string;
  vehicleType: string;
}

export interface DataRequirementsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: application;
}

const dataRequirementSchema = Joi.object({
  email: Joi.string().email().required(),
  plateNumber: Joi.string().required(),
  applicationType: Joi.string().required(),
  vehicleType: Joi.string().required(),
});

export default {
  requirementsSchema,
  requirementInfoSchema,
  dataRequirementSchema,
};
