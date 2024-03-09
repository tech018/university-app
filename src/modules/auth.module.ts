import {ValidatedRequest} from 'express-joi-validation';
import {
  AuthActivateRequestSchema,
  AuthChangePasswordRequestSchema,
  AuthLoginRequestSchema,
  AuthRegisterRequestSchema,
  AuthResendCodeRequestSchema,
} from '../schema/auth';
import {Response} from 'express';
import authService from '../services/auth.service';

const registerAuth = async (
  req: ValidatedRequest<AuthRegisterRequestSchema>,
  res: Response,
) => {
  const {email, password, mobile} = req.body;
  const response = await authService.registerAuth({
    email,
    password,
    mobile,
  });
  if (response)
    return res.status(response.code).json({
      email: response.email,
      message: response.message,
      redirect: response.redirect,
    });
};

const activateAuth = async (
  req: ValidatedRequest<AuthActivateRequestSchema>,
  res: Response,
) => {
  const {email, otp} = req.query;
  const response = await authService.activateAuth({otp, email});
  if (response)
    return res.status(response.code).json({
      message: response.message,
      redirect: response.redirect,
      token: response.token,
      email: response.email,
    });
};

const resendCode = async (
  req: ValidatedRequest<AuthResendCodeRequestSchema>,
  res: Response,
) => {
  const {email} = req.query;
  const response = await authService.resendOTP(email);
  if (response)
    return res
      .status(response.code)
      .json({message: response.message, redirect: response.redirect});
};

const recoverAccess = async (
  req: ValidatedRequest<AuthResendCodeRequestSchema>,
  res: Response,
) => {
  const {email} = req.query;
  const response = await authService.recoverAccess(email);
  if (response)
    return res.status(response.code).json({
      email: response.email,
      message: response.message,
      redirect: response.redirect,
    });
};

const changePassword = async (
  req: ValidatedRequest<AuthChangePasswordRequestSchema>,
  res: Response,
) => {
  const {email, otp, newpassword} = req.query;
  const response = await authService.changePassword({
    email,
    otp,
    newpassword,
  });
  if (response)
    return res.status(response.code).json({
      message: response.message,
      redirect: response.redirect,
      authCode: response.authCode,
    });
};

const authLogin = async (
  req: ValidatedRequest<AuthLoginRequestSchema>,
  res: Response,
) => {
  const {email, password} = req.body;
  const response = await authService.authLogin(email, password);
  if (response)
    return res.status(response.code).json({
      message: response.message,
      redirect: response.redirect,
      token: response.token,
      email: response.email,
    });
};

export default {
  registerAuth,
  resendCode,
  activateAuth,
  recoverAccess,
  changePassword,
  authLogin,
};
