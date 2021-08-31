"use strict";
/**
    @description learning App
    @version PEAC-161 get learning unit with sentences for main learning UI
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var contents_1 = __importDefault(require("./contents"));
var learning_router_1 = __importDefault(require("./learning.router"));
var sentences_1 = __importDefault(require("./sentences"));
var learningApp = express_1.default();
learningApp.use('/', learning_router_1.default);
learningApp.use('/contents', contents_1.default); // injecting learning/contents app
learningApp.use('/sentences', sentences_1.default); // injecting learning/sentences app
exports.default = learningApp;
//# sourceMappingURL=index.js.map