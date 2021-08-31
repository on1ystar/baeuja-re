"use strict";
/**
    @description /learning/*
    @version feature/api/PEAC-39-PEAC-162-user-voice-save-to-s3
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var learningRouter = express_1.default.Router();
learningRouter.get('/', function (req, res) { return res.send('For Learning App'); });
exports.default = learningRouter;
//# sourceMappingURL=learning.router.js.map