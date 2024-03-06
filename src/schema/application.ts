import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import * as Joi from 'joi';

export interface RequirementsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    data: string;
  };
}

const requirementsSchema = Joi.object({
  data: Joi.string().required(),
});

export default {
  requirementsSchema,
};
