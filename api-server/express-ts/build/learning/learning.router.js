"use strict";
/**
    @description /learning/*
    @version PEAC-161 get learning unit with sentences for main learning UI
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var learning_controller_1 = require("./learning.controller");
var learningRouter = express_1.default.Router();
learningRouter.get('/', function (req, res) { return res.send('For Learning App'); });
learningRouter.get('/contents/:contentId/units/:unitIndex', learning_controller_1.getLearningUnit);
learningRouter.post('/sentences/:sentenceId/evaluation', learning_controller_1.evaluateUserVoice);
exports.default = learningRouter;
//# sourceMappingURL=learning.router.js.map