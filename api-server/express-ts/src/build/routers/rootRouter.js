"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var rootRouter = express_1.default.Router();
rootRouter.get('/', function (req, res) {
    res.send('<h2>Welcome to Peach API</h2>');
});
exports.default = rootRouter;
//# sourceMappingURL=rootRouter.js.map