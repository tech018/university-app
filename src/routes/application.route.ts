import express from 'express';
import {createValidator} from 'express-joi-validation';
import applicationModule from '../modules/application.module';
import validation from '../schema/application';

const validator = createValidator();
const router = express.Router();

router
  .route('/requirements')
  .post(
    validator.body(validation.requirementsSchema),
    applicationModule.getRequirements,
  );

export default router;
