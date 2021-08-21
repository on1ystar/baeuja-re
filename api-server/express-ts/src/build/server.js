"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
// import morgan from 'morgan';
var cors = __importStar(require("cors"));
var rootRouter_1 = __importDefault(require("./routers/rootRouter"));
// console.log(morgan);
var app = express_1.default();
// const logger = morgan('dev');
var port = Number(process.env.PORT) || 4000;
app.use(helmet_1.default());
app.set('views', process.cwd() + '/src/views');
// app.use(logger);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors.default);
app.use('/', rootRouter_1.default); // 루트 라우트
app.listen(port, function () {
    // eslint-disable-next-line no-console
    return console.log("\u2705 Server listening on api.k-peach.io");
});
//# sourceMappingURL=server.js.map