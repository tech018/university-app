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
const auth_1 = __importDefault(require("./auth"));
const otp_1 = __importDefault(require("./otp"));
class Associations {
    static associate() {
        auth_1.default.hasMany(otp_1.default, { foreignKey: "authId" });
        otp_1.default.belongsTo(auth_1.default, { foreignKey: "authId" });
    }
    static sync() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.associate();
                yield auth_1.default.sync();
                yield otp_1.default.sync();
            }
            catch (error) {
                console.log("erros", error);
            }
        });
    }
}
exports.default = Associations;
