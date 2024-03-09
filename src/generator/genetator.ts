import moment, {Moment} from 'moment';
import appConfig from '../config/index';
import jwt, {JwtPayload, Secret} from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import Auth from '../models/auth';
import {where} from 'sequelize';
import config from '../config/index';
export const randomNumber = (length: number): number => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
  );
};

const expiration = (): string => {
  const expires = moment.utc().add(5, 'minutes').toISOString();

  return expires;
};

const currentDate: Moment = moment(new Date()).utc();

const generateToken = (
  userId: number,
  email: string,
  expires: Moment,
  role: string,
  secret = appConfig.app_secret_key,
): string => {
  const payload = {
    sub: userId,
    email,
    role,
    iat: moment().utc().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const accessTokenExpires = moment()
  .utc()
  .add(appConfig.jwt.jwtminutesexpire, 'day');

const JWT_KEY = config.app_secret_key as Secret;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization?.startsWith('Bearer');

  // const xAppKey = req.headers.x_app_key;
  // if (xAppKey !== (process.env.X_API_KEY as string)) {
  //   res.status(403).json({message: 'Application key is invalid or not found'});
  // }

  if (!authHeader) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({message: 'Invalid not token', redirect: 'AUTHLOGINSCREEN'});
  }
  try {
    const token = req.headers.authorization?.split(' ')[1] as string;

    const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;

    if (Date.now() >= decoded.exp! * 1000) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'Session is alreadt expired',
        redirect: 'AUTHLOGINSCREEN',
      });
    }

    console.log('decoded', decoded);

    const checkEmail = await Auth.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!checkEmail) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({message: 'Unauthorized email', redirect: 'AUTHLOGINSCREEN'});
    }

    if (decoded) {
      next();
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({message: 'Invalid session', redirect: 'AUTHLOGINSCREEN'});
    }
  } catch (error) {
    console.log('application error', error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({message: 'General error', redirect: 'APPLICATIONERROR '});
  }
};

export default {
  randomNumber,
  currentDate,
  expiration,
  generateToken,
  accessTokenExpires,
  verifyToken,
};
