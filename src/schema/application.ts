import {ContainerTypes, ValidatedRequestSchema} from 'express-joi-validation';
import * as Joi from 'joi';

export interface RequirementsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    data: string;
  };
}

const requirementsSchema = Joi.object({
  data: Joi.string().email().required(),
});

export default {
  requirementsSchema,
};
