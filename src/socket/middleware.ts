import { NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import appConfig from "../config/index";
import { Moment } from "moment";

export interface JWTUSER {
  sub: string;
  email: string;
  role: string;
  iat: Moment;
  exp: Moment;
}

type JWTUser = JwtPayload | JWTUSER;

declare module "socket.io" {
  interface Socket {
    user: JWTUser;
  }
}

const verifyTokenSocket = (socket: Socket, next: NextFunction) => {
  const token = socket.handshake.auth?.token;

  try {
    const decoded = jwt.verify(token, appConfig.app_secret_key) as JWTUser;
    socket.user = decoded;
  } catch (err) {
    const socketError = new Error("NOT_AUTHORIZED");
    return next(socketError);
  }

  next();
};

export default verifyTokenSocket;
