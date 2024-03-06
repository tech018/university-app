"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumber = void 0;
const moment_1 = __importDefault(require("moment"));
const index_1 = __importDefault(require("../config/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const randomNumber = (length) => {
    return Math.floor(Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
};
exports.randomNumber = randomNumber;
const expiration = () => {
    const expires = moment_1.default.utc().add(5, "minutes").toISOString();
    return expires;
};
const currentDate = (0, moment_1.default)(new Date()).utc();
const generateToken = (userId, email, expires, role, secret = index_1.default.app_secret_key) => {
    const payload = {
        sub: userId,
        email,
        role,
        iat: (0, moment_1.default)().utc().unix(),
        exp: expires.unix(),
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
const accessTokenExpires = (0, moment_1.default)()
    .utc()
    .add(index_1.default.jwt.jwtminutesexpire, "day");
exports.default = {
    randomNumber: exports.randomNumber,
    currentDate,
    expiration,
    generateToken,
    accessTokenExpires,
};
