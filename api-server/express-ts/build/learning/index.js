"use strict";
/*
    version: PEAC-39-learning-unit-sentence-with-evaluation
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var learning_router_1 = __importDefault(require("./learning.router"));
var learningApp = express_1.default();
learningApp.use('/', learning_router_1.default);
exports.default = learningApp;
//# sourceMappingURL=index.js.map