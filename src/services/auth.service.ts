import httpStatus from 'http-status';
import Auth from '../models/auth';
import mailer from './mailer';
import encription from '../generator/encription';
import GenerateEmail from './email';
import OTP from '../models/otp';
import generator from '../generator/genetator';
import moment from 'moment';
import Requirements from '../models/requirements';

interface RegisterAuth {
  email: string;
  mobile: string;
  password: string;
}

interface OTPType {
  otp: number;
  email: string;
}

interface ChangePass extends OTPType {
  newpassword: string;
}

const authLogin = async (email: string, password: string) => {
  try {
    const emailExist = await checkEmail(email);
    if (!emailExist)
      return {
        code: httpStatus.BAD_REQUEST,
        message: 'Invalid login credentials',
      };

    const auth = await Auth.findOne({where: {email}});
    const drLicense = await Requirements.findAll({where: {email}});
    if (auth) {
      if (!auth.isVerified) {
        return {
          code: httpStatus.LOCKED,
          message: `Email ${email} is not yet verified`,
          redirect: 'AUTHACTIVATESCREEN',
        };
      }
      if (!(await encription.isPasswordMatch(password, auth.password))) {
        return {
          code: httpStatus.BAD_REQUEST,
          message: 'Invalid login credentials',
        };
      }

      if (drLicense.length <= 0)
        return {
          code: httpStatus.BAD_REQUEST,
          redirect: 'APPLICATIONENTRY',
          redirectCode: 112,
          message: `This account doesn't have a account information, please setup your account information`,
          email,
          token: generator.generateToken(
            auth.id,
            auth.email,
            generator.accessTokenExpires,
            auth.role,
          ),
        };

      return {
        code: httpStatus.OK,
        token: generator.generateToken(
          auth.id,
          auth.email,
          generator.accessTokenExpires,
          auth.role,
        ),
        email: auth.email,
        redirect: 'DASHBOARDSCREEN',
      };
    }

    return {
      code: httpStatus.BAD_REQUEST,
      message: 'There is something in a login service',
      redirect: 'AuthErrorScreen',
    };
  } catch (error) {
    return {
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      redirect: 'AuthErrorScreen',
    };
  }
};

const checkEmail = async (email: string): Promise<boolean> => {
  const exist = await Auth.findOne({where: {email}});
  if (exist) return true;
  return false;
};

const resendOTP = async (email: string) => {
  try {
    const emailExist = await checkEmail(email);
    if (!emailExist)
      return {
        code: httpStatus.BAD_REQUEST,
        message: `Email ${email} is not registered`,
      };

    const otp = generator.randomNumber(6);

    const successUpdate = await OTP.update(
      {otp, expiration: generator.expiration()},
      {
        where: {
          email,
        },
      },
    );

    if (successUpdate) {
      const mailOptions = {
        from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
        to: email,
        subject: 'Resend verification code',
        text: 'Greetings from Tarlac Agricultural University',
        html: GenerateEmail({
          message: `Hi, ${
            email.split('@')[0]
          } Here is your new OTP : ${otp} to activate your account.`,
        }),
      };
      if (mailOptions) {
        await mailer.sendEmail(mailOptions);
      }

      return {
        code: httpStatus.OK,
        message: `We send new otp in your email ${email}, please check and activated your account`,
        redirect: 'AuthActivateScreen',
      };
    }
  } catch (error) {
    return {
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      redirect: 'AuthErrorScreen',
    };
  }
};

const activateAuth = async ({otp, email}: OTPType) => {
  try {
    const emailExist = await checkEmail(email);
    if (!emailExist)
      return {
        code: httpStatus.BAD_REQUEST,
        message: `Email ${email} is not registered`,
      };
    const otpExist = await OTP.findOne({where: {email}});

    if (otpExist?.otp !== otp)
      return {
        code: httpStatus.UNAUTHORIZED,
        message: `OTP is invalid`,
      };

    const currentDateTime = moment().utc();

    const expiredOTp = moment(otpExist.expiration).isBefore(currentDateTime);

    if (expiredOTp)
      return {
        code: httpStatus.UNAUTHORIZED,
        message: `Your OTP is already expired`,
      };

    const successUpdate = await Auth.update(
      {isVerified: true},
      {
        where: {
          email,
        },
      },
    );
    if (successUpdate) {
      const deleteOtp = await OTP.destroy({
        where: {
          email,
        },
      });

      const auth = await Auth.findOne({where: {email}});
      if (auth) {
        if (deleteOtp)
          return {
            code: httpStatus.OK,
            message: `Successfully activate your account ${email}`,
            redirect: 'APPLICATIONENTRY',
            token: generator.generateToken(
              auth.id,
              auth.email,
              generator.accessTokenExpires,
              auth.role,
            ),
            email: auth.email,
          };

        return {
          code: httpStatus.BAD_REQUEST,
          message: 'There is something wrong in our end',
          redirect: 'AuthErrorScreen',
        };
      }
    }
    return {
      code: httpStatus.BAD_REQUEST,
      response: 'There is something wrong in our end',
      redirect: 'AuthErrorScreen',
    };
  } catch (error) {
    return {
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      redirect: 'AuthErrorScreen',
    };
  }
};

