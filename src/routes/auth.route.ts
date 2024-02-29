import express from 'express';
import {createValidator} from 'express-joi-validation';
import authModule from '../modules/auth.module';
import validation from '../schema/auth';

const validator = createValidator();
const router = express.Router();

router
  .route('/login')
  .post(validator.body(validation.authLoginSchema), authModule.authLogin);

router
  .route('/register')
  .post(validator.body(validation.authRegisterSchema), authModule.registerAuth);

router
  .route('/activate')
  .put(validator.query(validation.authActivateSchema), authModule.activateAuth);

router
  .route('/resendcode')
  .put(validator.query(validation.authResendCodeSchema), authModule.resendCode);

router
  .route('/recoveraccess')
  .post(
    validator.query(validation.authResendCodeSchema),
    authModule.recoverAccess,
  );

router
  .route('/changpassword')
  .post(
    validator.body(validation.authChangePasswordSchema),
    authModule.changePassword,
  );

export default router;
