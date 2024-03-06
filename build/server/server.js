"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.application = void 0;
const express_1 = __importDefault(require("express"));
const bootstrap_1 = __importDefault(require("./bootstrap"));
exports.application = (0, express_1.default)();
(0, bootstrap_1.default)(exports.application);
