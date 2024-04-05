import express from 'express';
import {createValidator} from 'express-joi-validation';
import applicationModule from '../modules/application.module';
import validation from '../schema/application';
import genetator from '../generator/genetator';
import multer from 'multer';
import path from 'path';

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
  .route('/alluserapplications')
  .get(
    validator.query(validation.requirementInfoSchema),
    genetator.verifyToken,
    applicationModule.getUserApplications,
  );

router
  .route('/create/application')
  .post(
    validator.body(validation.dataRequirementSchema),
    genetator.verifyToken,
    applicationModule.createApplication,
  );

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
  // limits: {
  //   fileSize: 1024 * 1024,
  // },
});

router
  .route('/oruploader')
  .post(upload.single('image'), applicationModule.uploadOfficialReciept);

export default router;
