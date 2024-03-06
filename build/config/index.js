"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const envVarsSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid('production', 'development').required(),
    PORT: joi_1.default.number().default(8000),
    DB_URI: joi_1.default.string().required(),
    APP_SECRET_KEY: joi_1.default.string().required(),
    CUSTOM_KEY: joi_1.default.string().required(),
    EMAIL_SENDER: joi_1.default.string().required(),
    EMAIL_SECRET: joi_1.default.string().required(),
    EMAIL_ID: joi_1.default.string().required(),
    EMAIL_REFRESH_TOKEN: joi_1.default.string().required(),
    EMAIL_REDIRECT_URI: joi_1.default.string().required(),
    EMAIL_TYPE: joi_1.default.string().required(),
    EMAIL_SERVICE: joi_1.default.string().required(),
    FRONTEND_URI: joi_1.default.string().required(),
    PAYPAL_CLIENT_ID: joi_1.default.string().required(),
    PAYPAL_CLIENT_SECRET: joi_1.default.string().required(),
    PAYPAL_MODE: joi_1.default.string().required(),
    TOKEN_MINUTES_EXPIRE: joi_1.default.number().required(),
})
    .unknown();
const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.default = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    app_secret_key: envVars.APP_SECRET_KEY,
    database: envVars.DB_URI,
    google: {
        sender: envVars.EMAIL_SENDER,
        secret: envVars.EMAIL_SECRET,
        clientId: envVars.EMAIL_ID,
        refresToken: envVars.EMAIL_REFRESH_TOKEN,
        redirectUri: envVars.EMAIL_REDIRECT_URI,
        service: envVars.EMAIL_SERVICE,
        type: envVars.EMAIL_TYPE,
    },
    paypal: {
        clientId: envVars.PAYPAL_CLIENT_ID,
        clientSecret: envVars.PAYPAL_CLIENT_SECRET,
        mode: envVars.PAYPAL_MODE,
    },
    jwt: {
        jwtminutesexpire: envVars.TOKEN_MINUTES_EXPIRE,
    },
};
