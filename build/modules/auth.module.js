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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const registerAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, mobile } = req.body;
    const response = yield auth_service_1.default.registerAuth({
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
});
const activateAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.query;
    const response = yield auth_service_1.default.activateAuth({ otp, email });
    if (response)
        return res
            .status(response.code)
            .json({ message: response.message, redirect: response.redirect });
});
const resendCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    const response = yield auth_service_1.default.resendOTP(email);
    if (response)
        return res
            .status(response.code)
            .json({ message: response.message, redirect: response.redirect });
});
const recoverAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    const response = yield auth_service_1.default.recoverAccess(email);
    if (response)
        return res.status(response.code).json({
            email: response.email,
            message: response.message,
            redirect: response.redirect,
        });
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newpassword } = req.query;
    const response = yield auth_service_1.default.changePassword({
        email,
        otp,
        newpassword,
    });
    if (response)
        return res
            .status(response.code)
            .json({
            message: response.message,
            redirect: response.redirect,
            authCode: response.authCode,
        });
});
const authLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const response = yield auth_service_1.default.authLogin(email, password);
    if (response)
        return res.status(response.code).json({
            message: response.message,
            redirect: response.redirect,
            token: response.token,
        });
});
exports.default = {
    registerAuth,
    resendCode,
    activateAuth,
    recoverAccess,
    changePassword,
    authLogin,
};
