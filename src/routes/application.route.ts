import express from 'express';
import {createValidator} from 'express-joi-validation';
import applicationModule from '../modules/application.module';
import validation from '../schema/application';
import genetator from '../generator/genetator';
import multer from 'multer';

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

router
  .route('/create/application')
  .post(
    validator.body(validation.dataRequirementSchema),
    genetator.verifyToken,
    applicationModule.createApplication,
  );

const storage = multer.memoryStorage();
const upload = multer({storage});

router
  .route('/oruploader')
  .post(upload.single('image'), applicationModule.uploadOfficialReciept);

export default router;
