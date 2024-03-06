"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_joi_validation_1 = require("express-joi-validation");
const auth_module_1 = __importDefault(require("../modules/auth.module"));
const auth_1 = __importDefault(require("../schema/auth"));
const validator = (0, express_joi_validation_1.createValidator)();
const router = express_1.default.Router();
router
    .route('/login')
    .post(validator.body(auth_1.default.authLoginSchema), auth_module_1.default.authLogin);
router
    .route('/register')
    .post(validator.body(auth_1.default.authRegisterSchema), auth_module_1.default.registerAuth);
router
    .route('/activate')
    .put(validator.query(auth_1.default.authActivateSchema), auth_module_1.default.activateAuth);
router
    .route('/resendcode')
    .put(validator.query(auth_1.default.authResendCodeSchema), auth_module_1.default.resendCode);
router
    .route('/recoveraccess')
    .post(validator.query(auth_1.default.authResendCodeSchema), auth_module_1.default.recoverAccess);
router
    .route('/changepassword')
    .post(validator.query(auth_1.default.authChangePasswordSchema), auth_module_1.default.changePassword);
exports.default = router;