const registerAuth = async ({email, mobile, password}: RegisterAuth) => {
  try {
    const authExist = await checkEmail(email);
    if (authExist)
      return {
        code: httpStatus.BAD_REQUEST,
        message: `Email ${email} is already registered!`,
      };

    const otp = generator.randomNumber(6);
    const newUser = await Auth.create({
      email,
      mobile,
      password: await encription.encryptPassword(password),
      role: 'user',
      isVerified: false,
    });

    if (newUser) {
      const newOTP = await OTP.create({
        email,
        otp,
        authId: newUser.id,
        expiration: generator.expiration(),
      });

      if (newOTP) {
        const mailOptions = {
          from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
          to: email,
          subject: 'Email verification code',
          text: 'Greetings from Tarlac Agricultural University',
          html: GenerateEmail({
            message: `Hi, ${
              email.split('@')[0]
            } If you've signed up for Electronic Gatepass,
                  you'll find here. The OTP is ${
                    newOTP.otp
                  } to activate your account..`,
          }),
        };
        if (mailOptions) {
          await mailer.sendEmail(mailOptions);
        }

        return {
          code: httpStatus.OK,
          email,
          message: `Successfully registered email ${email}, we send a verfication code in your email please check and activated your account`,
          redirect: 'AUTHACTIVATESCREEN',
        };
      }
    }
  } catch (error) {
    return {
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      redirect: 'AuthErrorScreen',
    };
  }
};

const recoverAccess = async (email: string) => {
  try {
    const emailExist = await checkEmail(email);
    if (!emailExist)
      return {
        code: httpStatus.BAD_REQUEST,
        message: `Email ${email} is not registered`,
      };
    const otp = generator.randomNumber(6);

    const checkotp = await OTP.findOne({where: {email}});

    if (checkotp === null) {
      const authDetails = await Auth.findOne({where: {email}});
      if (authDetails) {
        const newOTP = await OTP.create({
          email,
          otp,
          authId: authDetails.id,
          expiration: generator.expiration(),
        });

        if (newOTP) {
          const mailOptions = {
            from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
            to: email,
            subject: 'Recover Access',
            text: 'Greetings from Tarlac Agricultural University',
            html: GenerateEmail({
              message: `Hi, ${
                email.split('@')[0]
              } Here is your otp ${otp} to recover your account `,
            }),
          };
          if (mailOptions) {
            await mailer.sendEmail(mailOptions);
          }

          return {
            code: httpStatus.OK,
            email,
            message: `We send another otp in your ${email}, please check and recover your account`,
            redirect: 'AUTHCHANGEPASSWORDSCREEN',
          };
        }
      } else {
        return {
          code: httpStatus.BAD_REQUEST,
          email,
          message: `Something wrong with the email ${email}`,
          redirect: 'AuthErrorScreen',
        };
      }
    }

    const updated = await OTP.update(
      {otp, expiration: generator.expiration()},

      {
        where: {
          email,
        },
      },
    );

    if (updated) {
      const mailOptions = {
        from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
        to: email,
        subject: 'Recover Access',
        text: 'Greetings from Tarlac Agricultural University',
        html: GenerateEmail({
          message: `Hi, ${
            email.split('@')[0]
          } Here is your otp ${otp} to recover your account `,
        }),
      };
      if (mailOptions) {
        await mailer.sendEmail(mailOptions);
      }

      return {
        code: httpStatus.OK,
        email,
        message: `We send an otp in your ${email}, please check and recover your account`,
        redirect: 'AUTHCHANGEPASSWORDSCREEN',
      };
    } else {
      return {
        code: httpStatus.BAD_REQUEST,
        email,
        message: `Something wrong with the email ${email}`,
        redirect: 'AuthErrorScreen',
      };
    }
  } catch (error) {
    return {
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      redirect: 'AuthErrorScreen',
    };
  }
};

const changePassword = async ({email, otp, newpassword}: ChangePass) => {
  try {
    const emailExist = await checkEmail(email);
    if (!emailExist)
      return {
        code: httpStatus.BAD_REQUEST,
        message: `Email ${email} is not registered`,
      };
    const otpExist = await OTP.findOne({where: {email}});

    if (otpExist?.otp !== otp)
      return {
        code: httpStatus.UNAUTHORIZED,
        message: `OTP ${otp} is invalid`,
        authCode: 1,
      };

    const currentDateTime = moment().utc();

    const expiredOTp = moment(otpExist.expiration).isBefore(currentDateTime);

    if (expiredOTp)
      return {
        code: httpStatus.UNAUTHORIZED,
        message: `Your OTP ${otp} is already expired`,
        authCode: 1,
      };

    const successUpdate = await Auth.update(
      {password: await encription.encryptPassword(newpassword)},
      {
        where: {
          email,
        },
      },
    );

    if (successUpdate) {
      await OTP.destroy({
        where: {
          email,
        },
      });
      return {
        code: httpStatus.OK,
        message: `You have successfully recovered your password in your account ${email}`,
        redirect: 'AUTHLOGINSCREEN',
      };
    }
  } catch (error) {
    console.log('error', error);
    return {
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      redirect: 'AuthErrorScreen',
    };
  }
};

export default {
  checkEmail,
  registerAuth,
  activateAuth,
  resendOTP,
  recoverAccess,
  changePassword,
  authLogin,
};
