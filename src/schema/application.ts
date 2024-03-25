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
  imageURI: string;
}

export interface DataRequirementsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: application;
}

const dataRequirementSchema = Joi.object({
  email: Joi.string().email().required(),
  plateNumber: Joi.string().required(),
  applicationType: Joi.string().required(),
  vehicleType: Joi.string().required(),
  imageURI: Joi.string().required(),
});

interface ImageData {
  name: string;
  type: string;
  uri: string;
}

export type ImageArray = [string, ImageData];

const imageDataSchema = {
  name: 'string',
  type: 'string',
  uri: 'string',
};

export const uploadSchema = {
  body: Joi.array()
    .items(
      Joi.array()
        .length(2)
        .ordered(Joi.string().valid('image'), Joi.object(imageDataSchema)),
    )
    .required(),
};

export default {
  requirementsSchema,
  requirementInfoSchema,
  dataRequirementSchema,
};
