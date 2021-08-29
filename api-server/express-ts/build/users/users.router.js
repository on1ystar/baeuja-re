"use strict";
/*
    /users/*
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_controller_1 = require("./users.controller");
var usersRouter = express_1.default.Router();
usersRouter.get('/', function (req, res) { return res.send('For Users App'); });
usersRouter.post('/', users_controller_1.createUser);
exports.default = usersRouter;
//# sourceMappingURL=users.router.js.map