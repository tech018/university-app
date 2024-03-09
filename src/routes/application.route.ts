import express from 'express';
import {createValidator} from 'express-joi-validation';
import applicationModule from '../modules/application.module';
import validation from '../schema/application';
import genetator from '../generator/genetator';

const validator = createValidator();
const router = express.Router();

router
  .route('/requirements')
  .post(
    validator.body(validation.requirementsSchema),
    applicationModule.getRequirements,
  );

router
  .route('/getdriverinfo')
  .get(
    validator.query(validation.requirementInfoSchema),
    genetator.verifyToken,
    applicationModule.requiremenInfo,
  );

export default router;
