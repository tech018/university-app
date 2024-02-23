import moment, { Moment } from "moment";
import appConfig from "../config/index";
import jwt from "jsonwebtoken";
export const randomNumber = (length: number): number => {
  return Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  );
};

const expiration = (): string => {
  const expires = moment.utc().add(5, "minutes").toISOString();

  return expires;
};

const currentDate: Moment = moment(new Date()).utc();

const generateToken = (
  userId: number,
  email: string,
  expires: Moment,
  role: string,
  secret = appConfig.app_secret_key
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
  .add(appConfig.jwt.jwtminutesexpire, "day");

export default {
  randomNumber,
  currentDate,
  expiration,
  generateToken,
  accessTokenExpires,
};
