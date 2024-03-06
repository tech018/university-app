"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const index_1 = __importDefault(require("../config/index"));
const auth_route_1 = __importDefault(require("../routes/auth.route"));
const morgan_1 = __importDefault(require("morgan"));
const bootstrap = (application) => {
    application.disable("x-powered-by");
    application.use((0, cors_1.default)());
    application.use((0, cors_1.default)({ optionsSuccessStatus: 200 }));
    application.use(express_1.default.static(__dirname + "/files"));
    application.use(body_parser_1.default.urlencoded({ extended: true }));
    application.use(body_parser_1.default.json());
    application.use((0, morgan_1.default)(index_1.default.env === "development" ? "dev" : index_1.default.env));
    application.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
    application.use("/auth/v1", auth_route_1.default);
};
exports.default = bootstrap;
