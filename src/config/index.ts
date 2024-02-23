import Joi from "joi";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("production", "development").required(),
    PORT: Joi.number().default(8000),
    DB_HOST: Joi.string().default("localhost").required(),
    DB_DIALECT: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    APP_SECRET_KEY: Joi.string().required(),
    CUSTOM_KEY: Joi.string().required(),
    EMAIL_SENDER: Joi.string().required(),
    EMAIL_SECRET: Joi.string().required(),
    EMAIL_ID: Joi.string().required(),
    EMAIL_REFRESH_TOKEN: Joi.string().required(),
    EMAIL_REDIRECT_URI: Joi.string().required(),
    EMAIL_TYPE: Joi.string().required(),
    EMAIL_SERVICE: Joi.string().required(),
    FRONTEND_URI: Joi.string().required(),
    PAYPAL_CLIENT_ID: Joi.string().required(),
    PAYPAL_CLIENT_SECRET: Joi.string().required(),
    PAYPAL_MODE: Joi.string().required(),
    TOKEN_MINUTES_EXPIRE: Joi.number().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  app_secret_key: envVars.APP_SECRET_KEY,
  database: {
    name: envVars.DB_DATABASE,
    host: envVars.DB_HOST,
    dialect: envVars.DB_DIALECT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    port: envVars.DB_PORT,
  },
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
