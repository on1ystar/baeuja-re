"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_router_1 = __importDefault(require("./users.router"));
var usersApp = express_1.default();
usersApp.use('/', users_router_1.default);
exports.default = usersApp;
//# sourceMappingURL=index.js.map