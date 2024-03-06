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
const http_status_1 = __importDefault(require("http-status"));
const auth_1 = __importDefault(require("../models/auth"));
const mailer_1 = __importDefault(require("./mailer"));
const encription_1 = __importDefault(require("../generator/encription"));
const email_1 = __importDefault(require("./email"));
const otp_1 = __importDefault(require("../models/otp"));
const genetator_1 = __importDefault(require("../generator/genetator"));
const moment_1 = __importDefault(require("moment"));
const authLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield checkEmail(email);
        if (!emailExist)
            return {
                code: http_status_1.default.BAD_REQUEST,
                message: 'Invalid login credentials',
            };
        const auth = yield auth_1.default.findOne({ where: { email } });
        if (auth) {
            if (!auth.isVerified) {
                return {
                    code: http_status_1.default.LOCKED,
                    message: `Email ${email} is not yet verified`,
                    redirect: 'AUTHACTIVATESCREEN',
                };
            }
            if (!(yield encription_1.default.isPasswordMatch(password, auth.password))) {
                return {
                    code: http_status_1.default.BAD_REQUEST,
                    message: 'Invalid login credentials',
                };
            }
            return {
                code: http_status_1.default.OK,
                token: genetator_1.default.generateToken(auth.id, auth.email, genetator_1.default.accessTokenExpires, auth.role),
                redirect: 'DashboardScreen',
            };
        }
        return {
            code: http_status_1.default.BAD_REQUEST,
            message: 'There is something in a login service',
            redirect: 'AuthErrorScreen',
        };
    }
    catch (error) {
        return {
            code: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            redirect: 'AuthErrorScreen',
        };
    }
});
const checkEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield auth_1.default.findOne({ where: { email } });
    if (exist)
        return true;
    return false;
});
const resendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield checkEmail(email);
        if (!emailExist)
            return {
                code: http_status_1.default.BAD_REQUEST,
                message: `Email ${email} is not registered`,
            };
        const otp = genetator_1.default.randomNumber(6);
        const successUpdate = yield otp_1.default.update({ otp, expiration: genetator_1.default.expiration() }, {
            where: {
                email,
            },
        });
        if (successUpdate) {
            const mailOptions = {
                from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
                to: email,
                subject: 'Resend verification code',
                text: 'Greetings from Tarlac Agricultural University',
                html: (0, email_1.default)({
                    message: `Hi, ${email.split('@')[0]} Here is your new OTP : ${otp} to activate your account.`,
                }),
            };
            if (mailOptions) {
                yield mailer_1.default.sendEmail(mailOptions);
            }
            return {
                code: http_status_1.default.OK,
                message: `We send new otp in your email ${email}, please check and activated your account`,
                redirect: 'AuthActivateScreen',
            };
        }
    }
    catch (error) {
        return {
            code: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            redirect: 'AuthErrorScreen',
        };
    }
});
const activateAuth = ({ otp, email }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield checkEmail(email);
        if (!emailExist)
            return {
                code: http_status_1.default.BAD_REQUEST,
                message: `Email ${email} is not registered`,
            };
        const otpExist = yield otp_1.default.findOne({ where: { email } });
        if ((otpExist === null || otpExist === void 0 ? void 0 : otpExist.otp) !== otp)
            return {
                code: http_status_1.default.UNAUTHORIZED,
                message: `OTP is invalid`,
            };
        const currentDateTime = (0, moment_1.default)().utc();
        const expiredOTp = (0, moment_1.default)(otpExist.expiration).isBefore(currentDateTime);
        if (expiredOTp)
            return {
                code: http_status_1.default.UNAUTHORIZED,
                message: `Your OTP is already expired`,
            };
        const successUpdate = yield auth_1.default.update({ isVerified: true }, {
            where: {
                email,
            },
        });
        if (successUpdate) {
            const deleteOtp = yield otp_1.default.destroy({
                where: {
                    email,
                },
            });
            if (deleteOtp)
                return {
                    code: http_status_1.default.OK,
                    message: `Successfully activate your account ${email}`,
                    redirect: 'AUTHLOGINSCREEN',
                };
            return {
                code: http_status_1.default.BAD_REQUEST,
                message: 'There is something wrong in our end',
                redirect: 'AuthErrorScreen',
            };
        }
        return {
            code: http_status_1.default.BAD_REQUEST,
            response: 'There is something wrong in our end',
            redirect: 'AuthErrorScreen',
        };
    }
    catch (error) {
        return {
            code: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            redirect: 'AuthErrorScreen',
        };
    }
});
const registerAuth = ({ email, mobile, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authExist = yield checkEmail(email);
        if (authExist)
            return {
                code: http_status_1.default.BAD_REQUEST,
                message: `Email ${email} is already registered!`,
            };
        const otp = genetator_1.default.randomNumber(6);
        const newUser = yield auth_1.default.create({
            email,
            mobile,
            password: yield encription_1.default.encryptPassword(password),
            role: 'user',
            isVerified: false,
        });
        if (newUser) {
            const newOTP = yield otp_1.default.create({
                email,
                otp,
                authId: newUser.id,
                expiration: genetator_1.default.expiration(),
            });
            if (newOTP) {
                const mailOptions = {
                    from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
                    to: email,
                    subject: 'Email verification code',
                    text: 'Greetings from Tarlac Agricultural University',
                    html: (0, email_1.default)({
                        message: `Hi, ${email.split('@')[0]} If you've signed up for Electronic Gatepass,
                  you'll find here. The OTP is ${newOTP.otp} to activate your account..`,
                    }),
                };
                if (mailOptions) {
                    yield mailer_1.default.sendEmail(mailOptions);
                }
                return {
                    code: http_status_1.default.OK,
                    email,
                    message: `Successfully registered email ${email}, we send a verfication code in your email please check and activated your account`,
                    redirect: 'AUTHACTIVATESCREEN',
                };
            }
        }
    }
    catch (error) {
        return {
            code: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            redirect: 'AuthErrorScreen',
        };
    }
});
const recoverAccess = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield checkEmail(email);
        if (!emailExist)
            return {
                code: http_status_1.default.BAD_REQUEST,
                message: `Email ${email} is not registered`,
            };
        const otp = genetator_1.default.randomNumber(6);
        const checkotp = yield otp_1.default.findOne({ where: { email } });
        if (checkotp === null) {
            const authDetails = yield auth_1.default.findOne({ where: { email } });
            if (authDetails) {
                const newOTP = yield otp_1.default.create({
                    email,
                    otp,
                    authId: authDetails.id,
                    expiration: genetator_1.default.expiration(),
                });
                if (newOTP) {
                    const mailOptions = {
                        from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
                        to: email,
                        subject: 'Recover Access',
                        text: 'Greetings from Tarlac Agricultural University',
                        html: (0, email_1.default)({
                            message: `Hi, ${email.split('@')[0]} Here is your otp ${otp} to recover your account `,
                        }),
                    };
                    if (mailOptions) {
                        yield mailer_1.default.sendEmail(mailOptions);
                    }
                    return {
                        code: http_status_1.default.OK,
                        email,
                        message: `We send another otp in your ${email}, please check and recover your account`,
                        redirect: 'AUTHCHANGEPASSWORDSCREEN',
                    };
                }
            }
            else {
                return {
                    code: http_status_1.default.BAD_REQUEST,
                    email,
                    message: `Something wrong with the email ${email}`,
                    redirect: 'AuthErrorScreen',
                };
            }
        }
        const updated = yield otp_1.default.update({ otp, expiration: genetator_1.default.expiration() }, {
            where: {
                email,
            },
        });
        if (updated) {
            const mailOptions = {
                from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
                to: email,
                subject: 'Recover Access',
                text: 'Greetings from Tarlac Agricultural University',
                html: (0, email_1.default)({
                    message: `Hi, ${email.split('@')[0]} Here is your otp ${otp} to recover your account `,
                }),
            };
            if (mailOptions) {
                yield mailer_1.default.sendEmail(mailOptions);
            }
            return {
                code: http_status_1.default.OK,
                email,
                message: `We send an otp in your ${email}, please check and recover your account`,
                redirect: 'AUTHCHANGEPASSWORDSCREEN',
            };
        }
        else {
            return {
                code: http_status_1.default.BAD_REQUEST,
                email,
                message: `Something wrong with the email ${email}`,
                redirect: 'AuthErrorScreen',
            };
        }
    }
    catch (error) {
        return {
            code: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            redirect: 'AuthErrorScreen',
        };
    }
});
const changePassword = ({ email, otp, newpassword }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield checkEmail(email);
        if (!emailExist)
            return {
                code: http_status_1.default.BAD_REQUEST,
                message: `Email ${email} is not registered`,
            };
        const otpExist = yield otp_1.default.findOne({ where: { email } });
        if ((otpExist === null || otpExist === void 0 ? void 0 : otpExist.otp) !== otp)
            return {
                code: http_status_1.default.UNAUTHORIZED,
                message: `OTP ${otp} is invalid`,
                authCode: 1,
            };
        const currentDateTime = (0, moment_1.default)().utc();
        const expiredOTp = (0, moment_1.default)(otpExist.expiration).isBefore(currentDateTime);
        if (expiredOTp)
            return {
                code: http_status_1.default.UNAUTHORIZED,
                message: `Your OTP ${otp} is already expired`,
                authCode: 1,
            };
        const successUpdate = yield auth_1.default.update({ password: yield encription_1.default.encryptPassword(newpassword) }, {
            where: {
                email,
            },
        });
        if (successUpdate)
            return {
                code: http_status_1.default.OK,
                message: `You have successfully recovered your password in your account ${email}`,
                redirect: 'AUTHLOGINSCREEN',
            };
    }
    catch (error) {
        console.log('error', error);
        return {
            code: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            redirect: 'AuthErrorScreen',
        };
    }
});
exports.default = {
    checkEmail,
    registerAuth,
    activateAuth,
    resendOTP,
    recoverAccess,
    changePassword,
    authLogin,
};
