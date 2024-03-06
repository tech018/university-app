"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const config_1 = __importDefault(require("../config"));
const sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(config_1.default.google.clientId, config_1.default.google.secret, config_1.default.google.redirectUri);
    oAuth2Client.setCredentials({ refresh_token: config_1.default.google.refresToken });
    const accessToken = yield oAuth2Client.getAccessToken();
    const transport = nodemailer_1.default.createTransport({
        service: config_1.default.google.service,
        auth: {
            type: config_1.default.google.type,
            user: config_1.default.google.sender,
            clientId: config_1.default.google.clientId,
            clientSecret: config_1.default.google.secret,
            refreshToken: config_1.default.google.refresToken,
            accessToken: `${accessToken}`,
        },
    });
    yield transport.sendMail(mailOptions, (error) => {
        if (error) {
            return console.log("Failed email transport");
        }
        else {
            return console.log("Success email transferred");
        }
    });
});
exports.default = {
    sendEmail,
};
